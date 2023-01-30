import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import { watchSaga as watchAuth } from '@screens/auth/state'

function* rootSaga() {
  yield all([watchAuth()])
}

export const sagaMiddleware = createSagaMiddleware()
export default rootSaga
