import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { default as MainScreen } from '@screens/main/MainScreen'
import { default as PickScreen } from '@screens/pick/PickScreen'
import { default as NewsScreen } from '@screens/news/NewsScreen'
import { default as MypageScreen } from '@screens/mypage/MypageScreen'

const Tab = createBottomTabNavigator()

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="맛집찾기"
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="맛집찾기" component={MainScreen} />
      <Tab.Screen name="망고픽" component={PickScreen} />
      <Tab.Screen name="소식" component={NewsScreen} />
      <Tab.Screen name="내정보" component={MypageScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigation
