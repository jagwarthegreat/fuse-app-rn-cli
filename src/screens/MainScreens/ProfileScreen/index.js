import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import ActionSheet from "react-native-actions-sheet";
import { Appbar, Avatar, Button, Card, HelperText, List, PaperProvider, Snackbar, Switch, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useApiCall, useSignOut, useUserData } from '../../../hooks';
import { setCheckoutUrl, setWalletVisible } from '../../../redux/reducer/User';
import styles from './style';

import DeviceInfo from 'react-native-device-info';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { signOut } = useSignOut();
  const { fetchUserData } = useUserData();
  const [refreshing, setRefreshing] = useState(false);
  const userData = useSelector((state) => state.user?.userData);
  const accessToken = useSelector((state) => state.user?.accessToken);
  const actionSheetRef = useRef(null);
  const reloadWalletActionSheetRef = useRef(null);
  const hasFetchedOnMount = useRef(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [reloadAmount, setReloadAmount] = useState('');
  const [lastUpdateCheck, setLastUpdateCheck] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { ApiCall, ApiEndpoints, ApiMethod } = useApiCall();
  const dispatch = useDispatch();

  // App version and update info (Expo Updates not available in bare React Native)
  const [appVersion, setAppVersion] = useState(() => {
    try {
      return DeviceInfo.getVersion();
    } catch (error) {
      return '1.0.0';
    }
  });
  const isUpdateAvailable = false;
  const isUpdatePending = false;

  const onToggleSwitch = () => {
    // setIsSwitchOn(!isSwitchOn);
    setBalanceVisibleData(!isSwitchOn);
    dispatch(setWalletVisible(isSwitchOn));
  };

  const setBalanceVisibleData = useCallback(async (visible) => {
    await ApiCall({
        apiEndpoint: ApiEndpoints().UPDATE_DEVICE_SETTINGS,
        method: ApiMethod.POST,
        apiData: {
            user_id: userData?.id,
            type: 'wallet_display',
            type_value: visible,
        },
        apiAccessToken: accessToken,
    });
    
    setIsSwitchOn(visible);
}, []);

  // Fetch user data on component mount
  useEffect(() => {
    // Only fetch once on mount if we don't have userData
    if (!hasFetchedOnMount.current && !userData?.member_account) {
      hasFetchedOnMount.current = true;
      fetchUserData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // If true, we show the button to download and run the update
  const showDownloadButton = isUpdateAvailable && !__DEV__;


  // Format time difference
  const getTimeAgo = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Handle update checks (OTA updates not available in bare React Native)
  const handleCheckForUpdate = async () => {
    setSnackbarMessage('OTA updates are not available. Please update via app store.');
    setSnackbarVisible(true);
    setLastUpdateCheck(new Date());
  };

  const handleFetchUpdate = async () => {
    setSnackbarMessage('OTA updates are not available. Please update via app store.');
    setSnackbarVisible(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItems = [
    { icon: 'wallet', label: 'Reload Wallet', onPress: () => {reloadWalletActionSheetRef.current?.show();} },
    // { icon: 'car', label: 'My Cars', onPress: () => {} },
    { icon: 'cog', label: 'Settings', onPress: () => {actionSheetRef.current?.show();} },
    // { icon: 'headset', label: 'Support', onPress: () => {} },
  ];

  const menuAppUpdateItems = [
    { icon: '', label: 'Current Version', onPress: () => {}, right: <Text>{appVersion}</Text> },
    { icon: '', label: 'Last Update Check', onPress: handleCheckForUpdate, right: <Text>{getTimeAgo(lastUpdateCheck)}</Text> },
    
    ...(showDownloadButton ? [{ icon: '', label: 'Download and run update', onPress: handleFetchUpdate, right: <Text>Available</Text> }] : []),

    { icon: '', label: 'Check for Updates', onPress: handleCheckForUpdate, right: <List.Icon icon='chevron-right'/> },
  ];

  const handlePayAmount = async () => {
    // router.push('/checkout');
    const response = await ApiCall({
      apiEndpoint: ApiEndpoints().CHECKOUT,
      method: ApiMethod.POST,
      apiAccessToken: accessToken,
      apiData: { 
        item: 'EV Load', 
        firstname: userData?.firstname,
        lastname: userData?.lastname,
        username: userData?.username,
        wallet: userData?.wallet?.wallet_account,
        member_account: userData?.member_account,
        phone: userData?.phone,
        amount: reloadAmount
      },
    });

    dispatch(setCheckoutUrl(response?.data));
    // TODO: Register CheckoutScreen in navigation and update screen name
    // navigation.navigate('CheckoutScreen');
  };

  return (
    <PaperProvider style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title="Account" color="#fff" />
          {/* <Appbar.Action icon={MORE_ICON} onPress={() => {}} color="#fff" /> */}
        </Appbar.Header>

        <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {/* User Profile Card */}
          <Card style={styles.profileCard}>
            <TouchableOpacity style={styles.profileContent} onPress={() => {
              navigation.navigate('UserScreen');
            }}>
              <View style={styles.profileLeft}>
                <Avatar.Icon size={60} icon="account" style={styles.avatar} />
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>{userData?.firstname + ' ' + userData?.lastname || ''}</Text>
                  <View style={styles.userIdBadge}>
                    <Text style={styles.userIdText}>User #{userData?.member_account || ''}</Text>
                  </View>
                  <Text style={styles.userEmail}>{userData?.email || 'Not available'}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          </Card>

          {/* Personal Wallet Card */}
          <Card style={styles.walletCard}>
            <TouchableOpacity style={styles.walletContent} onPress={() => {
              navigation.navigate('WalletScreen');
            }}>
              <View>
                <Text style={styles.walletTitle}>Personal Wallet</Text>
                <Text style={styles.walletAmount}>
                  {isSwitchOn ?  'PHP ' + (userData?.wallet?.wallet_balance || '0.00') : 'PHP ---'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
            </TouchableOpacity>
          </Card>

          {/* Menu Items */}
          <Card style={styles.menuItemCard} mode='contained'>
              {menuItems.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={item.onPress}>
                    <List.Item
                      title={item.label}
                      // description={index}
                      left={props => <List.Icon {...props} icon={item.icon} color="#C8000D" />}
                      right={props => <List.Icon {...props} icon="chevron-right" />}
                      style={index !== menuItems.length - 1 ? {borderBottomWidth: .7, borderBottomColor: '#ddd'} : {}}
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </Card>

          <Card style={styles.menuAppVersionCard} mode='contained'>
              {menuAppUpdateItems.map((item, index) => (
                <View key={index}>
                    <List.Item
                      title={item.label}
                      right={props => item.right}
                      onPress={item.onPress}
                      style={index !== menuAppUpdateItems.length - 1 ? {borderBottomWidth: .7, borderBottomColor: '#ddd'} : {}}
                    />
                </View>
              ))}
          </Card>

          <Card style={[styles.menuItemCard, {marginTop: 20}]} mode='contained'>
            <TouchableOpacity onPress={() => {signOut()}}>
              <List.Item
                title='Log out'
                left={props => <List.Icon {...props} icon='logout' color="#C8000D" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>
          </Card>
        </ScrollView>
        
        <ActionSheet gestureEnabled ref={actionSheetRef}>
          <Text style={[styles.settingsSheet, styles.settingsTitle]}>Settings</Text>
          <List.Item
              title='Hide/show Wallet Amount'
              left={props => <List.Icon {...props} icon='eye' color="#C8000D" />}
              right={props => <Switch value={!isSwitchOn} onValueChange={onToggleSwitch} color="#C8000D"/>}
              style={{marginBottom: 20}}
            />
        </ActionSheet>

        {/* Reload Wallet Action Sheet */}
        <ActionSheet gestureEnabled ref={reloadWalletActionSheetRef}>
          <Text style={[styles.settingsSheet, styles.settingsTitle]}>Reload Wallet</Text>
          <Text style={[styles.settingsSheet, {fontSize: 14}]}>How much do you want to load?</Text>
          <Text style={[styles.settingsSheet, {fontSize: 12, marginTop: 0, color: '#666'}]}>The minimum reload amount is 100.00 PHP.</Text>
          <View style={[styles.form, styles.formContainer]}>
            <TextInput
                label="Enter Amount"
                autoCapitalize="none"
                mode="outlined"
                style={styles.input}
                value={reloadAmount}
                onChangeText={setReloadAmount}
                keyboardType="numeric"
                activeOutlineColor="#C8000D"
                outlineColor="#C8000D"
                textColor="#C8000D"
              />
              {reloadAmount !== '' && parseFloat(reloadAmount) < 100 && (
                <HelperText type="error" style={{paddingVertical: 0, paddingHorizontal: 0, marginVertical: 0}}>
                  Amount must be at least PHP 100.00
                </HelperText>
              )}
          </View>
          {reloadAmount !== '' && parseFloat(reloadAmount) >= 100 && (
            <Button
              mode="contained"
              style={styles.button}
              contentStyle={styles.buttonContent}
              onPress={() => handlePayAmount()}
            >
              Pay Amount
            </Button>
          )}
        </ActionSheet>
        
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
          style={{ backgroundColor: '#C8000D', marginBottom: 80, zIndex: 9999, elevation: 10 }}
        >
          {snackbarMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}
