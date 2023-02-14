import React, { useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, Text, FlatList, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const PickScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  useEffect(() => {}, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}></View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default PickScreen
