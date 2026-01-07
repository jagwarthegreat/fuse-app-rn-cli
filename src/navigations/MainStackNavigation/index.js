import React, { useEffect } from 'react';
import constants from '../../constants';

// NAVIGATIONS //
import NavigatorMap from './NavigatorMap';
import NavigatorInbox from './NavigatorInbox';
import NavigatorProfile from './NavigatorProfile';
import NavigatorQrScan from './NavigatorQrScan';
import NavigatorSessions from './NavigatorSessions';
import ChargingScreen from '../../screens/MainScreens/MapScreen/chargingScreen';
import ChargerScreen from '../../screens/MainScreens/MapScreen/charger';
import ChargerCheckoutScreen from '../../screens/MainScreens/MapScreen/chargerCheckout';
import WalletScreen from '../../screens/MainScreens/ProfileScreen/wallet';
import UserScreen from '../../screens/MainScreens/ProfileScreen/user';

// PACKAGES //
import { useSelector, useDispatch } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Pressable, StyleSheet, View, BackHandler } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Wrapper components to prevent back button navigation
const ChargerScreenWrapper = (props) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent default back behavior
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  return <ChargerScreen {...props} />;
};

const ChargerCheckoutScreenWrapper = (props) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent default back behavior
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  return <ChargerCheckoutScreen {...props} />;
};

const ChargingScreenWrapper = (props) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent default back behavior
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );
  return <ChargingScreen {...props} />;
};

export default function MainStackNavigation() {

  const BottomNav = ({ route, navigation }) => {

    return (
      <>
        <Tab.Navigator
          screenOptions={(props) => {
            return {
              tabBarHideOnKeyboard: true,
              headerShown: false,
              tabBarStyle: { position: 'absolute' },
              tabBarLabelStyle: { fontFamily: constants.fonts.poppins500 },
              tabBarActiveTintColor: '#C8000D',
            }
          }}
        >
          <Tab.Screen
            name="NavigatorMap"
            component={NavigatorMap}
            options={{
              tabBarLabel: 'Map',
              tabBarIcon: (props) => (
                <MaterialCommunityIcons name="map-outline" size={30} style={{ color: props.color }} />
              ),
              tabBarLabelStyle: { fontFamily: constants.fonts.poppins500 }
            }}
          />
          <Tab.Screen
            name="NavigatorInbox"
            component={NavigatorInbox}
            options={{
              tabBarLabel: 'Inbox',
              tabBarIcon: (props) => (
                <MaterialCommunityIcons name="email-outline" size={30} style={{ color: props.color }} />
              ),
              tabBarLabelStyle: { fontFamily: constants.fonts.poppins500 }
            }}
          />
          <Tab.Screen
            name="NavigatorQrScan"
            component={NavigatorQrScan}
            options={{
              tabBarLabel: '',
              tabBarIcon: (props) => (
                <View style={styles.fabContainer}>
                  <View style={styles.fab}>
                    <MaterialCommunityIcons name="qrcode-scan" size={30} style={{ color: "#FFF" }} />
                  </View>
                </View>
              ),
              tabBarButton: (props) => (
                <Pressable
                  {...props}
                  style={styles.fabButton}
                />
              ),
              tabBarLabelStyle: { fontFamily: constants.fonts.poppins500 }
            }}
          />
          <Tab.Screen
            name="NavigatorSessions"
            component={NavigatorSessions}
            options={{
              tabBarLabel: 'Sessions',
              tabBarIcon: (props) => (
                <MaterialCommunityIcons name="view-list-outline" size={30} style={{ color: props.color }} />
              ),
              tabBarLabelStyle: { fontFamily: constants.fonts.poppins500 }
            }}
          />
          <Tab.Screen
            name="NavigatorProfile"
            component={NavigatorProfile}
            options={{
              tabBarLabel: 'Me',
              tabBarIcon: (props) => (
                <MaterialCommunityIcons name={"account-circle-outline"} size={30} style={{ color: props.color }} />
              ),
              tabBarLabelStyle: { fontFamily: constants.fonts.poppins500 }
            }}
          />
        </Tab.Navigator>
      </>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: "transparent" },
        headerShown: false,
      }}
    >
      <Stack.Group screenOptions={{ ...TransitionPresets.ModalTransition }}>
        <Stack.Screen name="main" component={BottomNav} />
      </Stack.Group>

      {/* ------------- FULLSCREENS ------------- */}
      <Stack.Screen 
        name="ChargerScreen" 
        component={ChargerScreenWrapper}
        options={{
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="ChargerCheckoutScreen" 
        component={ChargerCheckoutScreenWrapper}
        options={{
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="ChargingScreen" 
        component={ChargingScreenWrapper}
        options={{
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="UserScreen" component={UserScreen} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C8000D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});