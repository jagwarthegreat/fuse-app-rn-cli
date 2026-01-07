import { useState, useEffect } from 'react';
import { View, Alert, Platform } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Appbar, Button, PaperProvider, Text, TextInput } from 'react-native-paper';
import styles from './style';

export default function QrScanScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [connectorNumber, setConnectorNumber] = useState('');

  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  
  const device = useCameraDevice('back');
  const isAccessDisabled = !serialNumber.trim() || !connectorNumber.trim();

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.CAMERA 
      : PERMISSIONS.ANDROID.CAMERA;
    
    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
    } else {
      setHasPermission(false);
    }
  };

  const requestCameraPermission = async () => {
    const permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.CAMERA 
      : PERMISSIONS.ANDROID.CAMERA;
    
    const result = await request(permission);
    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes');
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'code-93', 'codabar', 'upc-a', 'upc-e'],
    onCodeScanned: (codes) => {
      if (scanned || !scanning) return; // Prevent multiple scans
      
      const code = codes[0];
      if (code?.value) {
        setScanned(true);
        setScanning(false);
        
        // Try to parse the scanned data
        // Format could be: SERIAL:CONNECTOR or just SERIAL
        try {
          const parts = code.value.split(':');
          if (parts.length >= 2) {
            setSerialNumber(parts[0].trim());
            setConnectorNumber(parts[1].trim());
            Alert.alert('Success', 'QR Code scanned successfully!\nSerial and Connector populated.');
          } else {
            // If no separator, just set as serial number
            setSerialNumber(code.value.trim());
            Alert.alert('QR Code Scanned', 'Serial number populated. Please enter connector number manually.');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          Alert.alert('Error', `Error parsing code: ${errorMessage}`);
        }
      }
    },
  });

  const startScanning = () => {
    setScanning(true);
    setScanned(false);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const handleAccessCharger = () => {
    // TODO: Implement charger access logic
    Alert.alert('Access Charger', `Serial: ${serialNumber}\nConnector: ${connectorNumber}`);
  };

  if (!hasPermission) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Appbar.Header style={styles.appbar}>
            <Appbar.Content title="Access Charger" color="#fff"/>
          </Appbar.Header>
          <View style={styles.container}>
            <Text style={{ textAlign: 'center', padding: 20 }}>
              Camera permission is required to scan QR codes
            </Text>
            <Button mode="contained" onPress={requestCameraPermission} style={styles.button}>
              Grant Permission
            </Button>
          </View>
        </View>
      </PaperProvider>
    );
  }

  if (!device) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Appbar.Header style={styles.appbar}>
            <Appbar.Content title="Access Charger" color="#fff"/>
          </Appbar.Header>
          <View style={styles.container}>
            <Text style={{ textAlign: 'center', padding: 20 }}>
              Camera not available
            </Text>
          </View>
        </View>
      </PaperProvider>
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
          <Camera
            style={styles.camera}
            device={device}
            isActive={scanning}
            codeScanner={codeScanner}
          >
            <View style={styles.scannerOverlay}>
              <Text style={styles.scannerText}>Scan QR Code</Text>
            </View>
          </Camera>
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


