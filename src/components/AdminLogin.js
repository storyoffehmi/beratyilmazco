import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import './AuthScreen.css';

const AdminLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  // DÜZELTME: useEffect'e bir "cleanup" fonksiyonu ekleyerek
  // React'in StrictMode'u ile uyumlu hale getiriyoruz.
  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });
    
    // verifier'ı daha sonra kullanabilmek için window nesnesine atıyoruz.
    window.recaptchaVerifier = verifier;

    // Temizleme Fonksiyonu: Bileşen ekrandan kaldırıldığında veya
    // yeniden çalıştırılmadan önce bu fonksiyon çağrılır.
    return () => {
      verifier.clear();
    };
  }, []); // Bu hala sadece bir kez çalışması için boş bırakılır.

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 12) {
      alert('Lütfen telefon numaranızı +905551234567 formatında girin.');
      return;
    }
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsCodeSent(true);
    } catch (error) {
      console.error("SMS gönderme hatası:", error);
      alert("SMS gönderilemedi. Lütfen sayfayı yenileyip tekrar deneyin veya konsoldeki hatayı kontrol edin.");
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
        <h2>Admin Paneli Girişi</h2>
        {!isCodeSent ? (
          <form onSubmit={handleSendCode}>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-input"
              placeholder="+905551234567"
            />
            <button type="submit" className="submit-button">Doğrulama Kodu Gönder</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="phone-input"
              placeholder="XXXXXX"
              maxLength="6"
            />
            <button type="submit" className="submit-button">Doğrula ve Giriş Yap</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;