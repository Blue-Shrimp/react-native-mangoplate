import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import { watchSaga as watchAuth } from '@screens/auth/state'
import { watchSaga as watchMain } from '@screens/main/state'
import { watchSaga as watchSearch } from '@screens/search/state'

function* rootSaga() {
  yield all([watchAuth(), watchMain(), watchSearch()])
}

export const sagaMiddleware = createSagaMiddleware()
export default rootSaga
