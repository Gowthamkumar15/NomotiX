import { createSlice } from "@reduxjs/toolkit";

const garageSlice = createSlice({
  name: "garage",
  initialState: {
    garages: [],
    activeGarageIndex: null,
  },
  reducers: {
    setGarages: (state, action) => {
      state.garages = action.payload;
    },
    setActiveGarage: (state, action) => {
      state.activeGarageIndex = action.payload;
    },
  },
});

export const { setGarages, setActiveGarage } = garageSlice.actions;
export default garageSlice.reducer;