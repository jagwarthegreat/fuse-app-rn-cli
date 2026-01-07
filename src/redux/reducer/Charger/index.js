import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedCharger: null,
  selectedLocation: null,
  chargeType: 'continuous', // 'continuous' | 'fix-time'
  fixTimeMinutes: 10,
  chargingPrice: 15.00, // Price per kWh
  reserveAmount: 0,
  selectedCar: null,
}

const slice = createSlice({
  name: 'charger',
  initialState,
  reducers: {
    setSelectedCharger: (state, action) => {
      state.selectedCharger = action.payload
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload
    },
    setChargeType: (state, action) => {
      state.chargeType = action.payload
    },
    setFixTimeMinutes: (state, action) => {
      state.fixTimeMinutes = action.payload
    },
    setChargingPrice: (state, action) => {
      state.chargingPrice = action.payload
    },
    setReserveAmount: (state, action) => {
      state.reserveAmount = action.payload
    },
    setSelectedCar: (state, action) => {
      state.selectedCar = action.payload
    },
    clearChargerSelection: (state) => {
      state.selectedCharger = null
      state.selectedLocation = null
      state.chargeType = 'continuous'
      state.fixTimeMinutes = 10
      state.reserveAmount = 0
      state.selectedCar = null
    },
  },
})

export const { 
  setSelectedCharger,
  setSelectedLocation,
  setChargeType,
  setFixTimeMinutes,
  setChargingPrice,
  setReserveAmount,
  setSelectedCar,
  clearChargerSelection,
} = slice.actions

export default slice.reducer
