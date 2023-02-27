import React from 'react'
import { StyleSheet, Text, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { default as MainScreen } from '@screens/main/MainScreen'
import { default as PickScreen } from '@screens/pick/PickScreen'
import { default as NewsScreen } from '@screens/news/NewsScreen'
import { default as MypageScreen } from '@screens/mypage/MypageScreen'

const Tab = createBottomTabNavigator()

const bottomTabArray = [
  {
    label: '맛집찾기',
    activeImage: require('@images/foodSearchActive.png'),
    image: require('@images/foodSearch.png'),
  },
  {
    label: '망고픽',
    activeImage: require('@images/pickActive.png'),
    image: require('@images/pick.png'),
  },
  {
    label: '소식',
    activeImage: require('@images/newsActive.png'),
    image: require('@images/news.png'),
  },
  {
    label: '내정보',
    activeImage: require('@images/mypageActive.png'),
    image: require('@images/mypage.png'),
  },
]

const TabNavigation = () => {
  const tabIcon = (focused, route) => {
    let seq = 0
    if (route.name === '맛집찾기') {
      seq = 0
    } else if (route.name === '망고픽') {
      seq = 1
    } else if (route.name === '소식') {
      seq = 2
    } else if (route.name === '내정보') {
      seq = 3
    }
    return <Image source={focused ? bottomTabArray[seq].activeImage : bottomTabArray[seq].image} style={styles.tabIcon} />
  }

  const tabLabel = (focused, color, route) => {
    return <Text style={{ color: focused ? '#ef8835' : color, fontSize: 11 }}>{route.name}</Text>
  }

  return (
    <Tab.Navigator
      initialRouteName="맛집찾기"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          return tabIcon(focused, route)
        },
        tabBarLabel: ({ focused, color }) => {
          return tabLabel(focused, color, route)
        },
      })}>
      <Tab.Screen name="맛집찾기" component={MainScreen} />
      <Tab.Screen name="망고픽" component={PickScreen} />
      <Tab.Screen name="소식" component={NewsScreen} />
      <Tab.Screen name="내정보" component={MypageScreen} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabIcon: { width: 28, height: 28 },
})

export default TabNavigation
