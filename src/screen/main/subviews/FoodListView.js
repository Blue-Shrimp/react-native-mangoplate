import React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'

const FoodListView = ({ data, region }) => {
  let views = data?.reduce((result = [], item, index) => {
    result.push(
      <View key={index} style={{ width: ScreenInfo.width / 2 - 15, marginRight: 10, marginTop: 10 }}>
        <Image style={{ height: 175 }} source={{ uri: item.imagesRestaurants[0]?.imageUrl }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 0.8 }}>
            <Text style={{ fontSize: 15 }} numberOfLines={1}>
              {index + 1}. {item.name}
            </Text>
            <Text style={{ color: 'gray', fontSize: 13, marginTop: 5 }}>
              {item.region.regionName} {region?.length > 0 ? '' : item.distanceGap}
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
  const _noDataView = () => {
    return (
      <View style={{ alignSelf: 'center', marginTop: 200 }}>
        <Text style={{ color: 'grey', fontSize: 16 }}>정보를 찾을 수 없습니다.</Text>
      </View>
    )
  }
  return views.length < 1 ? (
    _noDataView()
  ) : (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', flexGrow: 1, flexShrink: 1, marginLeft: 10 }}>{views}</View>
  )
}

export default FoodListView
