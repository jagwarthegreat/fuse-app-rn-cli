import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import ProfileScreen from '../../screens/MainScreens/ProfileScreen';
import WalletScreen from '../../screens/MainScreens/ProfileScreen/wallet';
import UserScreen from '../../screens/MainScreens/ProfileScreen/user';

const Stack = createStackNavigator();

const NavigatorProfile = () => {
    return (
        <Stack.Navigator
            initialRouteName="ProfileScreen"
            screenOptions={{
                headerShown: false,
                gestureEnabled: false
            }}
        >
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Group screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}> 
                {/* stack screen here for slide navigation */}
            </Stack.Group>   
        </Stack.Navigator>
    );
}

export default NavigatorProfile;