import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import { watchSaga as watchAuth } from '@screens/auth/state'
import { watchSaga as watchMain } from '@screens/main/state'

function* rootSaga() {
  yield all([watchAuth(), watchMain()])
}

export const sagaMiddleware = createSagaMiddleware()
export default rootSaga
