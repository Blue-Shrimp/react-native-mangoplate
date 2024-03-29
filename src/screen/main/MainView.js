import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ImageBackground, SectionList, Alert, AppState } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeBaseView } from '@components'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Animated from 'react-native-reanimated'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import StepIndicator from 'react-native-step-indicator'
import { Utility } from '@common'
import Permissions from '@common/PermissionUtil'
import Geolocation from 'react-native-geolocation-service'
import { KakaoService } from '@network'
import FoodListView from './subviews/FoodListView'

import { states as mainStates, actions as mainActions } from '@screens/main/state'

const distanceMeter = [100, 300, 500, 1000, 3000]
const distanceStep = ['100m', '300m', '500m', '1km', '3km']
const customStyles = {
  stepIndicatorSize: 10,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 4,
  stepStrokeCurrentColor: '#ef8835',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#aaaaaa',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#aaaaaa',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#ffffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#ffffff',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#ffffff',
  labelColor: '#ffffff',
  labelSize: 13,
  currentStepLabelColor: '#ffffff',
}

const MainView = ({ navigation }) => {
  const appState = useRef(AppState.currentState)
  const dispatch = useDispatch()
  const {
    myLocation,
    isLocationPermission,
    mainList,
    pageInfo,
    carousel,
    regions,
    selectedRegions,
    options,
    initialSelectedOptions,
    selectedOptions,
    loading,
  } = useSelector(mainStates)
  const page = useRef(1)
  const [activeSlide, setActiveSlide] = useState(0)
  const gubunSheetRef = useRef(null)
  const [gubunValue, setGubunValue] = useState('avg')
  const distanceSheetRef = useRef(null)
  const [distanceValue, setDistanceValue] = useState(3)
  const regionSheetRef = useRef(null)
  const [selectedCurrentRegions, setSelectedCurrentRegions] = useState([])
  const filterSheetRef = useRef(null)
  const [selectedCurrentOptions, setSelectedCurrentOptions] = useState({})
  const sectionList = useRef(null)
  const regionsList = useRef(null)
  const isCheckingPermissions = useRef(false)

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    _requestPermission()
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  const handleAppStateChange = nextAppState => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (isCheckingPermissions.current) {
        _requestPermission()
      }
      isCheckingPermissions.current = false
    }
    if (appState.current.match(/inactive|active/) && nextAppState === 'background') {
    }
    appState.current = nextAppState
  }

  useEffect(() => {
    if (myLocation?.isDefaultLocation) {
      'regions'.clear()
      setSelectedCurrentRegions([])
      dispatch(mainActions.setSelectedRegions([]))
      _refreshList()
      _fetchMainFoodList(gubunValue, distanceValue, '')
    }
  }, [myLocation])

  const _requestPermission = async () => {
    await Permissions.checkPermission()
      .then(response => {
        dispatch(mainActions.setIsLocationPermission(true))
        _getCurrentLocation()
      })
      .catch(error => {
        return Permissions.requestLocation()
          .then(response => {
            dispatch(mainActions.setIsLocationPermission(true))
            _getCurrentLocation()
          })
          .catch(denyError => {
            console.log("'regions'.getValue() : ", 'regions'.getObject())
            dispatch(mainActions.setIsLocationPermission(false))
            _refreshList()
            if (!Utility.isNil('regions'.getObject())) {
              setSelectedCurrentRegions('regions'.getObject())
              dispatch(mainActions.setSelectedRegions('regions'.getObject()))
              _fetchMainFoodList(gubunValue, distanceValue, 'regions'.getObject()[0]?.title)
            } else {
              regionSheetRef.current.snapToIndex(0)
            }
          })
      })
  }

  const _getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        let myRegion = ''
        KakaoService.getAddressByCoordinate(position.coords).then(result => {
          myRegion = result[0]?.address?.region_1depth_name
          const current = {
            latitude: latitude,
            longitude: longitude,
            isDefaultLocation: true,
            region: myRegion,
          }

          dispatch(mainActions.setMyLocation(current))
        })
      },
      error => {
        _confirmPermission()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      },
    )
    return
  }

  const _confirmPermission = async () => {
    return Permissions.checkPermission()
      .then(response => {
        return Promise.resolve(true)
      })
      .catch(error => {
        const title = '위치권한 필요'
        const message = '위치권한 동의'
        const buttons = [
          {
            text: '허용 안함',
            onPress: () => {
              return Promise.reject(true)
            },
            style: 'cancel',
          },
          {
            text: '설정 이동',
            onPress: () => {
              isCheckingPermissions.current = true
              Permissions.openSetting()
              return Promise.reject(false)
            },
          },
        ]
        Alert.alert(title, message, buttons)
      })
  }

  const _fetchMainFoodList = (
    filter = gubunValue,
    distance = distanceValue,
    region = selectedRegions.length > 0 ? selectedRegions[0].title : '',
    option = selectedOptions,
  ) => {
    if (option['parking'][0]?.value === 'Y') {
      if (region !== '') {
        if (option['menu']?.length > 0) {
          let category = ''
          option['menu'].map(item => {
            category = category.concat(item.value, ',')
          })
          dispatch(
            mainActions.fetchMainFoodList({
              params: {
                guBun: filter,
                curPage: page.current,
                keyword: region === '전체' ? '' : region,
                parkingYn: 'Y',
                categoryKey: category,
              },
            }),
          )
        } else {
          dispatch(
            mainActions.fetchMainFoodList({
              params: {
                guBun: filter,
                curPage: page.current,
                keyword: region === '전체' ? '' : region,
                parkingYn: 'Y',
              },
            }),
          )
        }
      } else {
        if (option['menu']?.length > 0) {
          let category = ''
          option['menu'].map(item => {
            category = category.concat(item.value, ',')
          })
          dispatch(
            mainActions.fetchMainFoodList({
              params: {
                guBun: filter,
                curPage: page.current,
                distanceLimit: distanceMeter[distance],
                longitude: myLocation.longitude,
                latitude: myLocation.latitude,
                parkingYn: 'Y',
                categoryKey: category,
              },
            }),
          )
        } else {
          dispatch(
            mainActions.fetchMainFoodList({
              params: {
                guBun: filter,
                curPage: page.current,
                distanceLimit: distanceMeter[distance],
                longitude: myLocation.longitude,
                latitude: myLocation.latitude,
                parkingYn: 'Y',
              },
            }),
          )
        }
      }
    } else {
      if (region !== '') {
        if (option['menu']?.length > 0) {
          let category = ''
          option['menu'].map(item => {
            category = category.concat(item.value, ',')
          })
          dispatch(
            mainActions.fetchMainFoodList({
              params: {
                guBun: filter,
                curPage: page.current,
                keyword: region === '전체' ? '' : region,
                categoryKey: category,
              },
            }),
          )
        } else {
          dispatch(
            mainActions.fetchMainFoodList({
              params: {
                guBun: filter,
                curPage: page.current,
                keyword: region === '전체' ? '' : region,
              },
            }),
          )
        }
      } else {
        if (option['menu']?.length > 0) {
          let category = ''
          option['menu'].map(item => {
            category = category.concat(item.value, ',')
          })
          dispatch(
            mainActions.fetchMainFoodList({
              params: {
                guBun: filter,
                curPage: page.current,
                distanceLimit: distanceMeter[distance],
                longitude: myLocation.longitude,
                latitude: myLocation.latitude,
                categoryKey: category,
              },
            }),
          )
        } else {
          dispatch(
            mainActions.fetchMainFoodList({
              params: {
                guBun: filter,
                curPage: page.current,
                distanceLimit: distanceMeter[distance],
                longitude: myLocation.longitude,
                latitude: myLocation.latitude,
              },
            }),
          )
        }
      }
    }
    page.current = page.current + 1
  }

  const _filterView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: 'lightgray',
        }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}
          onPress={() => {
            gubunSheetRef.current.snapToIndex(0)
          }}>
          <Text style={{ color: 'gray' }}>{gubunValue === 'avg' ? '평점순' : gubunValue === 'cnt' ? '리뷰순' : '거리순'}</Text>
          <Image source={require('@images/downArrow.png')} style={{ width: 7, height: 7, marginLeft: 5 }}></Image>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'lightgray',
              borderRadius: 50,
              width: 80,
              height: 30,
              justifyContent: 'center',
            }}
            onPress={() => {
              if (selectedRegions?.length < 1 && isLocationPermission) {
                distanceSheetRef.current.snapToIndex(0)
              } else {
                _getCurrentLocation()
              }
            }}>
            <Image
              source={selectedRegions?.length > 0 || !isLocationPermission ? require('@images/return.png') : require('@images/gps.png')}
              style={{ width: 15, height: 15, alignSelf: 'center' }}></Image>
            <Text style={{ color: '#ef8835', fontSize: 13, marginLeft: 5 }}>
              {selectedRegions?.length > 0 || !isLocationPermission ? '내 주변' : distanceStep[distanceValue]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Utility.isEqual(initialSelectedOptions, selectedOptions) ? 'gray' : '#ef8835',
              borderRadius: 50,
              width: 65,
              height: 30,
              justifyContent: 'center',
              marginLeft: 10,
            }}
            onPress={() => {
              setSelectedCurrentOptions(selectedOptions)
              filterSheetRef.current.snapToIndex(0)
            }}>
            <Image
              source={Utility.isEqual(initialSelectedOptions, selectedOptions) ? require('@images/filter.png') : require('@images/filterActive.png')}
              style={{ width: 18, height: 18, alignSelf: 'center' }}></Image>
            <Text style={{ color: Utility.isEqual(initialSelectedOptions, selectedOptions) ? 'gray' : '#ef8835', fontSize: 13, marginLeft: 5 }}>
              필터
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _list = () => {
    return <FoodListView data={mainList} region={selectedRegions} />
  }

  const _isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 34
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }

  const _leftButtons = () => [
    <TouchableOpacity
      style={{ marginLeft: 15 }}
      key={0}
      onPress={() => {
        setSelectedCurrentRegions(selectedRegions)
        regionSheetRef.current.snapToIndex(0)
      }}>
      <Text>지금 보고 있는 지역은</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>
          {selectedRegions?.length < 1
            ? isLocationPermission
              ? myLocation?.region
              : '지역을 설정해주세요'
            : selectedRegions?.length > 1
            ? selectedRegions[selectedRegions.length - 1]?.title + ' 외 ' + (selectedRegions.length - 1) + '곳'
            : selectedRegions[0]?.title}
        </Text>
        <Image source={require('@images/downArrow.png')} style={{ width: 7, height: 7, alignSelf: 'center', marginLeft: 5 }}></Image>
      </View>
    </TouchableOpacity>,
  ]

  const _rightButtons = () => [
    <View key={1} style={{ flexDirection: 'row', marginRight: 15 }}>
      <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => navigation.navigate('SearchScreen')}>
        <Image resizeMode={'contain'} source={require('@images/search.png')} style={{ width: 30, height: 30 }}></Image>
      </TouchableOpacity>
      <Text style={{ color: 'lightgray', fontSize: 30, marginLeft: 10 }}>|</Text>
      <TouchableOpacity style={{ justifyContent: 'center' }}>
        <Image resizeMode={'contain'} source={require('@images/map.png')} style={{ width: 25, height: 25, marginLeft: 10 }}></Image>
      </TouchableOpacity>
    </View>,
  ]

  const _carouselView = () => {
    return (
      <View style={{ height: ScreenInfo.height / 4 }}>
        <Carousel
          // ref={(c) => { this._carousel = c; }}
          data={carousel}
          renderItem={_renderItem}
          sliderWidth={ScreenInfo.width}
          itemWidth={ScreenInfo.width}
          onSnapToItem={index => {
            setActiveSlide(index)
          }}
          autoplay={true}
          autoplayDelay={2000}
          loop={true}
        />
        <Pagination
          dotsLength={carousel.length}
          activeDotIndex={activeSlide}
          containerStyle={{ position: 'absolute', bottom: 0, alignSelf: 'center', paddingVertical: 15 }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 8,
            backgroundColor: '#ef8835',
          }}
          inactiveDotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: 'gray',
          }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      </View>
    )
  }

  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground resizeMode={'stretch'} source={item.image} style={{ flex: 1 }}>
          <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>{item?.title}</Text>
        </ImageBackground>
      </View>
    )
  }

  const _gubunContent = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: 300,
          padding: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            gubunSheetRef.current.close()
          }}
          style={{ position: 'absolute', top: 10, left: 10 }}>
          <Image source={require('@images/downArrow.png')} style={{ width: 20, height: 20, marginLeft: 5 }}></Image>
        </TouchableOpacity>
        <View style={{ alignSelf: 'center', marginVertical: 20 }}>
          <Text style={{ fontSize: 17 }}>정렬</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              width: 80,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: gubunValue === 'avg' ? 2 : 0,
              borderRadius: 20,
              borderColor: '#ef8835',
            }}
            onPress={() => {
              _refreshList()
              _fetchMainFoodList('avg')
              setGubunValue('avg')
              gubunSheetRef.current.close()
            }}>
            <Text style={{ color: gubunValue === 'avg' ? '#ef8835' : 'lightgray' }}>평점순</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: gubunValue === 'cnt' ? 2 : 0,
              borderRadius: 20,
              borderColor: '#ef8835',
              marginLeft: 20,
            }}
            onPress={() => {
              _refreshList()
              _fetchMainFoodList('cnt')
              setGubunValue('cnt')
              gubunSheetRef.current.close()
            }}>
            <Text style={{ color: gubunValue === 'cnt' ? '#ef8835' : 'lightgray' }}>리뷰순</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: gubunValue === 'distance' ? 2 : 0,
              borderRadius: 20,
              borderColor: '#ef8835',
              marginLeft: 20,
            }}
            onPress={() => {
              _refreshList()
              _fetchMainFoodList('distance')
              setGubunValue('distance')
              gubunSheetRef.current.close()
            }}>
            <Text style={{ color: gubunValue === 'distance' ? '#ef8835' : 'lightgray' }}>거리순</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
          <Text style={{ color: '#ef8835' }}>*거리순은 위치가 켜져있을 때만 가능</Text>
        </View>
      </View>
    )
  }

  const _distanceContent = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: 300,
          padding: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            distanceSheetRef.current.close()
          }}
          style={{ position: 'absolute', top: 10, left: 10 }}>
          <Image source={require('@images/downArrow.png')} style={{ width: 20, height: 20, marginLeft: 5 }}></Image>
        </TouchableOpacity>
        <View style={{ alignSelf: 'center', marginTop: 10 }}>
          <Text style={{ color: '#ef8835' }}>내 위치에서 검색 반경 선택</Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Text style={{ color: '#ef8835', fontSize: 30 }}>{distanceStep[distanceValue]}</Text>
        </View>
        <View style={{ marginTop: 15 }}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={distanceValue}
            labels={distanceStep}
            onPress={distance => {
              setDistanceValue(distance)
              _refreshList()
              _fetchMainFoodList(gubunValue, distance)
              distanceSheetRef.current.close()
            }}
          />
        </View>
      </View>
    )
  }

  const _regionContent = () => {
    return (
      <>
        <View style={{ height: 270, marginTop: 10 }}>{_regionView()}</View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              width: 100,
              height: 35,
              borderRadius: 20,
              backgroundColor: selectedCurrentRegions?.length > 0 ? '#ef8835' : 'rgba(52, 52, 52, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}
            disabled={selectedCurrentRegions?.length < 1}
            onPress={() => {
              if (selectedCurrentRegions?.length < 1) {
                return
              }
              _refreshList()
              dispatch(mainActions.setSelectedRegions(selectedCurrentRegions))
              'regions'.setValue(selectedCurrentRegions)
              _fetchMainFoodList(gubunValue, distanceValue, selectedCurrentRegions[0]?.title === '전체' ? '전체' : selectedCurrentRegions[0]?.title)
              regionSheetRef.current.close()
            }}>
            <Text style={{ color: 'white' }}>적용</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 20, right: 10 }}
          onPress={() => {
            setSelectedCurrentRegions([])
          }}>
          <Text style={{ color: selectedCurrentRegions?.length > 0 ? '#ef8835' : 'grey' }}>지우기</Text>
        </TouchableOpacity>
      </>
    )
  }

  const _regionView = () => {
    let views = regions?.reduce((result = [], item, index) => {
      const isItemSelected = _isSelected(item)
      result.push(
        <TouchableOpacity
          key={index}
          style={{
            width: 160,
            height: 45,
            borderWidth: 3,
            borderColor: isItemSelected ? '#ef8835' : 'lightgrey',
            borderRadius: 20,
            marginHorizontal: 15,
            marginVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (item.id === '0') {
              _onSelectAll()
            } else {
              _onSelect(item, isItemSelected)
            }
          }}>
          <Text style={{ color: isItemSelected ? '#ef8835' : 'lightgrey' }}>{item.title}</Text>
        </TouchableOpacity>,
      )

      return result
    }, [])

    return (
      <ScrollView ref={regionsList}>
        <View style={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>{views}</View>
      </ScrollView>
    )
  }

  const _isSelected = item => {
    let selected = selectedCurrentRegions
    if (Utility.isNil(selected)) {
      return false
    }

    return (
      selected.findIndex(v => {
        return v.id === item.id
      }) >= 0
    )
  }

  const _isSelectedAll = () => {
    let selected = Object.assign([], selectedCurrentRegions)
    return selected.length === regions.length
  }

  const _onSelectAll = () => {
    let selected = Object.assign([], selectedCurrentRegions)

    if (_isSelectedAll()) {
      selected = []
    } else {
      selected = regions
    }

    setSelectedCurrentRegions(selected)
  }

  const _onSelect = (item, isSelected) => {
    let selected = Object.assign([], selectedCurrentRegions)
    if (Utility.isNil(selected)) {
      selected = []
    }

    if (isSelected) {
      let filtered = selected.filter(v => {
        return v.id !== item.id
      })
      selected = [...filtered]
    } else {
      let filtered = selected.filter(v => {
        return v.id !== item.id
      })
      selected = [...filtered, { ...item }]
    }
    setSelectedCurrentRegions(selected)
  }

  const _refreshList = () => {
    page.current = 1
    dispatch(mainActions.setMainList([]))
  }

  const _filterContent = () => {
    return (
      <>
        <View
          style={{
            height: 40,
            backgroundColor: 'lightgrey',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              filterSheetRef.current.close()
            }}>
            <Text style={{ fontSize: 16 }}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              _refreshList()
              dispatch(mainActions.setSelectedOptions(selectedCurrentOptions))
              _fetchMainFoodList(
                gubunValue,
                distanceValue,
                selectedCurrentRegions[0]?.title === '전체' ? '전체' : selectedCurrentRegions[0]?.title,
                selectedCurrentOptions,
              )
              filterSheetRef.current.close()
            }}>
            <Text style={{ fontSize: 16, color: '#ef8835' }}>필터 적용</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <SectionList
            ref={sectionList}
            style={{ flex: 1 }}
            sections={options}
            keyExtractor={(item, index) => item + index}
            renderItem={_filterItem}
          />
        </View>
      </>
    )
  }

  const _filterSectionHeader = section => {
    return (
      <View style={{ height: 70, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 15 }}>{section.title}</Text>
        {section.isMultiSelectable ? <Text style={{ position: 'absolute', right: 20, color: 'grey' }}>중복선택가능</Text> : null}
      </View>
    )
  }

  const _filterItem = ({ section, item, index }) => {
    return (
      <View style={{ borderBottomWidth: section.type !== 'parking' ? 1 : 0, borderBottomColor: 'lightgrey' }}>
        {index === 0 ? _filterSectionHeader(section) : null}
        <View style={{ alignItems: 'center', marginBottom: 30 }}>{_items(section, item.items)}</View>
      </View>
    )
  }

  const _isSelectedOption = (section, item) => {
    let selected = selectedCurrentOptions[section]
    if (Utility.isNil(selected)) {
      return false
    }

    return (
      selected.findIndex(v => {
        return v.value === item.value
      }) >= 0
    )
  }

  const _onOptionSelect = (section, items, item, isSelected) => {
    let selected = Object.assign({}, selectedCurrentOptions)
    if (Utility.isNil(selected[section.type])) {
      selected[section.type] = []
    }

    let selectedType = [...selected[section.type]]
    if (isSelected) {
      let selectedCategories = selected[section.type]
      let filtered = selectedCategories.filter(v => {
        return item.value === undefined || v.value === undefined ? v.name !== item.name : v.value !== item.value
      })
      selected[section.type] = [...filtered]
    } else {
      if (section.isMultiSelectable) {
        selectedType.push(
          ...items
            .filter(v => (item.value === undefined || v.value === undefined ? v.name === item.name : v.value === item.value))
            .reduce((result = [], value) => {
              result.push({ ...value })
              return result
            }, []),
        )
        selected[section.type] = selectedType
      } else {
        selected[section.type] = [{ ...item }]
      }
    }
    setSelectedCurrentOptions(selected)
  }

  const _items = (section, items) => {
    let views = items?.reduce((result = [], item, index) => {
      const isItemSelected = _isSelectedOption(section.type, item)
      if (section.type === 'category' || section.type === 'parking') {
        result.push(
          <TouchableOpacity
            key={index}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 25,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 15,
              borderWidth: isItemSelected ? 1 : 0,
              borderColor: '#ef8835',
              borderRadius: 20,
            }}
            onPress={() => _onOptionSelect(section, items, item, isItemSelected)}>
            <Text style={{ color: isItemSelected ? '#ef8835' : 'lightgrey' }}>{item?.name}</Text>
          </TouchableOpacity>,
        )
      } else if (section.type === 'menu') {
        result.push(
          <TouchableOpacity
            key={index}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: index > 3 ? 0 : 20,
              marginHorizontal: 15,
            }}
            onPress={() => _onOptionSelect(section, items, item, isItemSelected)}>
            <Image source={isItemSelected ? item.activeImg : item.img} style={{ width: 70, height: 70, marginBottom: 5 }} />
            <Text style={{ color: isItemSelected ? '#ef8835' : 'lightgrey' }}>{item?.name}</Text>
          </TouchableOpacity>,
        )
      } else if (section.type === 'price') {
        result.push(
          <TouchableOpacity
            key={index}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
              borderWidth: 2,
              borderColor: isItemSelected ? '#ef8835' : 'lightgrey',
              width: 70,
              height: 70,
              borderRadius: 70 / 2,
            }}
            onPress={() => _onOptionSelect(section, items, item, isItemSelected)}>
            <Text style={{ color: isItemSelected ? '#ef8835' : 'lightgrey' }}>{item?.name}</Text>
          </TouchableOpacity>,
        )
      }

      return result
    }, [])

    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {views}
      </View>
    )
  }

  return (
    <>
      <SafeBaseView
        style={{ flex: 1 }}
        hasTitleBar={true}
        navigationBarOptions={{ skipLeft: false, leftButtons: _leftButtons(), skipRight: false, rightButtons: _rightButtons() }}>
        <View style={styles.container}>
          <ScrollView
            indicatorStyle="black"
            onScrollEndDrag={({ nativeEvent }) => {
              if (_isCloseToBottom(nativeEvent)) {
                if (mainList.length >= 4 && pageInfo.totalPage >= page.current) {
                  _fetchMainFoodList(gubunValue)
                }
              }
            }}>
            {_carouselView()}
            {_filterView()}
            {_list()}
          </ScrollView>
        </View>
      </SafeBaseView>
      <BottomSheet
        ref={gubunSheetRef}
        index={-1}
        snapPoints={[DeviceUtility.isIos ? '18%' : '25%']}
        enableContentPanningGesture={false}
        handleStyle={{ display: 'none' }}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}>
        {_gubunContent()}
      </BottomSheet>
      <BottomSheet
        ref={distanceSheetRef}
        index={-1}
        snapPoints={[DeviceUtility.isIos ? '18%' : '25%']}
        enableContentPanningGesture={false}
        handleStyle={{ display: 'none' }}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}>
        {_distanceContent()}
      </BottomSheet>
      <BottomSheet
        ref={regionSheetRef}
        index={-1}
        snapPoints={[DeviceUtility.isIos ? '40%' : '54%']}
        enableContentPanningGesture={false}
        handleStyle={{ display: 'none' }}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}
        onClose={() => {
          regionsList.current?.scrollTo({
            y: 0,
            animated: false,
          })
        }}>
        {_regionContent()}
      </BottomSheet>
      <BottomSheet
        ref={filterSheetRef}
        index={-1}
        snapPoints={[DeviceUtility.isIos ? '80%' : '84%']}
        enableContentPanningGesture={false}
        handleStyle={{ display: 'none' }}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}
        onClose={() => {
          sectionList.current.scrollToLocation({
            itemIndex: 0,
          })
        }}>
        {_filterContent()}
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default MainView
