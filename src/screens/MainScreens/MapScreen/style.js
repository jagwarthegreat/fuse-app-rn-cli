import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    locationInfoCard: {
      backgroundColor: '#fff',
      marginTop: 0,
      marginHorizontal: 0,
      borderRadius: 0,
    },
    chargerInfoTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#333',
      marginTop: 0,
      marginLeft: 16,
    },
    chargerInfoSheet: {
      backgroundColor: '#F4F5F9',
      marginTop: 0,
      marginHorizontal: 0
    },
    chargerInfoHEaderSheet: {
      backgroundColor: '#fff',
      marginTop: 0,
      marginHorizontal: 0
    },
    map: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    fabGroup: {
      position: 'absolute',
      right: 0,
      bottom: 45,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
    button: {
      backgroundColor: '#0a7ea4',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
      minHeight: 48,
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
    responseContainer: {
      backgroundColor: '#f0f0f0',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    responseText: {
      fontSize: 12,
      fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
      marginTop: 4,
    },
    errorContainer: {
      backgroundColor: '#ffebee',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    errorText: {
      color: '#c62828',
    },
    markerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerPin: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#aa0a14', // Dark red
      borderWidth: 4,
      borderColor: '#e82532', // Light red
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    markerText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: 'bold',
    },
    markerTip: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#CD5C5C', // Light red to match border
      marginTop: -2,
    },
    
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: 0,
      borderBottomWidth: 2,
      borderBottomColor: '#e0e0e0',
    },
    tabStyle: {
      flex: 1,
      backgroundColor: 'transparent',
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTabStyle: {
      borderBottomColor: '#C8000D',
    },
    tabContent: {
      backgroundColor: '#F4F5F9',
      marginTop: 0,
      // maxHeight: 400,
      paddingBottom: 20,
    },
    tabContentText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginTop: 20,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 30,
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
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 12,
    },
    chargerCard: {
      backgroundColor: '#fff',
      padding: 14,
      borderRadius: 0,
      marginBottom: 0,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    chargerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    chargerLeft: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'flex-start',
    },
    chargerIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    chargerInfo: {
      flex: 1,
    },
    chargerType: {
      fontSize: 15,
      fontWeight: '600',
      color: '#333',
      marginBottom: 2,
    },
    chargerId: {
      fontSize: 13,
      color: '#666',
      marginBottom: 6,
    },
    chargerSpecs: {
      flexDirection: 'row',
      gap: 6,
      flexWrap: 'wrap',
    },
    specBadge: {
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    specText: {
      fontSize: 11,
      color: '#666',
      fontWeight: '500',
    },
    chargerRight: {
      alignItems: 'flex-end',
      marginLeft: 8,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 4,
      marginBottom: 6,
    },
    statusText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    chargerPrice: {
      fontSize: 12,
      fontWeight: '600',
      color: '#333',
    },
    chargerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    chargerDetail: {
      fontSize: 13,
      color: '#666',
      marginTop: 4,
    },
    infoCard: {
      marginBottom: 16,
    },
    infoLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#666',
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      color: '#333',
    },
    generalInfoTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#999',
      marginBottom: 8,
      marginHorizontal: 14,
      marginTop: 8,
    },
    generalInfoSection: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      paddingBottom: 12,
    },
    generalInfoLabel: {
      fontSize: 14,
      color: '#999',
      marginBottom: 6,
    },
    generalInfoValue: {
      fontSize: 14,
      color: '#333',
    },
    operationalTimeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    operationalTimeValue: {
      fontSize: 14,
      color: '#333',
      fontWeight: '500',
    },
    contactInfoTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: '#999',
      marginBottom: 16,
      marginTop: 8,
    },
    chargerHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 14,
      marginTop: 0,
      marginBottom: 0,
    },
    refreshLink: {
      textDecorationLine: 'underline',
      fontSize: 14,
      color: '#007AFF',
      fontWeight: '500',
    },
    snackbar: {
      backgroundColor: '#C8000D',
      marginBottom: 80, // Position above the tab navigation
      zIndex: 9999,
      elevation: 10, // For Android shadow/elevation
    },
    snackbarWrapper: {
      zIndex: 9999,
      elevation: 10,
    },
});

export default styles;