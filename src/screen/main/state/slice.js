import { createSlice } from '@reduxjs/toolkit'

export const sliceName = 'main'

const initialState = {
  mainList: [],
  pageInfo: {},
  carousel: [
    {
      title: '신림 맛집 베스트 25곳',
      image: require('@images/carousel1.jpg'),
    },
    {
      title: '사당 맛집 베스트 25곳',
      image: require('@images/carousel2.jpg'),
    },
    {
      title: '강남 맛집 베스트 25곳',
      image: require('@images/carousel3.jpg'),
    },
  ],
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

  setCarousel: (state, { payload }) => {
    state.carousel = payload
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
        if (data.number + 1 >= 2) {
          state.mainList = [...state.mainList, ...data.content]
          state.pageInfo = { totalRecord: data.totalElements, totalPage: data.totalPages, offset: data.number + 1, limit: data.size }
        } else {
          state.mainList = data.content
          state.pageInfo = { totalRecord: data.totalElements, totalPage: data.totalPages, offset: data.number + 1, limit: data.size }
        }
        break
    }
    state.loading = false
  },

  onError: (state, { payload }) => {
    state.loading = false
    console.error(payload?.result?.message)
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
