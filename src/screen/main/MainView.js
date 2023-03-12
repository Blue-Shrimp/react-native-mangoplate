import React, { useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, Text, FlatList, Image } from 'react-native'
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

  const _list = item => {
    return (
      <View>
        <Image style={{ width: 200, height: 200 }} source={{ uri: item.item.imagesRestaurants[0]?.imageUrl }} />
        <View style={{ flexDirection: 'row' }}>
          <Text>{item.item.name}</Text>
          <Text> {item.item.avgRating}</Text>
        </View>
        <Text>{item.item.region.regionName}</Text>
        <Text>리뷰수 : {item.item.cnt}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <Text style={{ fontSize: 20, fontWeight: 'bold' }}>리뷰순</Text>
        <FlatList data={list?.topCount} renderItem={_list} keyExtractor={(item, index) => index.toString()} /> */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30 }}>평점순</Text>
        <FlatList data={mainList} renderItem={_list} keyExtractor={(item, index) => index.toString()} />
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
