import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../firebase';

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTime, setNewTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlotsAndAppointments = async () => {
      setLoading(true);
      
      const slotsDocRef = doc(db, "availableSlots", selectedDate);
      const slotsDocSnap = await getDoc(slotsDocRef);
      if (slotsDocSnap.exists()) {
        setTimeSlots(slotsDocSnap.data().times.sort());
      } else {
        setTimeSlots([]);
      }
      
      const q = query(collection(db, "appointments"), where("date", "==", selectedDate));
      const querySnapshot = await getDocs(q);
      const fetchedAppointments = [];
      querySnapshot.forEach((doc) => {
        fetchedAppointments.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(fetchedAppointments.sort((a, b) => a.time.localeCompare(b.time)));

      setLoading(false);
    };

    if (selectedDate) {
      fetchSlotsAndAppointments();
    }
  }, [selectedDate]);

  const handleAddTime = async (e) => {
    e.preventDefault();
    if (newTime && !timeSlots.includes(newTime)) {
      const slotsDocRef = doc(db, "availableSlots", selectedDate);
      try {
        await updateDoc(slotsDocRef, { times: arrayUnion(newTime) });
      } catch (error) {
        if (error.code === 'not-found') {
          await setDoc(slotsDocRef, { times: [newTime] });
        } else { console.error("Hata:", error); }
      }
      setTimeSlots(prev => [...prev, newTime].sort());
      setNewTime('');
    }
  };

  const handleRemoveTime = async (timeToRemove) => {
    const slotsDocRef = doc(db, "availableSlots", selectedDate);
    await updateDoc(slotsDocRef, { times: arrayRemove(timeToRemove) });
    setTimeSlots(prev => prev.filter(time => time !== timeToRemove));
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
            {loading ? <p>Yükleniyor...</p> : (
              appointments.length > 0 ? (
                  <ul className="appointments-list">
                      {appointments.map(app => (
                          <li key={app.id}>
                              <span className="time">{app.time}</span>
                              <span className="service">{app.service}</span>
                              <span className="customer">{app.customerPhoneNumber}</span>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p>Bu tarih için alınmış randevu bulunmuyor.</p>
              )
            )}
        </div>
        
        <div className="slots-manager">
          <h4>Müsait Saatleri Yönet</h4>
          {loading ? <p>Yükleniyor...</p> : (
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
          )}
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