import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import './AuthScreen.css'; // Müşteri ekranıyla aynı stili kullanabilir

const AdminLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });
    window.recaptchaVerifier = verifier;
    return () => {
      verifier.clear();
    };
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      alert('Lütfen telefon numaranızı 10 haneli olarak (5XX XXX XX XX) girin.');
      return;
    }
    const formattedPhoneNumber = `+90${phoneNumber}`;
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsCodeSent(true);
      alert('Doğrulama kodu telefonunuza gönderildi!');
    } catch (error) {
      console.error("SMS gönderme hatası:", error);
      alert("SMS gönderilemedi. Lütfen sayfayı yenileyip tekrar deneyin.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      alert('Lütfen 6 haneli kodu girin.');
      return;
    }
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      const adminDocRef = doc(db, "admins", user.phoneNumber);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        navigate('/admin');
      } else {
        alert("Bu telefon numarası admin olarak yetkilendirilmemiştir.");
      }
    } catch (error) {
      console.error("Kod doğrulama hatası:", error);
      alert("Kod hatalı veya geçersiz. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="auth-container">
      <div id="recaptcha-container"></div>
      <div className="auth-box">
        <div className="logo-container">
          <h1 className="logo-main">Berat Yılmaz</h1>
          <p className="logo-subtitle">Hair Studio</p>
        </div>

        {!isCodeSent ? (
          <form className="auth-form" onSubmit={handleSendCode}>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-input"
              placeholder="5XX XXX XX XX"
              maxLength="10"
            />
            <p className="helper-text">Lütfen admin telefon numaranızı giriniz.</p>
            <button type="submit" className="submit-button">
              KOD GÖNDER
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyCode}>
             <p className="helper-text">{`+90${phoneNumber}`} numarasına gönderilen 6 haneli kodu girin.</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="phone-input"
              placeholder="XXXXXX"
              maxLength="6"
            />
            <button type="submit" className="submit-button" style={{ marginTop: '15px' }}>
              GİRİŞ YAP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;