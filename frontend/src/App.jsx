import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConfirmBooking from "./components/Services/ConfirmBooking";
import Breakdown from "./components/Breakdown/Breakdown";
import Navbar from "./components/Navbar";
import ServicesSelection from "./components/Services/ServicesSelection";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import RequestBroadcast from "./components/Breakdown/requestBroadcast";
import MyBookings from "./components/myBookings";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import AddCar from "./components/UserDashboard/addCar";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><ServicesSelection /></ProtectedRoute>} />
        <Route path="/breakdown" element={<ProtectedRoute><Breakdown /></ProtectedRoute>} />
        <Route path="/confirmBooking" element={<ProtectedRoute><ConfirmBooking /></ProtectedRoute>} />
        <Route path="/addCar" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
        <Route path="/mybookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/requestBroadcast" element={<ProtectedRoute><RequestBroadcast /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
