import React from 'react'
import { SafeAreaView, StyleSheet, Text, Image } from 'react-native'

import '@common/Constants'
import '@network/Fetch'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>ENV : {appConfig.envName}</Text>
      <Text>Build Version : {appConfig.buildVersion}</Text>
      <Text>App Version : {appConfig.appVersion}</Text>
      <Text>APP Name: {appConfig.appName}</Text>
      <Text>APP ID : {appConfig.appId}</Text>
      <Image source={require('@images/marker.png')}></Image>
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
