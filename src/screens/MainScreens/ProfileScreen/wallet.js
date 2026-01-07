import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, Card, IconButton, List, PaperProvider } from 'react-native-paper';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useApiCall } from '../../../hooks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function WalletScreen() {
const navigation = useNavigation();
const [refreshing, setRefreshing] = useState(false);
const [selectedIndex, setSelectedIndex] = useState(0);
const [profileData, setProfileData] = useState(null);
const [balanceVisible, setBalanceVisible] = useState(true);
const userData = useSelector((state) => state.user?.userData);
const accessToken = useSelector((state) => state.user?.accessToken);
const { ApiCall, ApiEndpoints, ApiMethod } = useApiCall();

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
    
    setBalanceVisible(visible);
}, []);

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
            setBalanceVisible(response.data.device_wallet_show  || false);
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

useEffect(() => {
    fetchUserData();
}, [userData?.member_account, accessToken]);

  return (
    <PaperProvider style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Fuse Wallet" color="#fff"/>
        {/* <Appbar.Action icon={MORE_ICON} onPress={() => {}} color="#fff" /> */}
      </Appbar.Header>

      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View>
            <View style={styles.walletHeader}>
              <View style={styles.balanceRow}>
                <View style={styles.balanceTextContainer}>
                  <Text style={styles.walletTitle}>Available Balance</Text>
                  <Text style={styles.walletAmount}>
                    {balanceVisible ?  'PHP ' + (profileData?.wallet?.wallet_balance || '0.00') : 'PHP ---'}
                  </Text>
                </View>
                <IconButton
                  icon={balanceVisible ? 'eye' : 'eye-off'}
                  iconColor="#fff"
                  size={24}
                  onPress={() => setBalanceVisibleData(!balanceVisible)}
                  style={styles.eyeIcon}
                />
              </View>
            </View>


          <Card style={styles.activityCard} mode='contained'>
            <SegmentedControlTab
              values={["ACCOUNT DETAILS", "TRANSACTIONS"]}
              selectedIndex={selectedIndex}
              onTabPress={setSelectedIndex}
              tabsContainerStyle={styles.tabsContainer}
              tabStyle={styles.tabStyle}
              activeTabStyle={styles.activeTabStyle}
              tabTextStyle={styles.tabTextStyle}
              activeTabTextStyle={styles.activeTabTextStyle}
              borderRadius={0}
            />

            <View style={styles.tabContent}>
                {/* ACCOUNT DETAILS */}
              {selectedIndex === 0 && (
                <View>
                  <List.Item
                    title='Account Number'
                    description={profileData?.wallet?.wallet_account?.toString() || ''}
                    style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
                    />
                  <List.Item
                    title='Product'
                    description='FUSE WALLET'
                    style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
                    />
                  <List.Item
                    title='Account Status'
                    description='Active'
                    style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
                    />
                </View>
              )}

              {/* TRANSACTIONS */}
              {selectedIndex === 1 && (
                <View style={styles.scrollContent}>
                  {console.log('[profileData?.wallet?.histories]', profileData?.wallet?.histories)}
                  {profileData?.wallet?.histories && profileData.wallet.histories.length > 0 ? (
                    profileData.wallet.histories.map((transaction, index) => {
                      // Use 'type' field: 'reload' is credit (+), 'payment' is debit (-)
                      const isCredit = transaction.type === 'reload';
                      const formattedDate = transaction.created_at 
                        ? new Date(transaction.created_at).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric'
                          })
                        : '';
                      
                      return (
                        <List.Item
                          key={index}
                          title={transaction?.type === 'reload' ? 'PAYMENT GATEWAY' : (transaction?.remarks || '')}
                          description={transaction?.reference_number || ''}
                          right={props => (
                            <View style={styles.transactionRight}>
                              <Text style={styles.transactionStatus}>{formattedDate}</Text>
                              <Text style={[
                                styles.transactionAmount,
                                isCredit ? styles.transactionAmountGreen : styles.transactionAmountRed
                              ]}>
                                {isCredit ? '+' : '-'}PHP {Math.abs(transaction.amount || 0).toFixed(2)}
                              </Text>
                            </View>
                          )}
                          style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
                        />
                      );
                    })
                  ) : (
                    <Text style={styles.tabContentText}>No transactions yet</Text>
                  )}
                </View>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#C8000D',
        color: '#fff'
    },
  container: {
    flex: 1
  },
  activityCard: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: SCREEN_HEIGHT - 185, // Screen height minus appbar (~56) and marginTop (50)
  },
  scrollContent: {
    paddingBottom: 100,
  },
  walletTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
  walletAmount: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 0,
  },
  walletHeader: {
    marginLeft: 20,
    flex: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  balanceTextContainer: {
    flex: 1,
  },
  eyeIcon: {
    marginTop: 40,
  },
  appbar: {
    backgroundColor: '#C8000D',
    color: '#fff'
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabsContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    paddingVertical: 12,
  },
  activeTabStyle: {
    backgroundColor: 'transparent',
    borderBottomColor: '#C8000D',
  },
  tabTextStyle: {
    color: '#999',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  activeTabTextStyle: {
    color: '#C8000D',
    fontWeight: '600',
  },
  tabContent: {
    marginTop: 10,
  },
  tabContentText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  transactionRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  transactionAmountRed: {
    color: '#C8000D',
  },
  transactionAmountGreen: {
    color: 'green',
  },
  transactionStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
