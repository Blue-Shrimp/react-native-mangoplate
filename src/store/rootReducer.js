import { combineReducers } from '@reduxjs/toolkit'
import { reducer as reducerAuth } from '@screens/auth/state'
import { reducer as reducerMain } from '@screens/main/state'
import { reducer as reducerSearch } from '@screens/search/state'

const rootReducer = combineReducers({
  auth: reducerAuth,
  main: reducerMain,
  search: reducerSearch,
})

export default rootReducer
