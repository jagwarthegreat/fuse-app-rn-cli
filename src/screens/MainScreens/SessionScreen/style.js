import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    generalInfoTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#999',
      marginBottom: 8,
      marginHorizontal: 14,
      marginTop: 8,
    },
    infoCard: {
      backgroundColor: '#fff',
      padding: 14,
      borderRadius: 0,
      marginBottom: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    genralInfo: {
      flex: 1,
    },
    sessionId: {
      fontSize: 16,
      fontWeight: '700',
      color: '#333',
      marginBottom: 1,
    },
    chargerType: {
      fontSize: 13,
      color: '#666',
      marginBottom: 2,
    },
    sessionDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
    },
    statusBadgeInline: {
      backgroundColor: '#E3F2FD',
      paddingHorizontal: 8,
      paddingVertical: 1,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#2196F3',
    },
    statusTextInline: {
      color: '#2196F3',
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    locationText: {
      fontSize: 12,
      color: '#666',
      fontWeight: '500',
    },
    sessionStats: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statText: {
      fontSize: 12,
      color: '#666',
    },
    costText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#333',
    },
    sessionRight: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 30,
    },
    infoLeft: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'flex-start',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 14,
      marginTop: 0,
      marginBottom: 2,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    refreshLink: {
      textDecorationLine: 'underline',
      fontSize: 14,
      color: '#007AFF',
      fontWeight: '500',
    },
    loadingText: {
      fontSize: 14,
      color: '#999',
      textAlign: 'center',
      marginTop: 12,
    },
    noDataText: {
      fontSize: 14,
      color: '#999',
      textAlign: 'center',
      paddingVertical: 30,
    },
    appbar: {
      backgroundColor: '#C8000D',
      color: '#fff'
    },
    sessionInfo: {
      backgroundColor: '#F4F5F9',
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    dialog: {
      backgroundColor: '#fff',
    },
    dialogTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
    dialogContent: {
      paddingTop: 8,
    },
    dialogRow: {
      flexDirection: 'row',
      paddingVertical: 6,
      borderBottomWidth: 0,
    },
    dialogLabel: {
      fontSize: 14,
      color: '#666',
      fontWeight: '500',
      width: 80,
    },
    dialogValue: {
      fontSize: 14,
      color: '#333',
      fontWeight: '600',
      flex: 1,
    },
  });

export default styles;