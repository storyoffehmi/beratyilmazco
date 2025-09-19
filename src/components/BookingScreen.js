import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingScreen.css';

const BookingScreen = () => {
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(''); // Seçilen saati tutmak için yeni state
  const [availableTimes, setAvailableTimes] = useState([]); // Müsait saatleri tutmak için yeni state
  const navigate = useNavigate();

  // BU FONKSİYON, SEÇİLEN TARİHE GÖRE SAATLERİ GETİRMEYİ SİMÜLE EDİYOR
  const getTimesForDate = (selectedDate) => {
    console.log(`"${selectedDate}" için müsait saatler getiriliyor...`);
    // Gerçek uygulamada bu veri Firebase'den gelecek.
    // Şimdilik, tarihin gününe göre farklı saatler döndürelim.
    const dayOfWeek = new Date(selectedDate).getDay();

    if (dayOfWeek % 2 === 0) { // Eğer gün çift ise (Salı, Perşembe, C.tesi)
      return ["10:00", "11:00", "12:00", "16:00", "20:00"];
    } else { // Eğer gün tek ise (Pazartesi, Çarşamba, Cuma)
      return ["12:00", "13:00", "14:00"];
    }
  };

  // Kullanıcı tarih seçtiğinde bu fonksiyon çalışacak
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setTime(''); // Tarih değiştiğinde saat seçimini sıfırla
    
    // Eğer geçerli bir tarih seçilmişse, o tarihe ait saatleri getir
    if (selectedDate) {
      setAvailableTimes(getTimesForDate(selectedDate));
    } else {
      setAvailableTimes([]); // Tarih seçimi kaldırılırsa saatleri temizle
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!service || !date || !time) { // Saat seçimini de kontrol et
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    const newAppointment = { service, date, time }; // Saati de randevuya ekle
    console.log('Oluşturulan Randevu:', newAppointment);
    
    alert('Randevunuz başarıyla oluşturuldu!');
    navigate('/home');
  };

  return (
    <div className="booking-container">
      <div className="booking-box">
        <h2>Yeni Randevu Oluştur</h2>
        <form onSubmit={handleBookingSubmit}>
          {/* Hizmet Seçimi (Değişiklik yok) */}
          <div className="form-group">
            <label htmlFor="service">Hizmet Seçin:</label>
            <select id="service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="" disabled>-- Lütfen bir hizmet seçin --</option>
              <option value="sac">Saç Kesimi</option>
              <option value="sakal">Sakal Traşı</option>
              <option value="sac-sakal">Saç + Sakal Paketi</option>
            </select>
          </div>
          
          {/* Tarih Seçimi (onChange eklendi) */}
          <div className="form-group">
            <label htmlFor="date">Tarih Seçin:</label>
            <input id="date" type="date" value={date} onChange={handleDateChange} />
          </div>

          {/* Saat Seçimi (Yeni eklendi) */}
          {availableTimes.length > 0 && (
            <div className="form-group">
              <label>Müsait Saatler:</label>
              <div className="time-slots-container">
                {availableTimes.map((availableTime) => (
                  <button 
                    type="button"
                    key={availableTime} 
                    className={`time-slot-button ${time === availableTime ? 'selected' : ''}`}
                    onClick={() => setTime(availableTime)}
                  >
                    {availableTime}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="submit-button">Randevuyu Onayla</button>
        </form>
      </div>
    </div>
  );
};

export default BookingScreen;