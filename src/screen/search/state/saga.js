import { call, put, takeLatest } from 'redux-saga/effects'
import { actions } from './slice'
import { KakaoService, fetchMainList } from '@network'

export function* fetchAddress({ payload }) {
  try {
    const res = yield call(KakaoService.getAddressByKeyword, payload)
    yield put(actions.setAddresses(res))
  } catch (error) {
    yield put(actions.onError(error))
  }
}

export function* fetchSearchFoodList({ payload }) {
  try {
    const res = yield call(fetchMainList, payload.params)
    yield put(actions.onSuccessData({ type: 'fetchSearchFoodList', data: res }))
  } catch (error) {
    yield put(actions.onError(error))
  }
}

export function* watchSaga() {
  yield takeLatest(actions.fetchAddress, fetchAddress)
  yield takeLatest(actions.fetchSearchFoodList, fetchSearchFoodList)
}
