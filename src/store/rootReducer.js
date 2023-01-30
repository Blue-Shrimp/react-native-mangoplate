import { combineReducers } from '@reduxjs/toolkit'
import { reducer as reducerAuth } from '@screens/auth/state'

const rootReducer = combineReducers({
  auth: reducerAuth,
})

export default rootReducer
