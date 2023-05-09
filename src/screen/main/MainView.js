import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, SafeAreaView, Text, Image, ScrollView, TouchableOpacity, ImageBackground, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeBaseView } from '@components'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Animated from 'react-native-reanimated'
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import StepIndicator from 'react-native-step-indicator'
import { Utility } from '@common'

import { states as mainStates, actions as mainActions } from './state'

const regions = [
  {
    id: '0',
    title: '전체',
  },
  {
    id: '1',
    title: '서울시',
  },
  {
    id: '2',
    title: '경기도',
  },
  {
    id: '3',
    title: '인천',
  },
  {
    id: '4',
    title: '대구',
  },
  {
    id: '5',
    title: '부산',
  },
  {
    id: '6',
    title: '제주',
  },
  {
    id: '7',
    title: '대전',
  },
  {
    id: '8',
    title: '광주',
  },
  {
    id: '9',
    title: '강원도',
  },
  {
    id: '10',
    title: '경상남도',
  },
  {
    id: '11',
    title: '경상북도',
  },
  {
    id: '12',
    title: '전라남도',
  },
  {
    id: '13',
    title: '전라북도',
  },
  {
    id: '14',
    title: '충청남도',
  },
  {
    id: '15',
    title: '충청북도',
  },
  {
    id: '16',
    title: '울산',
  },
  {
    id: '17',
    title: '세종',
  },
]
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
  const dispatch = useDispatch()
  const { mainList, pageInfo, carousel, selectedRegions, loading } = useSelector(mainStates)
  const page = useRef(1)
  const [activeSlide, setActiveSlide] = useState(0)
  const gubunSheetRef = useRef(null)
  const [filterValue, setFilterValue] = useState('avg')
  const distanceSheetRef = useRef(null)
  const [distanceValue, setDistanceValue] = useState(3)
  const regionSheetRef = useRef(null)
  const [selectedCurrentRegions, setSelectedCurrentRegions] = useState([])

  useEffect(() => {
    _fetchMainFoodList()
  }, [])

  console.log(mainList)
  console.log(pageInfo)

  const _fetchMainFoodList = (
    filter = 'avg',
    distance = distanceValue,
    region = selectedRegions.length > 0 ? (selectedRegions[0].title === '전체' ? '' : selectedRegions[0].title) : '',
  ) => {
    if (filter === 'distance') {
      dispatch(
        mainActions.fetchMainFoodList({
          params: {
            guBun: filter,
            curPage: page.current,
            distanceLimit: distanceMeter[distance],
            longitude: 127.02751,
            latitude: 37.498095,
            keyword: region,
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
            longitude: 127.02751,
            latitude: 37.498095,
            keyword: region,
          },
        }),
      )
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
          <Text style={{ color: 'gray' }}>{filterValue === 'avg' ? '평점순' : filterValue === 'cnt' ? '리뷰순' : '거리순'}</Text>
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
              distanceSheetRef.current.snapToIndex(0)
            }}>
            <Image source={require('@images/gps.png')} style={{ width: 15, height: 15, alignSelf: 'center' }}></Image>
            <Text style={{ color: '#ef8835', fontSize: 13, marginLeft: 5 }}>{distanceStep[distanceValue]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 50,
              width: 65,
              height: 30,
              justifyContent: 'center',
              marginLeft: 10,
            }}>
            <Image source={require('@images/filter.png')} style={{ width: 18, height: 18, alignSelf: 'center' }}></Image>
            <Text style={{ color: 'gray', fontSize: 13, marginLeft: 5 }}>필터</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const _list = () => {
    let views = mainList?.reduce((result = [], item, index) => {
      result.push(
        <View key={index} style={{ width: ScreenInfo.width / 2 - 15, marginRight: 10, marginTop: 10 }}>
          <Image style={{ height: 175 }} source={{ uri: item.imagesRestaurants[0]?.imageUrl }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 0.8 }}>
              <Text style={{ fontSize: 15 }} numberOfLines={1}>
                {index + 1}. {item.name}
              </Text>
              <Text style={{ color: 'gray', fontSize: 13, marginTop: 5 }}>
                {item.region.regionName} {item.distanceGap}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('@images/reviewCnt.png')} style={{ width: 10, height: 10, alignSelf: 'center' }}></Image>
                <Text style={{ color: 'gray', fontSize: 13 }}> {item.cnt}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 20, color: '#ef8835', flex: 0.2 }}> {item.avgRating}</Text>
          </View>
          <TouchableOpacity style={{ position: 'absolute', right: 5, top: 5 }}>
            <Image source={require('@images/star.png')} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>
        </View>,
      )
      return result
    }, [])
    return <View style={{ flexDirection: 'row', flexWrap: 'wrap', flexGrow: 1, flexShrink: 1, marginLeft: 10 }}>{views}</View>
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
            ? '관악구'
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
      <TouchableOpacity style={{ justifyContent: 'center' }}>
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
              borderWidth: filterValue === 'avg' ? 2 : 0,
              borderRadius: 20,
              borderColor: '#ef8835',
            }}
            onPress={() => {
              _refreshList()
              _fetchMainFoodList('avg')
              setFilterValue('avg')
              gubunSheetRef.current.close()
            }}>
            <Text style={{ color: filterValue === 'avg' ? '#ef8835' : 'lightgray' }}>평점순</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: filterValue === 'cnt' ? 2 : 0,
              borderRadius: 20,
              borderColor: '#ef8835',
              marginLeft: 20,
            }}
            onPress={() => {
              _refreshList()
              _fetchMainFoodList('cnt')
              setFilterValue('cnt')
              gubunSheetRef.current.close()
            }}>
            <Text style={{ color: filterValue === 'cnt' ? '#ef8835' : 'lightgray' }}>리뷰순</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 80,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: filterValue === 'distance' ? 2 : 0,
              borderRadius: 20,
              borderColor: '#ef8835',
              marginLeft: 20,
            }}
            onPress={() => {
              _refreshList()
              _fetchMainFoodList('distance')
              setFilterValue('distance')
              gubunSheetRef.current.close()
            }}>
            <Text style={{ color: filterValue === 'distance' ? '#ef8835' : 'lightgray' }}>거리순</Text>
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
              _fetchMainFoodList(filterValue, distance)
              distanceSheetRef.current.close()
            }}
          />
        </View>
      </View>
    )
  }

  const _renderContent = () => {
    return (
      <>
        <View style={{ height: 270, marginTop: 10 }}>{_regionContent()}</View>
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
              _fetchMainFoodList(filterValue, distanceValue, selectedCurrentRegions[0]?.title === '전체' ? '' : selectedCurrentRegions[0]?.title)
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

  const _regionContent = () => {
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
      <ScrollView>
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
                console.log('mainList.length : ', mainList.length)
                console.log('pageInfo ; ', pageInfo)
                if (mainList.length >= 4 && pageInfo.totalPage >= page.current) {
                  _fetchMainFoodList(filterValue)
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
        snapPoints={['18%']}
        enablePanDownToClose={true}
        handleStyle={{ display: 'none' }}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}>
        {_gubunContent()}
      </BottomSheet>
      <BottomSheet
        ref={distanceSheetRef}
        index={-1}
        snapPoints={['18%']}
        enablePanDownToClose={true}
        handleStyle={{ display: 'none' }}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}>
        {_distanceContent()}
      </BottomSheet>
      <BottomSheet
        ref={regionSheetRef}
        index={-1}
        snapPoints={['40%']}
        enableContentPanningGesture={false}
        handleStyle={{ display: 'none' }}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}>
        {_renderContent()}
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
