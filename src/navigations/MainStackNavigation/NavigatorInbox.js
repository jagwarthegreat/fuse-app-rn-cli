import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MapScreen from '../../screens/MainScreens/MapScreen';

const Stack = createStackNavigator();

const NavigatorInbox = () => {
    return (
        <Stack.Navigator
            initialRouteName="MapScreen"
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                
            }}
        >
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Group screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}> 
                {/* stack screen here for slide navigation */}
            </Stack.Group>   
        </Stack.Navigator>
    );
}

export default NavigatorInbox;