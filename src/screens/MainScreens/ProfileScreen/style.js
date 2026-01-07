import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    formContainer: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 18,
    },
    form: {
      gap: 16,
    },
    input: {
      backgroundColor: '#fff',
    },
    button: {
      color: '#fff',
      backgroundColor: '#C8000D',
      marginHorizontal: 16,
      marginBottom: 20,
    },
    buttonContent: {
      paddingVertical: 0,
    },
    settingsTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#333',
      marginTop: 10,
      marginLeft: 16,
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
    settingsSheet: {
      backgroundColor: '#fff',
      marginTop: 12,
      marginHorizontal: 16
    },
    divider: {
      backgroundColor: '#E0E0E0',
    },
    appbar: {
      backgroundColor: '#C8000D',
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
  });

export default styles;