import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ServiceSearch from "./pages/ServiceSearch";
import Chatbot from "./pages/Chatbot";
import Recommendations from "./pages/Recommendations";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
import ReviewSubmit from "./pages/ReviewSubmit";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

import DashboardLayout from "./components/DashboardLayout";

const App = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <ServiceSearch />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <Chatbot />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <Recommendations />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:providerId"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <Booking />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <BookingHistory />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/review/:bookingId"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <ReviewSubmit />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["provider"]}>
                <ProviderDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </DashboardLayout>
  );
};

export default App;