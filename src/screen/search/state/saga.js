import { call, put, takeLatest } from 'redux-saga/effects'
import { actions } from './slice'
import { KakaoService } from '@network'

export function* fetchAddress({ payload }) {
  try {
    const res = yield call(KakaoService.getAddressByKeyword, payload)
    yield put(actions.setAddresses(res))
  } catch (error) {
    yield put(actions.onError(error))
  }
}

export function* watchSaga() {
  yield takeLatest(actions.fetchAddress, fetchAddress)
}
