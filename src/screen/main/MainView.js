import React, { useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, Text, Image, ScrollView, Dimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { states as mainStates, actions as mainActions } from './state'

const MainView = ({ navigation }) => {
  const dispatch = useDispatch()
  const { mainList, pageInfo, loading } = useSelector(mainStates)
  const [list, setList] = useState({})

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
          curPage: 1,
        },
      }),
    )
  }

  const _list = () => {
    let views = mainList?.reduce((result = [], item, index) => {
      result.push(
        <View style={{ width: Dimensions.get('window').width / 2 - 15, marginRight: 10, marginTop: 20 }}>
          <Image style={{ height: 200 }} source={{ uri: item.imagesRestaurants[0]?.imageUrl }} />
          <View style={{ flexDirection: 'row' }}>
            <Text>{item.name}</Text>
            <Text> {item.avgRating}</Text>
          </View>
          <Text>{item.region.regionName}</Text>
          <Text>리뷰수 : {item.cnt}</Text>
        </View>,
      )
      return result
    }, [])
    return <View style={{ flexDirection: 'row', flexWrap: 'wrap', flexGrow: 1, flexShrink: 1 }}>{views}</View>
  }

  const _isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 34
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView
          indicatorStyle="black"
          style={{ marginLeft: 10 }}
          onScrollEndDrag={({ nativeEvent }) => {
            if (_isCloseToBottom(nativeEvent)) {
              console.log('mainList.length : ', mainList.length)
              console.log('pageInfo ; ', pageInfo)
            }
          }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30 }}>평점순</Text>
          {_list()}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default MainView
