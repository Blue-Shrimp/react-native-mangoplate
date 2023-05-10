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
  regions: [
    {
      id: '0',
      title: '전체',
    },
    {
      id: '1',
      title: '서울시',
    },
    {
      id: '2',
      title: '경기도',
    },
    {
      id: '3',
      title: '인천',
    },
    {
      id: '4',
      title: '대구',
    },
    {
      id: '5',
      title: '부산',
    },
    {
      id: '6',
      title: '제주도',
    },
    {
      id: '7',
      title: '대전',
    },
    {
      id: '8',
      title: '광주',
    },
    {
      id: '9',
      title: '강원도',
    },
    {
      id: '10',
      title: '경상남도',
    },
    {
      id: '11',
      title: '경상북도',
    },
    {
      id: '12',
      title: '전라남도',
    },
    {
      id: '13',
      title: '전라북도',
    },
    {
      id: '14',
      title: '충청남도',
    },
    {
      id: '15',
      title: '충청북도',
    },
    {
      id: '16',
      title: '울산',
    },
    {
      id: '17',
      title: '세종',
    },
  ],
  selectedRegions: [],
  options: [
    {
      type: 'category',
      title: '카테고리',
      isMultiSelectable: false,
      data: [
        {
          items: [
            {
              name: '전체',
              value: 'all',
            },
            {
              name: '가고싶다',
              value: 'wish',
            },
            {
              name: '가봤어요',
              value: 'gone',
            },
          ],
        },
      ],
    },
    {
      type: 'menu',
      title: '음식종류',
      isMultiSelectable: true,
      data: [
        {
          items: [
            {
              name: '한식',
              value: 'korean',
              img: require('@images/hansik.png'),
              activeImg: require('@images/hansikActive.png'),
            },
            {
              name: '일식',
              value: 'japanese',
              img: require('@images/ilsik.png'),
              activeImg: require('@images/ilsikActive.png'),
            },
            {
              name: '중식',
              value: 'chinese',
              img: require('@images/joongsik.png'),
              activeImg: require('@images/joongsikActive.png'),
            },
            {
              name: '양식',
              value: 'western',
              img: require('@images/yangsik.png'),
              activeImg: require('@images/yangsikActive.png'),
            },
            {
              name: '세계음식',
              value: 'world',
              img: require('@images/world.png'),
              activeImg: require('@images/worldActive.png'),
            },
            {
              name: '뷔페',
              value: 'buffet',
              img: require('@images/buffet.png'),
              activeImg: require('@images/buffetActive.png'),
            },
            {
              name: '카페',
              value: 'cafe',
              img: require('@images/cafe.png'),
              activeImg: require('@images/cafeActive.png'),
            },
            {
              name: '주점',
              value: 'bar',
              img: require('@images/bar.png'),
              activeImg: require('@images/barActive.png'),
            },
          ],
        },
      ],
    },
    {
      type: 'price',
      title: '가격 / 1인당',
      isMultiSelectable: true,
      data: [
        {
          items: [
            {
              name: '만원 이하',
              value: 1000,
            },
            {
              name: '1만원 대',
              value: 10000,
            },
            {
              name: '2만원 대',
              value: 20000,
            },
            {
              name: '3만원 ~',
              value: 30000,
            },
          ],
        },
      ],
    },
    {
      type: 'parking',
      title: '주차',
      isMultiSelectable: false,
      data: [
        {
          items: [
            {
              name: '상관없음',
              value: 'all',
            },
            {
              name: '가능한 곳만',
              value: 'Y',
            },
          ],
        },
      ],
    },
  ],
  initialSelectedOptions: { category: [{ name: '전체', value: 'all' }], parking: [{ name: '상관없음', value: 'all' }], menu: [], price: [] },
  selectedOptions: { category: [{ name: '전체', value: 'all' }], parking: [{ name: '상관없음', value: 'all' }], menu: [], price: [] },
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

  setRegions: (state, { payload }) => {
    state.regions = payload
  },

  setSelectedRegions: (state, { payload }) => {
    state.selectedRegions = payload
  },

  setOptions: (state, { payload }) => {
    state.options = payload
  },

  setSelectedOptions: (state, { payload }) => {
    state.selectedOptions = payload
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
