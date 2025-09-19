import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import BookingScreen from './components/BookingScreen';
import AdminDashboard from './components/AdminDashboard'; // Yeni bileşeni import et

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/booking" element={<BookingScreen />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Yeni admin rotasını ekle */}
      </Routes>
    </Router>
  );
}

export default App;