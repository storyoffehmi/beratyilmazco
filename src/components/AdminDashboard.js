import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Varsayılan olarak bugünün tarihini seçili getirir
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTime, setNewTime] = useState('');
  const [appointments, setAppointments] = useState([]); // Alınan randevuları tutmak için yeni state

  // Bu bölüm, tarih her değiştiğinde o tarihe ait saatleri ve randevuları "getirmeyi" simüle eder
  useEffect(() => {
    console.log(`${selectedDate} için veriler getiriliyor...`);
    
    // --- Bu kısımlar Firebase'e geçtiğimizde veritabanından gelecek ---

    // Sahte Müsait Saatler (Dummy Data):
    if (selectedDate.endsWith('01')) {
      setTimeSlots(['09:00', '11:00', '14:00']);
    } else {
      setTimeSlots(['10:00', '10:30', '11:00', '15:00', '15:30', '16:00']);
    }

    // Sahte Alınmış Randevular (Dummy Data):
    if (selectedDate.endsWith('02')) {
        setAppointments([
            { id: 1, time: '10:00', service: 'Saç Kesimi', customer: 'Ahmet Yılmaz' },
            { id: 2, time: '14:30', service: 'Sakal Traşı', customer: 'Mehmet Kaya' }
        ]);
    } else {
        setAppointments([]); // Başka bir gün için randevu yok olarak varsay
    }

  }, [selectedDate]);

  // Yeni saat ekleme fonksiyonu
  const handleAddTime = (e) => {
    e.preventDefault();
    if (newTime && !timeSlots.includes(newTime)) {
      const updatedSlots = [...timeSlots, newTime].sort(); // Saatleri sıralayarak ekle
      setTimeSlots(updatedSlots);
      // --- Firebase'e yazma işlemi burada olacak ---
      setNewTime(''); // Input'u temizle
    } else {
      alert("Bu saat zaten ekli veya geçersiz.");
    }
  };

  // Saat silme fonksiyonu
  const handleRemoveTime = (timeToRemove) => {
    const updatedSlots = timeSlots.filter(time => time !== timeToRemove);
    setTimeSlots(updatedSlots);
    // --- Firebase'den silme işlemi burada olacak ---
  };

  return (
    <div className="admin-container">
      <div className="admin-box">
        <h2>Admin Paneli</h2>
        <div className="form-group">
          <label htmlFor="date-picker">Tarih Seç:</label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="appointments-view">
            <h4>{selectedDate} Tarihinin Randevuları</h4>
            {appointments.length > 0 ? (
                <ul className="appointments-list">
                    {appointments.map(app => (
                        <li key={app.id}>
                            <span className="time">{app.time}</span>
                            <span className="service">{app.service}</span>
                            <span className="customer">{app.customer}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Bu tarih için alınmış randevu bulunmuyor.</p>
            )}
        </div>
        
        <div className="slots-manager">
          <h4>Müsait Saatleri Yönet</h4>
          <ul className="slots-list">
            {timeSlots.length > 0 ? (
              timeSlots.map(time => (
                <li key={time}>
                  <span>{time}</span>
                  <button onClick={() => handleRemoveTime(time)} className="remove-btn">Sil</button>
                </li>
              ))
            ) : (
              <p>Bu tarih için tanımlanmış müsait saat yok.</p>
            )}
          </ul>
        </div>
        
        <form onSubmit={handleAddTime} className="add-form">
          <h4>Yeni Saat Ekle</h4>
          <div className="add-form-controls">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
            <button type="submit">Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;