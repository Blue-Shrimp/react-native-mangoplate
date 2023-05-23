import { createSlice } from '@reduxjs/toolkit'
import { SearchKeywords } from '@common'

export const sliceName = 'search'

const initialState = {
  recommendKeywords: { data: [{ value: '서울' }, { value: '경기' }, { value: '제주' }, { value: '강원도' }] },
  recentKeywords: SearchKeywords.keywords(),
  addresses: {
    data: [],
  },
  loading: false,
}

const reducers = {
  fetchAddress: (state, { payload }) => {
    state.loading = true
  },

  setLoading: (state, { payload }) => {
    state.loading = payload
  },

  setAddresses: (state, { payload }) => {
    state.addresses = payload
    state.loading = false
  },

  reset: (state, { payload }) => {
    state.recentKeywords = SearchKeywords.keywords()
    state.addresses = {
      data: [],
    }
    state.loading = false
  },
  onError: (state, { payload }) => {
    state.loading = false
  },
}

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers,
})

export const states = state => state[sliceName]
export const actions = slice.actions
export const reducer = slice.reducer
