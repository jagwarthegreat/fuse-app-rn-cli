import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, PaperProvider, Text, TextInput } from 'react-native-paper';

export default function TabTwoScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [serialNumber, setSerialNumber] = useState('');
  const [connectorNumber, setConnectorNumber] = useState('');

  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  
  const isAccessDisabled = !serialNumber.trim() || !connectorNumber.trim();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return; // Prevent multiple scans
    
    setScanned(true);
    setScanning(false);
    
    // Try to parse the scanned data
    // Format could be: SERIAL:CONNECTOR or just SERIAL
    try {
      const parts = data.split(':');
      if (parts.length >= 2) {
        setSerialNumber(parts[0].trim());
        setConnectorNumber(parts[1].trim());
        alert('QR Code scanned successfully!\nSerial and Connector populated.');
      } else {
        // If no separator, just set as serial number
        setSerialNumber(data.trim());
        alert('QR Code scanned!\nSerial number populated. Please enter connector number manually.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error parsing code: ${errorMessage}`);
    }
  };

  const startScanning = () => {
    setScanning(true);
    setScanned(false);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const handleAccessCharger = () => {
    // TODO: Implement charger access logic
    alert(`Accessing charger:\nSerial: ${serialNumber}\nConnector: ${connectorNumber}`);
  };

  if (!permission) {
    return <Text>Requesting camera permission</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', padding: 20 }}>
          Camera permission is required to scan QR codes
        </Text>
        <Button mode="contained" onPress={requestPermission} style={styles.button}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          {/* <Appbar.BackAction onPress={() => {}} color="#fff" /> */}
          <Appbar.Content title="Access Charger" color="#fff"/>
          {/* <Appbar.Action icon="magnify" onPress={() => {}} color="#fff" /> */}
          {/* <Appbar.Action icon={MORE_ICON} onPress={() => {}} color="#fff" /> */}
        </Appbar.Header>

        {scanning && (
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'code93', 'codabar', 'upc_a', 'upc_e'],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          >
            <View style={styles.scannerOverlay}>
              <Text style={styles.scannerText}>Scan QR Code</Text>
            </View>
          </CameraView>
        )}

        <View style={styles.inboxContainer}>
        <Text variant="titleMedium" style={styles.titleText}>Manual Entry</Text>
        <Text variant="titleSmall" style={styles.labelDesc}>Enter charger serial number and connector to access the charger details.</Text>
        <TextInput
              label="Serial number"
              value={serialNumber}
              onChangeText={setSerialNumber}
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#C8000D"
              outlineColor="#C8000D"
              textColor="#C8000D"
            />
          <TextInput
              label="Connector Number"
              value={connectorNumber}
              onChangeText={setConnectorNumber}
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#C8000D"
              outlineColor="#C8000D"
              textColor="#C8000D"
            />

            <Button
              mode="contained"
              onPress={handleAccessCharger}
              disabled={isAccessDisabled}
              style={[styles.button, isAccessDisabled && styles.buttonDisabled, { marginTop: 16 }]}
              contentStyle={styles.buttonContent}
            >
              Access Charger
            </Button>

            <Text variant="titleSmall" style={[styles.labelDesc, { textAlign: 'center' }]}>- OR -</Text>

            <Button
              mode="contained"
              onPress={scanning ? stopScanning : startScanning}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {scanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>

        </View>
      </View>
    </PaperProvider>
  );
}

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
