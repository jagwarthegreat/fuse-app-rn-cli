import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userData: null,
  accessToken: null,
  checkoutUrl: null,
  walletVisible: false,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    },
    setCheckoutUrl: (state, action) => {
      state.checkoutUrl = action.payload
    },
    setWalletVisible: (state, action) => {
      state.walletVisible = action.payload
    },
  },
})

export const { 
  setUserData,
  setAccessToken,
  setCheckoutUrl,
  setWalletVisible,
} = slice.actions

export default slice.reducer