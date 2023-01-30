import React from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import createStore from '@stores'
import { default as HomeScreen } from '@screens/HomeScreen'
import { default as LoginScreen } from '@screens/auth/LoginScreen'

import '@common/Constants'
import '@network/Fetch'

const App = () => {
  const Stack = createStackNavigator()

  const store = createStore()

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: 'black',
                borderBottomColor: 'black',
                shadowColor: 'black',
              },
              headerTintColor: 'white',
            }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}

export default App
