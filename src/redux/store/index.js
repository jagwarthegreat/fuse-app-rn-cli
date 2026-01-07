import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer from '../reducer';

// Fix for web SSR - use a dummy storage that doesn't access window during SSR
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = Platform.OS === 'web' 
  ? (typeof window !== 'undefined' ? AsyncStorage : createNoopStorage())
  : AsyncStorage;

const persistConfig = {
  key: 'app-root-jDlRQWZEC2',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  let persistor = persistStore(store);
  return {store, persistor};
};