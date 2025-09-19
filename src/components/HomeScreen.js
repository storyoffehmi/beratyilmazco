import React from 'react';
import { Link } from 'react-router-dom'; // Link bileşenini import ediyoruz
import './HomeScreen.css'; // Stil dosyası için import ekleyelim

const HomeScreen = () => {
  return (
    <div className="home-container">
      <h1>Ana Sayfa</h1>
      <p>Hoş geldiniz! Randevu sistemine başarıyla giriş yaptınız.</p>
      <Link to="/booking" className="button-link">
        <button className="action-button">Yeni Randevu Al</button>
      </Link>
    </div>
  );
};

export default HomeScreen;