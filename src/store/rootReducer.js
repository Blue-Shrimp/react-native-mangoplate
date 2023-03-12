import { combineReducers } from '@reduxjs/toolkit'
import { reducer as reducerAuth } from '@screens/auth/state'
import { reducer as reducerMain } from '@screens/main/state'

const rootReducer = combineReducers({
  auth: reducerAuth,
  main: reducerMain,
})

export default rootReducer
