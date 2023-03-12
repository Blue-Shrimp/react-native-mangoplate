import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'
import { actions } from './slice'
import { fetchMainList } from '@network'

export function* fetchMainFoodList({ payload }) {
  try {
    const res = yield call(fetchMainList, payload.params)
    yield put(actions.onSuccessData({ type: 'fetchMainFoodList', data: res }))
  } catch (error) {
    yield put(actions.onError(error))
  }
}

export function* watchSaga() {
  // 액션이 오면 사가함수를 호출합니다.
  yield takeLatest(actions.fetchMainFoodList, fetchMainFoodList)
}
