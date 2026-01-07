import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F9',
  },
  camera: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
  },
  titleText: {
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 10,
    paddingHorizontal: 20
  },
  inboxContainer: {
    backgroundColor: '#F4F5F9',
    marginTop: 0,
    marginHorizontal: 0
  },
  labelDesc: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  appbar: {
    backgroundColor: '#C8000D',
    color: '#fff'
  },
  button: {
    color: '#fff',
    backgroundColor: '#C8000D',
    marginTop: 8,
    marginHorizontal: 16,
  },
  buttonDisabled: {
    backgroundColor: '#FFB3B3',
  },
  buttonContent: {
    paddingVertical: 0,
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
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
});

export default styles;