import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import Config from 'react-native-config'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>ENV : {Config.ENV}</Text>
      <Text>Build Version : {Config.BUILD_VERSION}</Text>
      <Text>App Version : {Config.APP_VERSION}</Text>
      <Text>APP Name: {Config.APP_NAME}</Text>
      <Text>APP ID : {Config.APP_ID}</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default App
