import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    selectedServices: {},
    serviceModal: null,
  },
  reducers: {
    toggleServiceSelection: (state, action) => {
      const { garageId, service } = action.payload;
      const existing = state.selectedServices[garageId] || [];

      const isSelected = existing.find(s => s.serviceId === service.serviceId);
      if (isSelected) {
        state.selectedServices[garageId] = existing.filter(s => s.serviceId !== service.serviceId);
      } else {
        state.selectedServices[garageId] = [...existing, service];
      }
    },
    setServiceModal: (state, action) => {
      state.serviceModal = action.payload;
    },
    clearServiceModal: (state) => {
      state.serviceModal = null;
    },
  },
});

export const { toggleServiceSelection, setServiceModal, clearServiceModal } = serviceSlice.actions;
export default serviceSlice.reducer;