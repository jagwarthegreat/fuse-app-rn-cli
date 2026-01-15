import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import MainStackNavigation from './MainStackNavigation';
import LandingStackNavigation from './LandingStackNavigation';
import linking from './linking';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppProvider from './AppProvider';
import { StatusBar } from 'react-native';

const RootStackNavigation = () => {
  const userData = useSelector(state => state.user.userData);
  return (
	<SafeAreaProvider>
	  <NavigationContainer linking={linking} theme={DefaultTheme}>
	  	<AppProvider>
		<StatusBar
          animated={true}
          barStyle="light-content"
          backgroundColor="#a5131b"
          translucent={false}
        />
		{userData === null ? (
		  <LandingStackNavigation />
		) : (
		  <MainStackNavigation />
		)}
		</AppProvider>
	  </NavigationContainer>
	</SafeAreaProvider>
  );
};

export default RootStackNavigation;