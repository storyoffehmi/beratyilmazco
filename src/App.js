import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import BookingScreen from './components/BookingScreen';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import MyAppointments from './components/MyAppointments';

function App() {
  return (
    <Router>
      <Routes>
        {/* Müşteri Yolları */}
        <Route path="/" element={<AuthScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/booking" element={<BookingScreen />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        
        {/* Admin Yolları */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;