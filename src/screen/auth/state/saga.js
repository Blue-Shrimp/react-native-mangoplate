import { call, put, takeLatest } from 'redux-saga/effects'
import { actions } from './slice'
import { login } from '@network'

export function* authLogin({ payload }) {
  try {
    const res = yield call(login)
    yield put(actions.setAuthLogin(res.data))
  } catch (error) {
    yield put(actions.onError(error))
  }
}

export function* watchSaga() {
  yield takeLatest(actions.authLogin, authLogin)
}
