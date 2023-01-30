import React, { useEffect } from 'react'
import { StyleSheet, View, SafeAreaView, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { states as authStates, actions as authActions } from '@screens/auth/state'

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const { auth, loading } = useSelector(authStates)

  useEffect(() => {
    // '/test'
    //   .Get()
    //   .then(res => {
    //     console.log('res : ', res)
    //   })
    //   .catch(error => {
    //     console.log('error : ', error)
    //   })
    getAuthLogin()
  }, [])

  const getAuthLogin = () => {
    dispatch(authActions.authLogin())
  }

  // 만료기한이 오늘날짜보다 크면 로그인 시 refresh 날려서 만료기한 연장 작으면 재로그인
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>accessToken(로그인 여부)</Text>
        <Text style={{ height: 100 }}>{auth?.accessToken}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>refreshToken(refresh 날릴때 사용)</Text>
        <Text style={{ height: 100 }}>{auth?.refreshToken}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>expiredOn(만료기한 / refresh 날리면 연장)</Text>
        <Text style={{ height: 50 }}>{auth?.expiredOn}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>idToken(로그아웃 시 사용)</Text>
        <Text style={{ height: 100 }}>{auth?.idToken}</Text>

        <Text style={{ marginTop: 20 }}>만료기한 : {new Date(Number(auth?.expiredOn)).toDateString()}</Text>
        <Text>오늘날짜 : {new Date().toDateString()}</Text>
        <Text>세션 유지 여부: {(new Date(Number(auth?.expiredOn)) > new Date()).toString()}</Text>
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

export default LoginScreen
