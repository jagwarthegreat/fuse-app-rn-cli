import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import LoginScreen from '../../screens/LandingScreens/LoginScreen';
import SignUpScreen from '../../screens/LandingScreens/SignUpScreen';
import OnboardingScreen from '../../screens/LandingScreens/OnboardingScreen';

const Stack = createStackNavigator();

const LandingStackNavigation = () => {
  const onBoarding = useSelector(state => state.boarding.onBoarding);
  return (
    <Stack.Navigator
      initialRouteName={onBoarding ? 'OnboardingScreen' : 'LoginScreen'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>

      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Group screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}>
        {/* stack screen here for slide navigation */}
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default LandingStackNavigation;