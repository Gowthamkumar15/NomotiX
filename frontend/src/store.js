import { configureStore } from "@reduxjs/toolkit";
import garageReducer from "./redux/slices/garageSlice";
import serviceReducer from "./redux/slices/serviceSlice";
import bookingReducer from "./redux/bookingSlice";
export const store = configureStore({
  reducer: {
    garage: garageReducer,
    service: serviceReducer,
    booking: bookingReducer,
  },
});