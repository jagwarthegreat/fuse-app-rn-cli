import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import QrScanScreen from '../../screens/MainScreens/QrScanScreen';

const Stack = createStackNavigator();

const NavigatorQrScan = () => {
    return (
        <Stack.Navigator
            initialRouteName="QrScanScreen"
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                
            }}
        >
            <Stack.Screen name="QrScanScreen" component={QrScanScreen} />
            <Stack.Group screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}> 
                {/* stack screen here for slide navigation */}
            </Stack.Group>   
        </Stack.Navigator>
    );
}

export default NavigatorQrScan;