import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Button, Card, PaperProvider } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const selectedCharger = useSelector((state) => state.charger?.selectedCharger);
  const selectedLocation = useSelector((state) => state.charger?.selectedLocation);
  const chargeAmountSheetRef = useRef(null);
  const [chargeType, setChargeType] = useState('continuous');
  const [fixTimeMinutes, setFixTimeMinutes] = useState(10);
  const [timeInputText, setTimeInputText] = useState('10');
  
  // Charging session data
  const [chargingPower] = useState(800.00); // in watts
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [energyConsumed] = useState(0.80); // in kWh
  const [currentCost] = useState(0.00); // in PHP
  const [referenceNumber] = useState('CHRG20240924144509');
  
  // Animation values for the charging circle glow
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.8)).current;
  
  // Animation values for the background gradient accent
  const gradientScale = useRef(new Animated.Value(1)).current;
  const gradientOpacity = useRef(new Animated.Value(0.15)).current;
  
  // Store interval and animation refs for cleanup
  const timerIntervalRef = useRef(null);
  const pulseAnimationRef = useRef(null);
  
  // Function to stop timer and animation
  const stopTimerAndAnimation = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (pulseAnimationRef.current) {
      pulseAnimationRef.current.stop();
      pulseAnimationRef.current = null;
    }
  };
  
  // Update time elapsed every second
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => {
      stopTimerAndAnimation();
    };
  }, []);
  
  // Pulsing glow animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1.15,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.4,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(gradientScale, {
            toValue: 1.3,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(gradientOpacity, {
            toValue: 0.25,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(gradientScale, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(gradientOpacity, {
            toValue: 0.15,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    
    pulseAnimationRef.current = pulseAnimation;
    pulseAnimation.start();
    
    return () => {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
        pulseAnimationRef.current = null;
      }
    };
  }, [glowScale, glowOpacity, gradientScale, gradientOpacity]);
  
  // Format time as "0h 0m 24s"
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Fallback if no data
  if (!selectedCharger || !selectedLocation) {
    return (
      <PaperProvider>
        <View style={styles.container}>
          <View style={styles.inboxContainer}>
            <Text style={styles.noDataText}>No charger data available</Text>
          </View>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.inboxContainer}>
          {/* Charging Status Circle */}
          <View style={styles.chargingStatusContainer}>
            {/* Animated gradient background accent */}
            <Animated.View 
              style={[
                styles.gradientBackground,
                {
                  transform: [{ scale: gradientScale }],
                  opacity: gradientOpacity,
                }
              ]} 
            />
            <View style={styles.chargingCircle}>
              <Animated.View 
                style={[
                  styles.chargingCircleGlow,
                  {
                    transform: [{ scale: glowScale }],
                    opacity: glowOpacity,
                  }
                ]} 
              />
              <View style={styles.chargingCircleInner}>
                <Text style={styles.chargingLabel}>Charging</Text>
                <Text style={styles.chargingPower}>{chargingPower.toFixed(2)} W</Text>
              </View>
            </View>
          </View>

          {/* Reference Number Card */}
          <Card style={styles.referenceCard} mode='contained'>
            <View style={styles.referenceCardContent}>
              <Text style={styles.referenceLabel}>Reference number</Text>
              <Text style={styles.referenceValue}>{referenceNumber}</Text>
            </View>
          </Card>

          {/* Charging Metrics Grid */}
          <Card style={styles.metricsCard} mode='contained'>
            <View style={styles.metricsGrid}>
              {/* Top Left - Time Elapsed */}
              <View style={[styles.metricCell, styles.metricCellTopLeft]}>
                <Text style={styles.metricValue}>{formatTime(timeElapsed)}</Text>
                <Text style={styles.metricLabel}>Time elapsed</Text>
              </View>

              {/* Top Right - Energy */}
              <View style={[styles.metricCell, styles.metricCellTopRight]}>
                <Text style={styles.metricValue}>{energyConsumed.toFixed(2)} kWh</Text>
                <Text style={styles.metricLabel}>Energy</Text>
              </View>

              {/* Bottom Left - Charge Options */}
              <View style={[styles.metricCell, styles.metricCellBottomLeft]}>
                <Text style={styles.metricValue}>Continuous</Text>
                <Text style={styles.metricLabel}>Charge options</Text>
              </View>

              {/* Bottom Right - Current Cost */}
              <View style={[styles.metricCell, styles.metricCellBottomRight]}>
                <Text style={styles.metricValue}>PHP {currentCost.toFixed(2)}</Text>
                <Text style={styles.metricLabel}>Current Cost</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.activityCard} mode='contained'>
              <Button 
                  mode="contained" 
                  style={styles.checkAgainLater}
                  labelStyle={styles.checkAgainLaterLabel}
                  onPress={() => {
                    stopTimerAndAnimation();
                    navigation.navigate('main', {
                      screen: 'NavigatorSessions',
                      params: {
                        screen: 'SessionsScreen'
                      }
                    });
                  }}
              >
                  Check again later
              </Button>

              <Button 
                  mode="contained" 
                  style={styles.stopChargingButton}
                  labelStyle={styles.stopChargingButtonLabel}
                  onPress={() => {
                    stopTimerAndAnimation();
                    navigation.navigate('main', {
                      screen: 'NavigatorSessions',
                      params: {
                        screen: 'SessionsScreen'
                      }
                    });
                  }}
              >
                  Stop charging
              </Button>
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
                  setChargeType('continuous');
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
                  setChargeType('fix-time');
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
                        setFixTimeMinutes(newValue);
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
                            setFixTimeMinutes(num);
                          }
                        }
                      }}
                      onBlur={() => {
                        // Ensure value is valid when user finishes editing
                        const num = parseInt(timeInputText, 10);
                        if (isNaN(num) || num < 1) {
                          setTimeInputText('10');
                          setFixTimeMinutes(10);
                        } else {
                          setTimeInputText(num.toString());
                          setFixTimeMinutes(num);
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
                        setFixTimeMinutes(newValue);
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
    flex: 1,
  },
  inboxContainer: {
    backgroundColor: '#F4F5F8',
    marginTop: 0,
    marginHorizontal: 0,
    flex: 1,
    position: 'relative',
    paddingTop: 40,
  },
  chargingStatusContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#C8000D',
    top: -60,
    zIndex: 0,
  },
  checkAgainLater: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 0,
    marginHorizontal: 16,
    marginTop: 10,
  },
  checkAgainLaterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#505050',
  },
  stopChargingButton: {
    backgroundColor: '#F56C6C',
    borderRadius: 25,
    paddingVertical: 0,
    marginHorizontal: 16,
    marginTop: 10,
  },
  stopChargingButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  activityCard: {
    backgroundColor: '#C8000D',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  chargingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    shadowColor: '#C8000D',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  chargingCircleGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: '#C8000D',
    opacity: 0.8,
  },
  chargingCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chargingLabel: {
    fontSize: 16,
    color: '#C8000D',
    fontWeight: '500',
    marginBottom: 8,
  },
  chargingPower: {
    fontSize: 28,
    color: '#C8000D',
    fontWeight: 'bold',
  },
  referenceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 70,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  referenceCardContent: {
    padding: 16,
  },
  referenceLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  referenceValue: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  metricsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  metricCell: {
    width: '50%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
  metricCellTopLeft: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  metricCellTopRight: {
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  metricCellBottomLeft: {
    borderRightWidth: 1,
    borderColor: '#f0f0f0',
  },
  metricCellBottomRight: {
    // No borders for bottom right
  },
  metricValue: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#999',
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
