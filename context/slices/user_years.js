import { createSlice } from '@reduxjs/toolkit'


// Define the initial state using that type
const initialState = {
    currentMonthTrans: [],
    pastMonths: []
}

export const monthsSlice = createSlice({
  name: 'months',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCurrentMonthTrans: (state, action) => {
        state.currentMonthTrans = action.payload;
    },
    setPastMonths: (state, action) => {
      state.pastMonths = action.payload;
    }
  },
})

export const { setCurrentMonthTrans, setPastMonths } = monthsSlice.actions

export default monthsSlice.reducer