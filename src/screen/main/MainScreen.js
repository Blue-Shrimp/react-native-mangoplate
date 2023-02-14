import React, { useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, Text, FlatList, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { states as authStates, actions as authActions } from '@screens/auth/state'

const MainScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { auth, loading } = useSelector(authStates)
  const [list, setList] = useState({})

  useEffect(() => {
    '/mainList'
      .Get()
      .then(res => {
        console.log('res : ', res)
        setList(res)
      })
      .catch(error => {
        console.log('error : ', error)
      })
  }, [])

  console.log(list?.topRegion)
  console.log(list?.topCount)
  console.log(list?.topAvg)

  const _list = item => {
    return (
      <View>
        <Image style={{ width: 200, height: 200 }} source={{ uri: item.item.imagesRestaurants[0].imageUrl }} />
        <View style={{ flexDirection: 'row' }}>
          <Text>{item.item.name}</Text>
          <Text> {item.item.avgRating}</Text>
        </View>
        <Text>리뷰수 : {item.item.cnt}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>리뷰순</Text>
        <FlatList data={list?.topCount} renderItem={_list} keyExtractor={(item, index) => index.toString()} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 30 }}>평점순</Text>
        <FlatList data={list?.topAvg} renderItem={_list} keyExtractor={(item, index) => index.toString()} />
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

export default MainScreen
