import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';

// Stil tanımlamaları
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#808080',
  textAlign: 'center',
  fontFamily: "'Roboto Condensed', sans-serif",
  padding: '20px',
  boxSizing: 'border-box',
  gap: '30px',
};
const logoStyle = {
  fontFamily: "'Great Vibes', cursive",
  fontSize: '56px',
  color: '#000000',
  margin: '0',
  fontWeight: '400',
};
const subtitleStyle = {
  fontSize: '18px',
  fontWeight: '300',
  color: '#000000',
  opacity: '1',
  transition: 'opacity 0.8s ease-in-out',
};
const subtitleFadeOut = { ...subtitleStyle, opacity: '0' };
const buttonGroupStyle = { display: 'flex', gap: '15px' };
const primaryButtonStyle = {
  backgroundColor: '#000000',
  color: '#ffffff',
  border: 'none',
  borderRadius: '50px',
  padding: '16px 32px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  textDecoration: 'none',
  letterSpacing: '1px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
};
const secondaryButtonStyle = { ...primaryButtonStyle, backgroundColor: 'transparent', border: '1px solid #000000', color: '#000000' };
const navContainerStyle = { position: 'absolute', top: '20px', right: '20px', zIndex: 10 };
const navButtonStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#ffffff',
  border: '1px solid #ffffff',
  borderRadius: '20px',
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  textDecoration: 'none',
};

const HomeScreen = () => {
  const [message, setMessage] = useState('Randevu sistemine başarıyla giriş yaptınız.');
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setMessage(location.state.successMessage);
    } else {
      setMessage('Randevu sistemine başarıyla giriş yaptınız.');
    }
    setIsVisible(true);
    const timer = setTimeout(() => { setIsVisible(false); }, 3000);
    return () => clearTimeout(timer);
  }, [location.state]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={navContainerStyle}>
        <button onClick={handleLogout} style={navButtonStyle}>Çıkış Yap</button>
      </div>
      <h1 style={logoStyle}>Berat Yılmaz</h1>
      <p style={isVisible ? subtitleStyle : subtitleFadeOut}>
        {message}
      </p>
      <div style={buttonGroupStyle}>
        <Link to="/booking" style={primaryButtonStyle}>
          YENİ RANDEVU AL
        </Link>
        <Link to="/my-appointments" style={secondaryButtonStyle}>
          RANDEVULARIM
        </Link>
      </div>
    </div>
  );
};

export default HomeScreen;