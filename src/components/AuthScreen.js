import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthScreen.css';

const AuthScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(''); // One-Time Password (Tek Kullanımlık Şifre) için state
  const [isCodeSent, setIsCodeSent] = useState(false); // Kodun gönderilip gönderilmediğini tutan state
  const navigate = useNavigate();

  // Telefon numarası girilip kod istendiğinde...
  const handleSendCode = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert('Lütfen geçerli bir telefon numarası girin.');
      return;
    }
    console.log('Bu numaraya doğrulama kodu gönderilecek:', phoneNumber);
    setIsCodeSent(true); // Arayüzü değiştirerek OTP giriş ekranını göster
  };

  // OTP girilip doğrulama istendiğinde...
  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (otp.length < 6) {
        alert('Lütfen 6 haneli kodu girin.');
        return;
    }
    console.log('Girilen doğrulama kodu:', otp);
    // 2. ADIM: Firebase ile kodu doğrulama mantığı buraya eklenecek.
    // Başarılı olursa ana ekrana yönlendirilecek.
    navigate('/home'); 
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Berber Dükkanı Randevu</h2>
        
        {/* isCodeSent false ise telefon numarası formunu göster */}
        {!isCodeSent ? (
          <>
            <p>Giriş yapmak için telefon numaranızı girin.</p>
            <form onSubmit={handleSendCode}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="phone-input"
                placeholder="+90 5XX XXX XX XX"
              />
              <button type="submit" className="submit-button">
                Doğrulama Kodu Gönder
              </button>
            </form>
          </>
        ) : (
          /* isCodeSent true ise OTP formunu göster */
          <>
            <p>{phoneNumber} numarasına gönderilen 6 haneli kodu girin.</p>
            <form onSubmit={handleVerifyCode}>
              <input
                type="text" // Genellikle text veya number kullanılır
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="phone-input"
                placeholder="XXXXXX"
                maxLength="6"
              />
              <button type="submit" className="submit-button">
                Doğrula
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;