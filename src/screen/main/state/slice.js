import { createSlice } from '@reduxjs/toolkit'

export const sliceName = 'main'

const initialState = {
  mainList: [],
  pageInfo: {},
  loading: false,
  error: {
    code: '200',
    message: '',
  },
}

const reducers = {
  setMainList: (state, { payload }) => {
    state.mainList = payload
  },

  setPageInfo: (state, { payload }) => {
    state.pageInfo = payload
  },

  fetchMainFoodList: (state, { payload }) => {
    state.loading = true
  },

  setLoading: (state, { payload }) => {
    state.loading = payload
  },

  setError: (state, { payload }) => {
    state.error = payload
  },

  onSuccessData: (state, { payload }) => {
    let { type, data } = payload
    switch (type) {
      case 'fetchMainFoodList':
        state.mainList = data.content
        state.pageInfo = data.pageable
        break
    }
    state.loading = false
  },

  onError: (state, { payload }) => {
    state.loading = false
    console.error(payload.result.message)
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
