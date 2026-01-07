import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  onBoarding: true,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOnBoarding: (state, action) => {
      state.onBoarding = action.payload
    },
  },
})

export const { 
  setOnBoarding,
} = slice.actions

export default slice.reducer