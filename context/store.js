import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import user from './slices/user_information';
import transaction from './slices/user_transactions';
import target from './slices/user_budgets'
import months from './slices/user_years';
import storage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage: storage,
  version: 1
}

const persistedReducer = persistReducer(persistConfig, months);
const persistTransaction = persistReducer(persistConfig, transaction);
const persistTarget = persistReducer(persistConfig, target)

export const store = configureStore({
  reducer: {
    user,
    persistTransaction,
    persistedReducer,
    persistTarget
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)
