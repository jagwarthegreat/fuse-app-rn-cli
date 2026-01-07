import { useCallback, useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, Button, Card, Dialog, List, PaperProvider, Portal, Text, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useApiCall, useSignOut } from '../../../hooks';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { signOut } = useSignOut();
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const userData = useSelector((state) => state.user?.userData);
  const accessToken = useSelector((state) => state.user?.accessToken);
  const { ApiCall, ApiEndpoints, ApiMethod } = useApiCall();
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deactivateAccountVisible, setDeactivateAccountVisible] = useState(false);
  const [confirmDeactivateVisible, setConfirmDeactivateVisible] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const showEditProfileDialog = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue || '');
    setEditProfileVisible(true);
  };
  
  const hideEditProfileDialog = () => {
    setEditProfileVisible(false);
    setEditField('');
    setEditValue('');
  };

  const showDeactivateDialog = () => {
    setDeactivateAccountVisible(true);
  };

  const hideDeactivateDialog = () => {
    setDeactivateAccountVisible(false);
  };

  const showConfirmDeactivateDialog = () => {
    setDeactivateAccountVisible(false);
    setConfirmDeactivateVisible(true);
  };

  const hideConfirmDeactivateDialog = () => {
    setConfirmDeactivateVisible(false);
  };

  const handleDeactivateAccount = async () => {
    if (!displayData?.member_account) {
      console.warn('[handleDeactivateAccount] No member_account found');
      return;
    }

    try {
      setIsDeactivating(true);

      const response = await ApiCall({
        apiEndpoint: ApiEndpoints().PROFILE_DEACTIVATE + displayData.member_account + '/deactivate',
        method: ApiMethod.DELETE,
        apiAccessToken: accessToken,
      });

      if (response?.data || response?.status === 200) {
        console.log('[handleDeactivateAccount] Account deactivated successfully');
        
        // Close the dialog
        hideConfirmDeactivateDialog();
        
        // Sign out and clear all data
        await signOut('Your account has been deactivated');
      }
    } catch (error) {
      console.error('[handleDeactivateAccount] Error:', error);
      console.error('[handleDeactivateAccount] Error Response:', error?.response?.data);
      console.error('[handleDeactivateAccount] Error Status:', error?.response?.status);
      
      // Still sign out even if API call fails
      hideConfirmDeactivateDialog();
      await signOut('Account deactivation failed, but you have been signed out');
    } finally {
      setIsDeactivating(false);
    }
  };

  const fetchUserData = useCallback(async () => {
    if (!userData?.member_account) {
      console.warn('[fetchUserData] No member_account found');
      return;
    }

    if (!accessToken) {
      console.warn('[fetchUserData] No access token found');
      return;
    }

    try {
      setRefreshing(true);
      const response = await ApiCall({
        apiEndpoint: ApiEndpoints().USER_DATA + userData.member_account,
        method: ApiMethod.GET,
        apiAccessToken: accessToken,
      });

      if (response?.data) {
        console.log('[fetchUserData response]', response.data);
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('[fetchUserData error]', error);
    } finally {
      setRefreshing(false);
    }
  }, [userData?.member_account, accessToken, ApiCall, ApiEndpoints, ApiMethod]);

  const onRefresh = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSaveProfile = async () => {
    if (!editField || !displayData?.member_account) {
      console.warn('[handleSaveProfile] Missing field or member_account');
      return;
    }

    try {
      setIsSaving(true);
      
      // Prepare the data to send - only the field being edited
      let updateData;
      if (editField === 'firstname') {
        updateData = {inputdata: 'firstname', labeldata: editValue};
      } else if (editField === 'lastname') {
        updateData = {inputdata: 'lastname', labeldata: editValue};
      } else if (editField === 'email') {
        updateData = {inputdata: 'email', labeldata: editValue};
      }else if (editField === 'phone') {
        updateData = {inputdata: 'phone', labeldata: editValue};
      }else if (editField === 'username') {
        updateData = {inputdata: 'username', labeldata: editValue};
      }else if (editField === 'password') {
        updateData = {inputdata: 'password', labeldata: editValue};
      }else {
        updateData = {inputdata: 'address', labeldata: editValue};
      }

      const response = await ApiCall({
        apiEndpoint: ApiEndpoints().PROFILE_UPDATE + displayData.member_account,
        method: ApiMethod.PUT,
        apiAccessToken: accessToken,
        apiData: updateData,
      });

      if (response?.data) {
        // Update local state with new value
        setProfileData((prev) => ({
          ...prev,
          [editField]: editValue,
        }));

        hideEditProfileDialog();
        
        // Optionally refresh to get latest data from server
        fetchUserData();
      }
    } catch (error) {
      console.error('[handleSaveProfile] Error:', error);
      console.error('[handleSaveProfile] Error Response:', error?.response?.data);
      console.error('[handleSaveProfile] Error Status:', error?.response?.status);
      console.error('[handleSaveProfile] Error Message:', error?.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userData?.member_account, accessToken]);

  const menuItems = [
    { icon: 'wallet', label: 'Reload Wallet', onPress: () => {} },
    // { icon: 'car', label: 'My Cars', onPress: () => {} },
    { icon: 'cog', label: 'Settings', onPress: () => {} },
    // { icon: 'headset', label: 'Support', onPress: () => {} },
  ];

  const displayData = profileData || userData;

  const menuAppUpdateItems = [
    { 
      icon: '', 
      label: 'Account #', 
      onPress: () => {}, 
      right: <Text style={styles.menuItemText}>{displayData?.member_account || ''}</Text>,
      editable: false 
    },
    { 
      icon: '', 
      label: 'First Name', 
      onPress: () => showEditProfileDialog('firstname', displayData?.firstname), 
      right: <Text style={styles.menuItemText}>{displayData?.firstname || ''}</Text>,
      editable: true 
    },
    { 
      icon: '', 
      label: 'Last Name', 
      onPress: () => showEditProfileDialog('lastname', displayData?.lastname), 
      right: <Text style={styles.menuItemText}>{displayData?.lastname || ''}</Text>,
      editable: true 
    },
    { 
      icon: '', 
      label: 'Email', 
      onPress: () => showEditProfileDialog('email', displayData?.email), 
      right: <Text style={styles.menuItemText}>{displayData?.email || ''}</Text>,
      editable: true 
    },
    { 
      icon: '', 
      label: 'Phone', 
      onPress: () => showEditProfileDialog('phone', displayData?.phone), 
      right: <Text style={styles.menuItemText}>{displayData?.phone || ''}</Text>,
      editable: true 
    },
    { 
      icon: '', 
      label: 'Address', 
      onPress: () => showEditProfileDialog('address', displayData?.address), 
      right: <List.Icon icon='chevron-right'/>,
      editable: true 
    }
  ];

  return (
    <PaperProvider style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()}/>
        <Appbar.Content title="Profile"/>
        {/* <Appbar.Action icon={MORE_ICON} onPress={() => {}}/> */}
      </Appbar.Header>

      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Avatar.Icon size={120} icon="account" style={styles.avatarLarge} />
          <Text style={styles.userName}>{displayData?.username || 'Not available'}</Text>
        </View>

        <Card style={styles.menuAppVersionCard} mode='contained'>
            {menuAppUpdateItems.map((item, index) => (
              <View key={index}>
                  <List.Item
                    title={item.label}
                    onPress={item.onPress}
                    right={props => item.right}
                    style={index !== menuAppUpdateItems.length - 1 ? {borderBottomWidth: .7, borderBottomColor: '#ddd'} : {}}
                  />
              </View>
            ))}
        </Card>

        <Card style={[styles.menuItemCard, {marginTop: 20}]} mode='contained'>
          <TouchableOpacity onPress={() => {showEditProfileDialog('username', displayData?.username)}}>
            <List.Item
              title='Username'
              left={props => <List.Icon {...props} icon='account-circle' color="#C8000D" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {showEditProfileDialog('password', displayData?.password)}}>
            <List.Item
              title='Password'
              left={props => <List.Icon {...props} icon='lock-outline' color="#C8000D" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableOpacity>
        </Card>

        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={showDeactivateDialog}
        >
          Deactivate Account
        </Button>
          

        <Portal>
          <Dialog style={{ backgroundColor: '#fff' }} visible={editProfileVisible} onDismiss={hideEditProfileDialog}>
            <Dialog.Title>
              Edit {editField === 'firstname' ? 'First Name' : 
                    editField === 'lastname' ? 'Last Name' : 
                    editField === 'email' ? 'Email' : 
                    editField === 'phone' ? 'Phone' : 
                    editField === 'address' ? 'Address' :
                    editField === 'username' ? 'Username' :
                    editField === 'password' ? 'Password' : 'Profile'}
            </Dialog.Title>
            <Dialog.Content>
              <TextInput 
                label={editField === 'firstname' ? 'First Name' : 
                       editField === 'lastname' ? 'Last Name' : 
                       editField === 'email' ? 'Email' : 
                       editField === 'phone' ? 'Phone' : 
                       editField === 'address' ? 'Address' :
                       editField === 'username' ? 'Username' :
                       editField === 'password' ? 'Password' : 'Value'}
                value={editValue}
                onChangeText={setEditValue}
                mode="outlined"
                keyboardType={editField === 'email' ? 'email-address' : editField === 'phone' ? 'phone-pad' : 'default'}
                autoCapitalize={editField === 'email' ? 'none' : 'words'}
                activeOutlineColor="#C8000D"
                outlineColor="#C8000D"
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideEditProfileDialog} textColor="#666">Cancel</Button>
              <Button 
                onPress={handleSaveProfile} 
                loading={isSaving}
                disabled={isSaving}
                textColor="#C8000D"
              >
                Save
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog style={{ backgroundColor: '#fff' }} visible={deactivateAccountVisible} onDismiss={hideDeactivateDialog}>
            <Dialog.Title>Deactivate Account</Dialog.Title>
            <Dialog.Content>
              <Text style={{ fontSize: 16, lineHeight: 24 }}>
                Are you sure you want to deactivate your account? This action will sign you out and you'll need to contact support to reactivate your account.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDeactivateDialog} textColor="#666">Cancel</Button>
              <Button 
                onPress={showConfirmDeactivateDialog}
                textColor="#C8000D"
              >
                Continue
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog style={{ backgroundColor: '#fff' }} visible={confirmDeactivateVisible} onDismiss={hideConfirmDeactivateDialog}>
            <Dialog.Title style={{ color: '#C8000D' }}>Final Confirmation</Dialog.Title>
            <Dialog.Content>
              <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#C8000D' }}>
                This action cannot be undone!
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 22, marginTop: 12 }}>
                Your account will be permanently deactivated and all your data will be cleared from this device. You will need to contact support to reactivate your account.
              </Text>
              <Text style={{ fontSize: 14, lineHeight: 22, marginTop: 12, fontWeight: '500' }}>
                Do you really want to proceed?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideConfirmDeactivateDialog} textColor="#666" disabled={isDeactivating}>Cancel</Button>
              <Button 
                onPress={handleDeactivateAccount} 
                loading={isDeactivating}
                disabled={isDeactivating}
                buttonColor="#C8000D"
                textColor="#fff"
                mode="contained"
              >
                Yes, Deactivate
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuItemCard: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16
  },
  menuAppVersionCard: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16
  },
  divider: {
    backgroundColor: '#E0E0E0',
  },
  appbar: {
    backgroundColor: '#F4F5F9',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F4F5F9',
  },
  profileCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#212D39',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userIdBadge: {
    backgroundColor: '#FFE5E7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  userIdText: {
    color: '#C8000D',
    fontSize: 12,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  walletCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#C8000D',
    borderRadius: 8,
    elevation: 2,
  },
  walletContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  walletTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  walletAmount: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 15,
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
  },
  appVersion: {
    fontSize: 12,
    color: '#999',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  menuItemText: {
    color: '#505050',
  },
  profileSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  avatarLarge: {
    backgroundColor: '#212D39',
    marginBottom: 16,
  },
  button: {
    color: '#fff',
    backgroundColor: '#C8000D',
    marginTop: 20,
    marginHorizontal: 16
  },
  buttonContent: {
    paddingVertical: 0,
  },
});
