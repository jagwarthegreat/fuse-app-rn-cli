import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet from "react-native-actions-sheet";
import MapView, { Marker } from "react-native-maps";
import { Card, FAB, List, PaperProvider, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useApiCall } from '../../../hooks';
import {
  setSelectedCharger,
  setSelectedLocation as setSelectedLocationAction
} from '../../../redux/reducer/Charger';
import styles from './style';

// Custom Marker Component
const CustomMarkerView = ({ available, total }) => (
  <View style={styles.markerContainer}>
    <View style={styles.markerPin}>
      <Text style={styles.markerText}>{available}/{total}</Text>
    </View>
    <View style={styles.markerTip} />
  </View>
);

export default function MapScreen() {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [state, setState] = useState({ open: false });
  const [markers, setMarkers] = useState([]);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const chargerInfoSheetRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [isLoadingChargers, setIsLoadingChargers] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapTilesLoaded, setMapTilesLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const initialRegion = {
    latitude: 9.9343392,
    longitude: 122.9796143,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  };
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const { ApiCall, ApiEndpoints, ApiMethod } = useApiCall();
  const accessToken = useSelector((state) => state.user?.accessToken);
  const dispatch = useDispatch();

  const tabs = [
    { icon: 'flash-on', label: 'Details' },
    { icon: 'info', label: 'Info' },
    { icon: 'image', label: 'Images' },
    { icon: 'comment', label: 'Comments' }
  ];

  // Fetch all locations
  const fetchLocations = useCallback(async () => {
    try {
      setTracksViewChanges(true);
      const response = await ApiCall({
        apiEndpoint: ApiEndpoints().ALL_LOCATIONS,
        method: ApiMethod.GET,
        apiAccessToken: accessToken
      });

      if (response?.data) {
        // Map API response to markers format
        console.log('[locations]', response.data);
        const locationMarkers = response.data
          .map((location) => ({
            id: location.id,
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            title: location.name,
            address: location.address,
            operational_time: location.operational_time,
            total_chargers: location.total_chargers,
            available_chargers: location.available_chargers,
            contact_email: location.contact_email,
            contact_number: location.contact_number,
          }))
          .filter((marker) => {
            // Filter out markers with invalid coordinates
            const isValid = !isNaN(marker.latitude) && !isNaN(marker.longitude) && 
                           marker.latitude >= -90 && marker.latitude <= 90 &&
                           marker.longitude >= -180 && marker.longitude <= 180;
            if (!isValid) {
              console.warn('Invalid marker:', marker);
            }
            return isValid;
          });
        
        setMarkers(locationMarkers);
        
        // Stop tracking after markers render
        setTimeout(() => {
          setTracksViewChanges(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Unable to load locations');
    }
  }, [ApiCall, ApiEndpoints, ApiMethod, accessToken]);

  // Fetch chargers for a specific location
  const fetchLocationChargers = useCallback(async (locationData) => {
    try {
      setIsLoadingChargers(true);
      const response = await ApiCall({
        apiEndpoint: `${ApiEndpoints().CHARGERS_IN_LOCATION}${locationData.id}`,
        method: ApiMethod.GET,
        apiAccessToken: accessToken
      });

      console.log('[chargers in location]', response?.data);
      console.log('[selected location]', locationData);

      if (response?.data) {
        // Set the location data
        const locationInfo = {
          id: locationData.id,
          name: locationData.title || 'Unknown Location',
          address: locationData.address || '',
          latitude: locationData.latitude || '',
          longitude: locationData.longitude || '',
          ...locationData
        };
        setSelectedLocation(locationInfo);

        // Set the chargers data
        const chargersData = response.data || [];
        setChargers(chargersData);
      }
    } catch (error) {
      console.error('Error fetching chargers:', error);
      Alert.alert('Error', 'Unable to load chargers for this location');
    } finally {
      setIsLoadingChargers(false);
    }
  }, [ApiCall, ApiEndpoints, ApiMethod, accessToken]);

  useEffect(() => {
    // Fetch locations on mount or when accessToken changes
    if (accessToken) {
      fetchLocations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Diagnostic: Log map initialization
  useEffect(() => {
    console.log('📍 MapScreen mounted');
    console.log('📍 Initial region:', initialRegion);
    console.log('📍 Package name: com.test');
    console.log('📍 Debug SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25');
  }, []);

  // Fallback: Set map as ready after 5 seconds if onMapReady never fires
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!mapReady) {
        console.warn('⚠️ Map ready timeout - map may not be loading properly');
        console.warn('⚠️ Check Google Cloud Console API key restrictions:');
        console.warn('   - Package name: com.test');
        console.warn('   - SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25');
        setMapReady(true); // Hide loading overlay to see if map renders
      }
      // Removed aggressive tile loading check - onError will handle actual errors
    }, 5000);
    return () => clearTimeout(timeout);
  }, [mapReady]);


  const goToMyLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01, // zoom level
            longitudeDelta: 0.01,
          }, 1000); // animation duration in ms
        },
        (error) => {
          console.log('Error getting location:', error);
          Alert.alert('Error', 'Unable to get your location. Please enable location permissions in settings.');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      console.log('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your location');
    }
  };

  const handleRefreshMap = async () => {
    // Fetch fresh location data
    await fetchLocations();
    
    // Reset map to initial region
    mapRef.current?.animateToRegion(initialRegion, 500);

    // Show snackbar notification
    setSnackbarVisible(true);
  };

  const handleRefreshChargers = async () => {
    if (selectedLocation) {
      await fetchLocationChargers(selectedLocation);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Map View - Using regular MapView since clustering is disabled */}
        <MapView 
          ref={mapRef}
          provider="google"
          style={styles.map} 
          initialRegion={initialRegion}
          onMapReady={() => {
            console.log('✅ Map is ready');
            setMapReady(true);
            // Clear any previous errors when map becomes ready
            setMapError(null);
          }}
          onError={(error) => {
            console.error('❌ Map error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            setMapError(error?.message || 'Unknown map error');
            setMapReady(true); // Hide loading overlay even on error
            Alert.alert(
              'Map Error', 
              `Failed to load map.\n\nError: ${error?.message || 'Unknown error'}\n\nPlease check:\n1. Google Maps API key is correct\n2. API key restrictions allow this app\n3. Package name matches: com.test\n4. Google Play Services is installed\n5. Maps SDK for Android is enabled in Google Cloud Console`,
              [{ text: 'OK' }]
            );
          }}
          onLoad={() => {
            console.log('✅ Map tiles loaded successfully');
            setMapTilesLoaded(true);
            setMapError(null); // Clear any errors when tiles load
          }}
          onLoadStart={() => {
            console.log('📍 Map loading started');
            // Don't reset mapTilesLoaded here - let onLoad handle it
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          showsCompass={true}
          showsScale={false}
          loadingEnabled={true}
          loadingIndicatorColor="#C8000D"
          loadingBackgroundColor="#ffffff"
          mapType="standard"
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.title}
              anchor={{ x: 0.5, y: 1 }}
              tracksViewChanges={tracksViewChanges}
              onPress={async () => {
                setSelectedIndex(0); // Reset to first tab
                await fetchLocationChargers(marker);
                chargerInfoSheetRef.current?.show();
              }}
            >
              <CustomMarkerView 
                available={marker.available_chargers} 
                total={marker.total_chargers} 
              />
            </Marker>
          ))}
        </MapView>
        
        {/* Loading overlay - only show if map not ready OR there's an actual error */}
        {(!mapReady || mapError) && (
          <View style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(255, 255, 255, 0.95)' 
          }}>
            <ActivityIndicator size="large" color="#C8000D" />
            <Text style={{ marginTop: 10, color: '#666', fontSize: 16, fontWeight: '500' }}>
              {mapError ? 'Map Error' : 'Loading map...'}
            </Text>
            {mapError ? (
              <View style={{ marginTop: 16, paddingHorizontal: 40 }}>
                <Text style={{ color: '#d32f2f', fontSize: 14, textAlign: 'center', marginBottom: 12 }}>
                  {mapError}
                </Text>
                <Text style={{ color: '#666', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
                  Common fixes:{'\n'}
                  1. Go to Google Cloud Console{'\n'}
                  2. Set API key restrictions to "None" (temporarily){'\n'}
                  3. Verify "Maps SDK for Android" is enabled{'\n'}
                  4. Rebuild the app: npm run android
                </Text>
              </View>
            ) : (
              <Text style={{ marginTop: 8, color: '#999', fontSize: 12, textAlign: 'center', paddingHorizontal: 40 }}>
                If the map doesn't load, check:{'\n'}
                • Google Play Services is installed{'\n'}
                • API key restrictions in Google Cloud Console{'\n'}
                • Maps SDK for Android is enabled
              </Text>
            )}
          </View>
        )}

        {/* MAP ACTIONS */}
        <FAB.Group
            open={open}
            visible={true}
            icon={open ? 'calendar-today' : 'plus'}
            color="#C8000D"
            style={styles.fabGroup}
            actions={[
              {
                icon: 'pin',
                label: 'Current Location',
                onPress: () => goToMyLocation(),
              },
              {
                icon: 'refresh',
                label: 'Reload Map',
                onPress: () => handleRefreshMap(),
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />

        <ActionSheet gestureEnabled ref={chargerInfoSheetRef}>
          <Text style={[styles.chargerInfoHEaderSheet, styles.chargerInfoTitle]}>
            {isLoadingChargers ? 'Loading...' : (selectedLocation?.name || 'Location Name')}
          </Text>
          
          {/* Custom Icon Tab Bar */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tabStyle,
                  selectedIndex === index && styles.activeTabStyle
                ]}
                onPress={() => setSelectedIndex(index)}
              >
                <MaterialIcons
                  name={tab.icon}
                  size={24}
                  color={selectedIndex === index ? '#C8000D' : '#999'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {/* CHARGER DETAILS */}
            {selectedIndex === 0 && (
                <View style={styles.chargerInfoSheet}>
                  {isLoadingChargers ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#C8000D" />
                      <Text style={styles.loadingText}>Loading chargers...</Text>
                    </View>
                  ) : chargers.length > 0 ? (
                    <>
                      <View style={styles.chargerHeaderRow}>
                        <Text style={styles.generalInfoTitle}>Available charger ({chargers.length})</Text>
                        <TouchableOpacity onPress={handleRefreshChargers}>
                          <Text style={styles.refreshLink}>Refresh list</Text>
                        </TouchableOpacity>
                      </View>
                      {chargers.map((charger, index) => (
                        <TouchableOpacity
                          key={charger.id || index}
                          activeOpacity={0.7}
                          onPress={() => {
                            // Store charger and location data in Redux
                            dispatch(setSelectedCharger(charger));
                            if (selectedLocation) {
                              dispatch(setSelectedLocationAction(selectedLocation));
                            }
                            
                            // Navigate to charger details
                            navigation.navigate('ChargerScreen');
                          }}
                        >
                          <View style={styles.chargerCard}>
                            <View style={styles.chargerRow}>
                              {/* Left side: Icon + Details */}
                              <View style={styles.chargerLeft}>
                                <View style={styles.chargerIconContainer}>
                                  <MaterialIcons name="ev-station" size={24} color="#666" />
                                </View>
                                <View style={styles.chargerInfo}>
                                  <Text style={styles.chargerType}>
                                    {charger.name?.toLowerCase() || 'ac ev charger'}
                                  </Text>
                                  <Text style={styles.chargerId}>
                                    {charger.serial_number || charger.id || 'N/A'}
                                  </Text>
                                  <View style={styles.chargerSpecs}>
                                    <View style={styles.specBadge}>
                                      <Text style={styles.specText}>
                                        {typeof charger.charger_type === 'object' && charger.charger_type?.current_type 
                                          ? charger.charger_type.current_type 
                                          : 'AC'}
                                      </Text>
                                    </View>
                                    <View style={styles.specBadge}>
                                      <Text style={styles.specText}>
                                        {typeof charger.charger_type === 'object' && charger.charger_type?.power 
                                          ? `${charger.charger_type.power} kW` 
                                          : 'N/A'}
                                      </Text>
                                    </View>
                                    <View style={styles.specBadge}>
                                      <Text style={styles.specText}>
                                        {typeof charger.charger_type === 'object' && charger.charger_type?.socket 
                                          ? charger.charger_type.socket 
                                          : 'Type 2'}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              </View>

                              {/* Right side: Status + Price */}
                              <View style={styles.chargerRight}>
                                <View style={[
                                  styles.statusBadge,
                                  { backgroundColor: charger.status?.toLowerCase() === 'available' ? '#4CAF50' : '#FF9800' }
                                ]}>
                                  <Text style={styles.statusText}>
                                    {charger.status?.toUpperCase() || 'UNKNOWN'}
                                  </Text>
                                </View>
                                <Text style={styles.chargerPrice}>
                                  PHP {charger.tariff?.amount ? parseFloat(String(charger.tariff.amount)).toFixed(2) : '00.00'}/kWh
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  ) : (
                    <Text style={styles.noDataText}>No chargers available at this location</Text>
                  )}
                </View>
              )}
            {/* GENERAL INFORMATION */}
            {selectedIndex === 1 && (
              <View style={styles.chargerInfoSheet}>
                {isLoadingChargers ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#C8000D" />
                    <Text style={styles.loadingText}>Loading location info...</Text>
                  </View>
                ) : selectedLocation ? (
                  <>
                    <Text style={styles.generalInfoTitle}>General Information</Text>
                    <Card style={[styles.locationInfoCard, {marginTop: 0}]} mode='contained'>
                        <List.Item
                          title={selectedLocation.name || 'N/A'}
                          description={selectedLocation.address || 'N/A'}
                          // right={props => <List.Icon {...props} icon="chevron-right" />}
                          style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
                        />
                        <List.Item
                          title="Directions on how to get there"
                          description={selectedLocation.directions || 'parking lot'}
                          // right={props => <List.Icon {...props} icon="chevron-right" />}
                          style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
                        />
                        <List.Item
                          title="Booking options"
                          description={selectedLocation.booking_options || 'Cannot be booked'}
                          // right={props => <List.Icon {...props} icon="chevron-right" />}
                          style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
                        />
                        <List.Item
                          title="Operational Time"
                          right={props => <Text>{selectedLocation.operational_time || 'N/A'}</Text>}
                        />
                    </Card>
                    
                    
                    {/* Contact Information */}
                    <Text style={styles.generalInfoTitle}>Contact information</Text>
                    <Card style={[styles.locationInfoCard, {marginTop: 0}]} mode='contained'>
                        <List.Item
                          title="Contact number"
                          description={selectedLocation.contact_number || ''}
                          // right={props => <List.Icon {...props} icon="chevron-right" />}
                          style={{borderBottomWidth: .7, borderBottomColor: '#ddd'}}
                        />
                        <List.Item
                          title="Contact email"
                          description={selectedLocation.contact_email || 'itsupport@vcygroup.com'}
                          // right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Card>
                  </>
                ) : (
                  <Text style={styles.noDataText}>No location information available</Text>
                )}
              </View>
            )}
            {/* CHARGER IMAGES */}
            {selectedIndex === 2 && (
              <View style={styles.chargerInfoSheet}>
                <Text style={styles.noDataText}>No Images Available</Text>
              </View>
            )}
            {/* COMMENTS */}
            {selectedIndex === 3 && (
              <View style={styles.chargerInfoSheet}>
                <Text style={styles.noDataText}>No Comments Available</Text>
              </View>
            )}
          </ScrollView>
        </ActionSheet>

        {/* Snackbar for reload notification */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
          style={styles.snackbar}
          wrapperStyle={styles.snackbarWrapper}
        >
          Map data reloaded successfully
        </Snackbar>
      </View>
    </PaperProvider>
  );  
}