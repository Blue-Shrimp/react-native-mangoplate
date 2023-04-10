import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, SafeAreaView, Text, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeBaseView } from '@components'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Animated from 'react-native-reanimated'
import BottomSheet from '@gorhom/bottom-sheet'

import { states as mainStates, actions as mainActions } from './state'

const MainView = ({ navigation }) => {
  const dispatch = useDispatch()
  const { mainList, pageInfo, carousel, loading } = useSelector(mainStates)
  const page = useRef(1)
  const [activeSlide, setActiveSlide] = useState(0)
  // ref
  const sheetRef = useRef(null)

  useEffect(() => {
    _fetchMainFoodList()
  }, [])

  console.log(mainList)
  console.log(pageInfo)

  const _fetchMainFoodList = (filter = 'avg') => {
    dispatch(
      mainActions.fetchMainFoodList({
        params: {
          guBun: filter,
          curPage: page.current,
        },
      }),
    )
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
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <Text style={{ color: 'gray' }}>평점순</Text>
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
            }}>
            <Image source={require('@images/gps.png')} style={{ width: 15, height: 15, alignSelf: 'center' }}></Image>
            <Text style={{ color: '#ef8835', fontSize: 13, marginLeft: 5 }}>500m</Text>
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
            }}
            onPress={() => {
              sheetRef.current.snapToIndex(0)
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
              <Text style={{ color: 'gray', fontSize: 13, marginTop: 5 }}>{item.region.regionName} 500m</Text>
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
    <TouchableOpacity style={{ marginLeft: 15 }} key={0}>
      <Text>지금 보고 있는 지역은</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>관악구</Text>
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
        }}>
        <Image source={require('@images/downArrow.png')} style={{ width: 15, height: 15, marginLeft: 5 }}></Image>
        <View>
          <Text>정렬</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ height: 10, borderRadius: 20 }}>
            <Text>평점순</Text>
          </View>
          <View style={{ height: 10, borderRadius: 20 }}>
            <Text>리뷰순</Text>
          </View>
          <View style={{ height: 10, borderRadius: 20 }}>
            <Text>거리순</Text>
          </View>
        </View>
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
                console.log('mainList.length : ', mainList.length)
                console.log('pageInfo ; ', pageInfo)
                if (mainList.length >= 4 && pageInfo.totalPage >= page.current) {
                  _fetchMainFoodList()
                }
              }
            }}>
            {_carouselView()}
            {_filterView()}
            {_list()}
          </ScrollView>
        </View>
      </SafeBaseView>
      <BottomSheet ref={sheetRef} index={-1} snapPoints={['20%']} enablePanDownToClose={true}>
        {_gubunContent()}
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
