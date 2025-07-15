import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  garage: null,
  services: [],
  customer: null,
  bookingTime: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingDetails: (state, action) => {
      const { garage, services, customer, bookingTime } = action.payload;
      state.garage = garage;
      state.services = services;
      state.customer = customer;
      state.bookingTime = bookingTime;
    },
    resetBooking: () => initialState,
  },
});

export const { setBookingDetails, resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
export const selectBookingDetails = (state) => ({
  garage: state.booking.garage,
  service: state.booking.service,
  customer: state.booking.customer,
  bookingTime: state.booking.bookingTime,
});
export const selectBookingGarage = (state) => state.booking.garage;
export const selectBookingService = (state) => state.booking.service;
export const selectBookingCustomer = (state) => state.booking.customer;
export const selectBookingTime = (state) => state.booking.bookingTime;
export const selectBookingDetailsForConfirmation = (state) => {
  const { garage, service, customer, bookingTime } = state.booking;
  return {
    garage: garage ? garage.name : "N/A",
    service: service ? service.name : "N/A",
    customer: customer ? customer.name : "N/A",
    bookingTime: bookingTime ? new Date(bookingTime).toLocaleString() : "N/A",
  };
}   ;