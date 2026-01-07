import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Dialog, PaperProvider, Portal } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useApiCall } from '../../../hooks';
import styles from './style';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function SessionScreen() {
  const { ApiCall, ApiEndpoints, ApiMethod } = useApiCall();
  const userData = useSelector((state) => state.user?.userData);
  const accessToken = useSelector((state) => state.user?.accessToken);
  
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Format duration from "HH:MM:SS" to readable format
  const formatDuration = (duration) => {
    if (!duration) return '0h 0m 0s';
    
    // Duration is in format "HH:MM:SS"
    const parts = duration.split(':');
    if (parts.length === 3) {
      return `${parts[0]}h ${parts[1]}m ${parts[2]}s`;
    }
    
    return duration;
  };

  const fetchSessions = useCallback(async () => {
    if (!userData?.member_account || !accessToken) return;

    try {
      setIsLoading(true);
      const response = await ApiCall({
        apiEndpoint: `${ApiEndpoints().CHARGE_SESSIONS}${userData.member_account}`,
        method: ApiMethod.GET,
        apiAccessToken: accessToken
      });

      console.log('[charge sessions]', response?.data);

      if (response?.data) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Error fetching charge sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userData?.member_account, accessToken, ApiCall, ApiEndpoints, ApiMethod]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  }, [fetchSessions]);

  const handleSessionPress = (session) => {
    setSelectedSession(session);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  useEffect(() => {
    if (userData?.member_account && accessToken) {
      fetchSessions();
    }
  }, [userData?.member_account, accessToken]);

  return (
    <PaperProvider style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Charge Sessions" color="#fff"/>
      </Appbar.Header>

      <ScrollView 
        style={styles.sessionInfo}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#C8000D']} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C8000D" />
            <Text style={styles.loadingText}>Loading sessions...</Text>
          </View>
        ) : sessions.length > 0 ? (
          <>
            <View style={styles.headerRow}>
              <Text style={styles.generalInfoTitle}>My sessions ({sessions.length})</Text>
              <TouchableOpacity onPress={onRefresh}>
                <Text style={styles.refreshLink}>Refresh list</Text>
              </TouchableOpacity>
            </View>
            {sessions.map((session, index) => (
              <TouchableOpacity 
                key={session.id || index} 
                style={styles.infoCard}
                onPress={() => handleSessionPress(session)}
                activeOpacity={0.7}
              >
                <View style={styles.detailRow}>
                  {/* Left side: Icon + Details */}
                  <View style={styles.infoLeft}>
                    <View style={styles.iconContainer}>
                      <MaterialIcons name="ev-station" size={24} color="#666" />
                    </View>
                    <View style={styles.genralInfo}>
                      <Text style={styles.sessionId}>
                        {session.transactionId}
                      </Text>
                      <Text style={styles.chargerType}>
                        {session.chargers?.charger_type?.type || session.chargers?.name || 'ac ev charger'}
                      </Text>
                      <View style={styles.sessionDetails}>
                        <View style={styles.statusBadgeInline}>
                          <Text style={styles.statusTextInline}>
                            {session.status}
                          </Text>
                        </View>
                        <Text style={styles.locationText}>
                          {session.chargers?.location?.name || 'Unknown'}
                        </Text>
                      </View>
                      <View style={styles.sessionStats}>
                        <View style={styles.statItem}>
                          <MaterialIcons name="battery-charging-full" size={14} color="#666" />
                          <Text style={styles.statText}>
                            {session.energy ? session.energy.toFixed(2) : '0.00'}kWh
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <MaterialIcons name="access-time" size={14} color="#666" />
                          <Text style={styles.statText}>
                            {formatDuration(session.duration)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.costText}>
                            PHP {session.total_amount ? session.total_amount.toFixed(2) : '0.00'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Right side: Arrow */}
                  <View style={styles.sessionRight}>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <Text style={styles.noDataText}>No charge sessions found</Text>
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Session Detail</Dialog.Title>
          <Dialog.Content>
            {selectedSession && (
              <View style={styles.dialogContent}>
                <View style={styles.dialogRow}>
                  <Text style={styles.dialogLabel}>Status:</Text>
                  <Text style={styles.dialogValue}>{selectedSession.status}</Text>
                </View>
                <View style={styles.dialogRow}>
                  <Text style={styles.dialogLabel}>REF:</Text>
                  <Text style={styles.dialogValue}>{selectedSession.transactionId}</Text>
                </View>
                <View style={styles.dialogRow}>
                  <Text style={styles.dialogLabel}>Location:</Text>
                  <Text style={styles.dialogValue}>
                    {selectedSession.chargers?.location?.name || 'Unknown'}
                  </Text>
                </View>
                <View style={styles.dialogRow}>
                  <Text style={styles.dialogLabel}>Charger:</Text>
                  <Text style={styles.dialogValue}>
                    {selectedSession.chargers?.charger_type?.type || selectedSession.chargers?.name || 'ac ev charger'}
                  </Text>
                </View>
                <View style={styles.dialogRow}>
                  <Text style={styles.dialogLabel}>Power:</Text>
                  <Text style={styles.dialogValue}>
                    {selectedSession.energy ? selectedSession.energy.toFixed(2) : '0.00'} kWh
                  </Text>
                </View>
                <View style={styles.dialogRow}>
                  <Text style={styles.dialogLabel}>Duration:</Text>
                  <Text style={styles.dialogValue}>{formatDuration(selectedSession.duration)}</Text>
                </View>
                <View style={styles.dialogRow}>
                  <Text style={styles.dialogLabel}>Total:</Text>
                  <Text style={styles.dialogValue}>
                  PHP {selectedSession.total_amount ? selectedSession.total_amount.toFixed(2) : '0.00'}
                  </Text>
                </View>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="#007AFF">
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}