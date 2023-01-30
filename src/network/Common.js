import * as mock from './mock'

const URI = {
  Auth: {
    login: '/user/auth/login',
    refresh: '/user/auth/refresh',
    join: '/user/auth/join',
    logout: '/user/auth/logout',
    mock: mock.login,
    useMock: true,
  },
}

export { URI }
