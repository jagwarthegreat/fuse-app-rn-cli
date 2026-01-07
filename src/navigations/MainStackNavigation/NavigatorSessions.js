import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SessionsScreen from '../../screens/MainScreens/SessionScreen';

const Stack = createStackNavigator();

const NavigatorSessions = () => {
    return (
        <Stack.Navigator
            initialRouteName="SessionsScreen"
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                
            }}
        >
            <Stack.Screen name="SessionsScreen" component={SessionsScreen} />
            <Stack.Group screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}> 
                {/* stack screen here for slide navigation */}
            </Stack.Group>   
        </Stack.Navigator>
    );
}

export default NavigatorSessions;