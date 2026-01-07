import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MapScreen from '../../screens/MainScreens/MapScreen';
import ChargerScreen from '../../screens/MainScreens/MapScreen/charger';
import ChargerCheckoutScreen from '../../screens/MainScreens/MapScreen/chargerCheckout';
import ChargingScreen from '../../screens/MainScreens/MapScreen/chargingScreen';

const Stack = createStackNavigator();

const NavigatorMap = () => {
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

export default NavigatorMap;