import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('@images/welcomeImg.jpg')} style={styles.backgroundImage}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            'welcome'.setValue(true)
            navigation.replace('PermissionScreen')
          }}>
          <Image source={require('@images/close.png')}></Image>
        </TouchableOpacity>
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>BINGO</Text>
            <Text style={styles.titleText}>PLATE</Text>
            <Text style={styles.subTitleText}>맛집찾고싶을때</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.kakaoButton}>
              <Image source={require('@images/kakao.png')} style={styles.logoImage}></Image>
              <Text>카카오톡으로 계속하기</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>ㅡ or ㅡ</Text>
            <TouchableOpacity style={styles.emailButton}>
              <Image source={require('@images/email.png')} style={styles.logoImage}></Image>
              <Text>이메일로 계속하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: { flex: 1, justifyContent: 'center', opacity: 0.85 },
  closeButton: { position: 'absolute', top: 40, left: 20 },
  titleContainer: { alignItems: 'center' },
  titleText: {
    color: 'white',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 25,
    marginRight: -25,
    lineHeight: 38,
  },
  subTitleText: { color: 'white', fontSize: 20, fontWeight: '600', letterSpacing: 6, marginTop: 20 },
  buttonContainer: { alignItems: 'center', marginTop: 70 },
  kakaoButton: {
    backgroundColor: '#FEE500',
    borderRadius: 40,
    width: 230,
    height: 40,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: { width: 18, height: 18, marginRight: 8 },
  orText: { color: 'white', fontSize: 17, fontWeight: 'bold', letterSpacing: 4, marginVertical: 10 },
  emailButton: {
    backgroundColor: 'white',
    borderRadius: 40,
    width: 230,
    height: 40,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default WelcomeScreen
