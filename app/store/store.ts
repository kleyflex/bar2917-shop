import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./cart/cart.slice";
import locationReducer from './location/location.slice';
import { userSlice } from "./user/user.slice";

import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore } from 'redux-persist';

  const isClient = typeof window !== "undefined"

  const combinedReducers = combineReducers({
      cart: cartSlice.reducer,
      user: userSlice.reducer,
      location: locationReducer
    })

  let mainReducer = combinedReducers

  if(isClient) {
    const { persistReducer } = require('redux-persist')
    const storage = require('redux-persist/lib/storage').default

    const persistConfig = {
      key: 'bar2917-shop',
      storage,
      whitelist: ['cart', 'location']
    }

    mainReducer = persistReducer(persistConfig, combinedReducers)

  }
  
  export const store = configureStore({
    reducer: mainReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      })
  })

  // manualPersist: восстановление из localStorage запускается в Providers после гидрации,
  // иначе первый клиентский рендер расходится с серверным (корзина, точка) и React перерисовывает весь документ
  export const persistor = persistStore(store, { manualPersist: true } as Parameters<typeof persistStore>[1])

  export type TypeRootState = ReturnType<typeof mainReducer>
  
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  
