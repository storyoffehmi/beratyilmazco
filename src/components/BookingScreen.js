import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingScreen.css';
// Firestore'a veri yazmak için gerekli yeni fonksiyonları import ediyoruz
import { collection, addDoc, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
// auth'u o anki kullanıcıyı bulmak için, db'yi ise veritabanı için import ediyoruz
import { auth, db } from '../firebase';

const BookingScreen = () => {
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setTime('');
    setAvailableTimes([]);

    if (selectedDate) {
      setLoading(true);
      const slotsDocRef = doc(db, "availableSlots", selectedDate);
      const docSnap = await getDoc(slotsDocRef);
      if (docSnap.exists()) {
        setAvailableTimes(docSnap.data().times.sort());
      } else {
        console.log("Bu tarih için müsait saat bulunamadı.");
      }
      setLoading(false);
    }
  };

  // Randevu onayı fonksiyonunu Firestore'a kayıt yapacak şekilde güncelliyoruz
  const handleBookingSubmit = async (e) => { // Fonksiyonu async yapıyoruz
    e.preventDefault();
    if (!service || !date || !time) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    // O an giriş yapmış olan kullanıcıyı buluyoruz
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Randevu alabilmek için giriş yapmış olmalısınız. Lütfen tekrar giriş yapın.");
      navigate('/'); // Kullanıcıyı giriş ekranına yönlendir
      return;
    }

    // Firestore'a kaydedilecek randevu verisini hazırlıyoruz
    const appointmentData = {
      service: service,
      date: date,
      time: time,
      customerPhoneNumber: currentUser.phoneNumber, // Müşterinin telefon numarasını ekliyoruz
      status: 'booked' // Randevu durumunu 'alındı' olarak ayarlıyoruz
    };

    try {
      setLoading(true);
      // 1. Yeni randevuyu 'appointments' koleksiyonuna ekliyoruz
      const docRef = await addDoc(collection(db, "appointments"), appointmentData);
      console.log("Randevu başarıyla kaydedildi, ID: ", docRef.id);
      
      // 2. Alınan saati 'availableSlots' koleksiyonundan kaldırıyoruz
      const slotsDocRef = doc(db, "availableSlots", date);
      await updateDoc(slotsDocRef, {
          times: arrayRemove(time)
      });
      
      setLoading(false);
      alert('Randevunuz başarıyla oluşturuldu!');
      navigate('/home'); // Kullanıcıyı ana sayfaya yönlendir
    } catch (error) {
      setLoading(false);
      console.error("Randevu kaydedilirken hata oluştu: ", error);
      alert("Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-box">
        <h2>Yeni Randevu Oluştur</h2>
        <form onSubmit={handleBookingSubmit}>
          {/* ... Diğer form elemanları aynı kalıyor ... */}
          <div className="form-group">
            <label htmlFor="service">Hizmet Seçin:</label>
            <select id="service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="" disabled>-- Lütfen bir hizmet seçin --</option>
              <option value="sac">Saç Kesimi</option>
              <option value="sakal">Sakal Traşı</option>
              <option value="sac-sakal">Saç + Sakal Paketi</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Tarih Seçin:</label>
            <input id="date" type="date" value={date} onChange={handleDateChange} />
          </div>

          <div className="form-group">
            <label>Müsait Saatler:</label>
            {loading ? <p>Müsait saatler yükleniyor...</p> : (
              <div className="time-slots-container">
                {availableTimes.length > 0 ? (
                  availableTimes.map((availableTime) => (
                    <button 
                      type="button"
                      key={availableTime} 
                      className={`time-slot-button ${time === availableTime ? 'selected' : ''}`}
                      onClick={() => setTime(availableTime)}
                    >
                      {availableTime}
                    </button>
                  ))
                ) : (
                  <p>Bu tarih için müsait randevu bulunmamaktadır.</p>
                )}
              </div>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'İşleniyor...' : 'Randevuyu Onayla'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingScreen;