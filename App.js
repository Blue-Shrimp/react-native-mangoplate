import React, { Fragment } from 'react'
import { StatusBar } from 'react-native'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import createStore from '@stores'
import { default as WelcomeScreen } from '@screens/welcome/WelcomeScreen'
import { default as TabNavigation } from '@screens/TabNavigation'

import '@common/Constants'
import '@network/Fetch'
import '@common/DeviceInfo'

const App = () => {
  const Stack = createStackNavigator()

  const store = createStore()

  return (
    <Fragment>
      <StatusBar barStyle={Platform.select({ ios: 'dark-content', android: 'default' })} />
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="WelcomeScreen"
              screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                presentation: 'modal',
              }}>
              <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen name="TabNavigation" component={TabNavigation} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </Fragment>
  )
}

export default App
