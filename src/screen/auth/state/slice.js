import { createSlice } from '@reduxjs/toolkit'

export const sliceName = 'auth'
const initialState = {
  loading: false,
  auth: null,
  error: null,
}

const reducers = {
  authLogin: (state, { payload }) => {
    state.loading = true
  },
  setAuthLogin: (state, { payload }) => {
    state.loading = false
    state.auth = payload
  },
  setError: (state, { payload }) => {
    state.error = payload
  },
  onError: (state, { payload }) => {
    if (payload) {
      state.error = 'error'
    } else {
      state.error = null
    }
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
