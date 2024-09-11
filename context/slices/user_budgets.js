import { createSlice } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState = {
  targets: [],
}

export const targetSlice = createSlice({
  name: 'targets',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setTargets: (state, action) => {
      state.targets = action.payload;
    },
  },
})

export const { setTargets } = targetSlice.actions

export default targetSlice.reducer