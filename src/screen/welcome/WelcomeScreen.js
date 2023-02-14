import React from 'react'
import { StyleSheet, View, Button, SafeAreaView, Text, Image, TouchableOpacity } from 'react-native'

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('@images/welcomeImg.jpg')} style={{ flex: 1 }}></Image>
      <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20 }} onPress={() => navigation.replace('TabNavigation')}>
        <Image source={require('@images/close.png')}></Image>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default WelcomeScreen
