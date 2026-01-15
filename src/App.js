/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import reduxStore from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import RootStackNavigation from './navigations/RootStackNavigation';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';

enableScreens();

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, [])

  const { store, persistor } = reduxStore();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={MD3LightTheme}>
          <RootStackNavigation />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
