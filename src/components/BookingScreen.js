import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './BookingScreen.css';
import { collection, addDoc, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { auth, db } from '../firebase';

const BookingScreen = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [dateOptions, setDateOptions] = useState([]);
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getNextSixDays = () => {
      const days = [];
      const today = new Date();
      for (let i = 0; i < 6; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const value = currentDate.toISOString().split('T')[0];
        let label = '';
        if (i === 0) { label = 'Bugün'; } 
        else if (i === 1) { label = 'Yarın'; } 
        else {
          const day = String(currentDate.getDate()).padStart(2, '0');
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          label = `${day}.${month}`;
        }
        days.push({ value, label });
      }
      return days;
    };
    setDateOptions(getNextSixDays());
  }, []);

  const handleDateChange = async (selectedDate) => {
    setDate(selectedDate);
    setTime('');
    setAvailableTimes([]);
    if (selectedDate) {
      setLoading(true);
      const slotsDocRef = doc(db, "availableSlots", selectedDate);
      const docSnap = await getDoc(slotsDocRef);
      if (docSnap.exists()) {
        setAvailableTimes(docSnap.data().times.sort());
      }
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!name || !surname || !service || !date || !time) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Randevu alabilmek için giriş yapmış olmalısınız.");
      navigate('/');
      return;
    }
    const appointmentData = {
      name: name,
      surname: surname,
      service: service,
      date: date,
      time: time,
      customerPhoneNumber: currentUser.phoneNumber,
      status: 'booked'
    };
    try {
      setLoading(true);
      await addDoc(collection(db, "appointments"), appointmentData);
      const slotsDocRef = doc(db, "availableSlots", date);
      await updateDoc(slotsDocRef, {
          times: arrayRemove(time)
      });
      setLoading(false);
      navigate('/home', { state: { successMessage: 'Randevunuz başarıyla oluşturuldu!' } });
    } catch (error) {
      setLoading(false);
      console.error("Randevu kaydedilirken hata oluştu: ", error);
      alert("Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="booking-container">
      <div className="page-header-nav">
        <Link to="/home" className="nav-button">Ana Sayfa</Link>
      </div>
      <div className="booking-box">
        <h1 className="booking-logo-main">Berat Yılmaz</h1>
        <form className="booking-form" onSubmit={handleBookingSubmit}>
          <div className="form-group">
            <label htmlFor="name">Ad:</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Soyad:</label>
            <input id="surname" type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Hizmet Seçin:</label>
            <div className="service-button-group">
              <button type="button" className={`service-button ${service === 'sac' ? 'selected' : ''}`} onClick={() => setService('sac')}>
                Saç Kesimi
              </button>
              <button type="button" className={`service-button ${service === 'sakal' ? 'selected' : ''}`} onClick={() => setService('sakal')}>
                Sakal Traşı
              </button>
              <button type="button" className={`service-button ${service === 'sac-sakal' ? 'selected' : ''}`} onClick={() => setService('sac-sakal')}>
                Saç + Sakal
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Tarih Seçin:</label>
            <div className="date-button-group">
              {dateOptions.map((day) => (
                <button
                  type="button"
                  key={day.value}
                  className={`date-button ${date === day.value ? 'selected' : ''}`}
                  onClick={() => handleDateChange(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
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