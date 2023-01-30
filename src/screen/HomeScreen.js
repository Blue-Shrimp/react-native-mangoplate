import React from 'react'
import { StyleSheet, View, Button, SafeAreaView, Text, Image } from 'react-native'

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button title="LoginScreen 이동" onPress={() => navigation.navigate('LoginScreen')} />

        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>ENV</Text>
        <Text style={{ height: 30 }}>{appConfig.envName}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Build Version</Text>
        <Text style={{ height: 30 }}>{appConfig.buildVersion}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>App Version</Text>
        <Text style={{ height: 30 }}>{appConfig.appVersion}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>APP Name</Text>
        <Text style={{ height: 30 }}>{appConfig.appName}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>APP ID</Text>
        <Text style={{ height: 30 }}>{appConfig.appId}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>URL</Text>
        <Text style={{ height: 50 }}>{appConfig.urlHost}</Text>

        <Image source={require('@images/marker.png')}></Image>
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

export default HomeScreen
