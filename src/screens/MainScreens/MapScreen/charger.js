import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Appbar, Button, Card, PaperProvider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setChargeType, setFixTimeMinutes } from '../../../redux/reducer/Charger/index.js';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedCharger = useSelector((state) => state.charger?.selectedCharger);
  const selectedLocation = useSelector((state) => state.charger?.selectedLocation);
  const chargeType = useSelector((state) => state.charger?.chargeType || 'continuous');
  const fixTimeMinutes = useSelector((state) => state.charger?.fixTimeMinutes || 10);
  const chargeAmountSheetRef = useRef(null);
  const [timeInputText, setTimeInputText] = useState(fixTimeMinutes.toString());

  // Sync timeInputText with Redux state
  useEffect(() => {
    setTimeInputText(fixTimeMinutes.toString());
  }, [fixTimeMinutes]);

  // Fallback if no data
  if (!selectedCharger || !selectedLocation) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <Appbar.Header style={styles.appbar}>
            <Appbar.BackAction onPress={() => navigation.goBack()} color="#C8000D" />
            <Appbar.Content title="Charger Details" color="#C8000D"/>
          </Appbar.Header>
          <View style={styles.inboxContainer}>
            <Text style={styles.noDataText}>No charger data available</Text>
          </View>
        </View>
      </PaperProvider>
    );
  }

  // Extract charger data
  const chargerName = selectedCharger.name || 'AC EV Charger';
  const chargerStatus = selectedCharger.status || 'Unknown';
  const connectionType = selectedCharger.charger_type?.socket || 'Type 2';
  const powerOutput = selectedCharger.charger_type?.power 
    ? `${selectedCharger.charger_type.power} kW-${selectedCharger.charger_type.current_type || 'AC'}`
    : '7.00 kW-AC';
  const locationName = selectedLocation.name || 'Unknown Location';
  const locationAddress = selectedLocation.address || 'N/A';

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} color="#C8000D" />
          <Appbar.Content title="Charger Details" color="#C8000D"/>
          <Appbar.Action icon="refresh" onPress={() => {}} color="#C8000D" />
        </Appbar.Header>

        <View style={styles.inboxContainer}>
        <Text style={styles.chargerLabelHeader}>{chargerName}</Text>
        <Text style={styles.chargerLabelDescription}>{chargerStatus}</Text>
        <Card style={styles.activityCard} mode='contained'>
            <Text style={styles.locationLabelHeader}>{locationName}</Text>
            <Text style={styles.locationLabelDescription}>{locationAddress}</Text>

            <Card style={styles.chargeDetailCard} mode='contained'>
                {/* Connection type & power */}
                <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                        <Text style={styles.detailLabel}>Connection type & power</Text>
                        <Text style={styles.detailValue}>{connectionType}</Text>
                    </View>
                    <View style={styles.detailRight}>
                        <Text style={styles.detailPowerValue}>{powerOutput}</Text>
                    </View>
                </View>

                {/* Car to charge */}
                <View style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                        <Text style={styles.detailLabel}>Car to charge</Text>
                        <Text style={styles.detailValue}>No car selected</Text>
                    </View>
                    <View style={styles.detailRight}>
                        <Image 
                            source={require('../../../assets/images/cars/model/default.png')} 
                            style={styles.carImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Charge amount */}
                <TouchableOpacity 
                    style={styles.detailRow}
                    activeOpacity={0.7}
                    onPress={() => chargeAmountSheetRef.current?.show()}
                >
                    <View style={styles.detailLeft}>
                        <Text style={styles.detailLabel}>Charge amount</Text>
                        <Text style={styles.detailValue}>
                            {chargeType === 'continuous' 
                              ? 'Continuous charging' 
                              : `Fix time (${fixTimeMinutes} min)`}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Warning section */}
                <View style={styles.warningSection}>
                    <Text style={styles.warningTitle}>Charger will automatically stop when:</Text>
                    <Text style={styles.warningText}>- the limited time is set and reached</Text>
                    <Text style={styles.warningText}>- wallet is zero</Text>
                    <Text style={styles.warningText}>- car is full charged</Text>
                </View>

                {/* Next button */}
                <Button 
                    mode="contained" 
                    style={styles.nextButton}
                    labelStyle={styles.nextButtonLabel}
                    onPress={() => {
                        navigation.navigate('ChargerCheckoutScreen');
                    }}
                >
                    Next
                </Button>
            </Card>
        </Card>
        </View>

        {/* Charge Amount Selection Sheet */}
        <ActionSheet gestureEnabled ref={chargeAmountSheetRef}>
          <View style={styles.sheetContainer}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Charge amount</Text>
              <TouchableOpacity 
                onPress={() => chargeAmountSheetRef.current?.hide()}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.sheetDivider} />

            {/* Options */}
            <View style={styles.sheetContent}>
              {/* Continuous charging option */}
              <TouchableOpacity
                style={styles.optionContainer}
                activeOpacity={0.7}
                onPress={() => {
                  dispatch(setChargeType('continuous'));
                }}
              >
                <Text style={styles.optionText}>Continuous charging</Text>
                <View style={styles.radioButtonContainer}>
                  <View style={[
                    styles.radioButton,
                    chargeType === 'continuous' && styles.radioButtonSelected
                  ]}>
                    {chargeType === 'continuous' && <View style={styles.radioButtonInner} />}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Fix time option */}
              <TouchableOpacity
                style={styles.optionContainer}
                activeOpacity={0.7}
                onPress={() => {
                  dispatch(setChargeType('fix-time'));
                }}
              >
                <Text style={styles.optionText}>Fix time</Text>
                <View style={styles.radioButtonContainer}>
                  <View style={[
                    styles.radioButton,
                    chargeType === 'fix-time' && styles.radioButtonSelected
                  ]}>
                    {chargeType === 'fix-time' && <View style={styles.radioButtonInner} />}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Time input for Fix time */}
              {chargeType === 'fix-time' && (
                <View style={styles.timeInputContainer}>
                  <Text style={styles.timeInputLabel}>Set time in min.</Text>
                  <View style={styles.numberInputContainer}>
                    <TouchableOpacity
                      style={styles.numberButton}
                      activeOpacity={0.7}
                      onPress={() => {
                        const newValue = Math.max(1, fixTimeMinutes - 1);
                        dispatch(setFixTimeMinutes(newValue));
                        setTimeInputText(newValue.toString());
                      }}
                    >
                      <Text style={styles.numberButtonText}>−</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.numberInput}
                      value={timeInputText}
                      onChangeText={(text) => {
                        // Remove any non-numeric characters
                        const cleanedText = text.replace(/[^0-9]/g, '');
                        setTimeInputText(cleanedText);
                        
                        if (cleanedText !== '') {
                          const num = parseInt(cleanedText, 10);
                          if (!isNaN(num) && num >= 1) {
                            dispatch(setFixTimeMinutes(num));
                          }
                        }
                      }}
                      onBlur={() => {
                        // Ensure value is valid when user finishes editing
                        const num = parseInt(timeInputText, 10);
                        if (isNaN(num) || num < 1) {
                          setTimeInputText('10');
                          dispatch(setFixTimeMinutes(10));
                        } else {
                          setTimeInputText(num.toString());
                          dispatch(setFixTimeMinutes(num));
                        }
                      }}
                      onFocus={() => {
                        // Select all text when focused for easy replacement
                        setTimeInputText(fixTimeMinutes.toString());
                      }}
                      keyboardType="numeric"
                      selectTextOnFocus
                      textAlign="center"
                    />
                    <TouchableOpacity
                      style={styles.numberButton}
                      activeOpacity={0.7}
                      onPress={() => {
                        const newValue = fixTimeMinutes + 1;
                        dispatch(setFixTimeMinutes(newValue));
                        setTimeInputText(newValue.toString());
                      }}
                    >
                      <Text style={styles.numberButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ActionSheet>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inboxContainer: {
    backgroundColor: '#fff',
    marginTop: 0,
    marginHorizontal: 0
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  locationLabelHeader: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  locationLabelDescription: {
    fontSize: 14,
    color: '#efefef',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  chargerLabelHeader: {
    fontSize: 18,
    color: '#505050',
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  chargerLabelDescription: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  activityCard: {
    backgroundColor: '#C8000D',
    marginTop: 20,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: SCREEN_HEIGHT - 185, // Screen height minus appbar (~56) and marginTop (50)
  },
  chargeDetailCard: {
    backgroundColor: '#fff',
    marginTop: 50,
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: SCREEN_HEIGHT - 185, // Screen height minus appbar (~56) and marginTop (50)
  },
  detailRow: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
  detailPowerValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  carImage: {
    width: 80,
    height: 50,
  },
  warningSection: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#F57C00',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#C8000D',
    borderRadius: 25,
    paddingVertical: 0,
  },
  nextButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  appbar: {
    backgroundColor: '#fff',
    color: '#C8000D'
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
  sheetContainer: {
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#C8000D',
    lineHeight: 28,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  radioButtonContainer: {
    marginLeft: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2196F3',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeInputLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  numberButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  numberButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '300',
    lineHeight: 28,
  },
  numberInput: {
    minWidth: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 12,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
