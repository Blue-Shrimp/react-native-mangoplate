import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import { useDispatch } from 'react-redux'
import Permissions from '@common/PermissionUtil'

import { actions as mainActions } from '@screens/main/state'

const PermissionScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  const _requestPermission = async () => {
    await Permissions.requestLocation()
      .then(response => {
        dispatch(mainActions.setIsLocationPermission(true))
      })
      .catch(denyError => {
        console.log('denyError11 : ', denyError)
      })
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 50 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Image source={require('@images/visited.png')} style={{ width: 100, height: 100 }}></Image>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ flex: 0.6, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 40, textAlign: 'center' }}>위치기반 서비스 약관동의(선택)</Text>
            <Text style={{ color: 'grey', fontSize: 16, textAlign: 'center' }}>편리한 맛집 검색을 위해 위치정보 동의가 필요합니다.</Text>
          </View>
          <View style={{ flex: 0.4 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#ef8835',
                width: 200,
                height: 40,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
              onPress={async () => {
                await _requestPermission()
                navigation.replace('TabNavigation')
              }}>
              <Text style={{ color: 'white', fontSize: 16 }}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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

export default PermissionScreen
