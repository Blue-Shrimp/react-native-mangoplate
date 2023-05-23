import React, { Fragment } from 'react'
import { StatusBar } from 'react-native'
import 'react-native-gesture-handler'

import '@common/Constants'
import '@network/Fetch'
import '@common/DeviceInfo'
import '@common/Preference'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import createStore from '@stores'

import { default as WelcomeScreen } from '@screens/welcome/WelcomeScreen'
import { default as PermissionScreen } from '@screens/welcome/PermissionScreen'
import { default as TabNavigation } from '@screens/TabNavigation'
import { default as SearchScreen } from '@screens/search/SearchScreen'

const App = () => {
  const Stack = createNativeStackNavigator()

  const store = createStore()

  const routeScreen = !'welcome'.getBool() ? 'WelcomeScreen' : 'TabNavigation'

  return (
    <Fragment>
      <StatusBar barStyle={Platform.select({ ios: 'dark-content', android: 'default' })} />
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={routeScreen}
              screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                presentation: 'fullScreenModal',
              }}>
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="PermissionScreen" component={PermissionScreen} />
              <Stack.Screen name="TabNavigation" component={TabNavigation} />
              <Stack.Screen name="SearchScreen" component={SearchScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </Fragment>
  )
}

export default App
