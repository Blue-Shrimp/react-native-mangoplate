import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import rootSaga, { sagaMiddleware } from './rootSaga'

function createStore() {
  let middleware = [sagaMiddleware]

  const store = configureStore({
    reducer: rootReducer,
    middleware: middleware,
    devTools: true,
  })

  sagaMiddleware.run(rootSaga)

  return store
}

export default createStore
