import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from '../firebase';
import './MyAppointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const statusTranslations = {
    booked: 'Onay Bekliyor',
    confirmed: 'Onaylandı',
    cancelled: 'İptal Edildi'
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const q = query(collection(db, "appointments"), where("customerPhoneNumber", "==", currentUser.phoneNumber));
        const querySnapshot = await getDocs(q);
        const fetchedAppointments = [];
        querySnapshot.forEach((doc) => {
          fetchedAppointments.push({ id: doc.id, ...doc.data() });
        });
        setAppointments(fetchedAppointments.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } else {
        alert("Randevularınızı görmek için giriş yapmalısınız.");
        navigate('/');
      }
      setLoading(false);
    };
    fetchAppointments();
  }, [navigate]);

  return (
    <div className="my-appointments-container">
      <div className="page-header-nav">
        <Link to="/home" className="nav-button">Ana Sayfa</Link>
      </div>
      <div className="appointments-box">
        <h1 className="appointments-logo-main">Randevularım</h1>
        {loading ? ( <p>Randevularınız yükleniyor...</p> ) : (
          <ul className="appointments-list-user">
            {appointments.length > 0 ? (
              appointments.map(app => (
                <li key={app.id} className={`appointment-item status-${app.status}`}>
                  <p className="date-time">{new Date(app.date).toLocaleDateString('tr-TR')} - {app.time}</p>
                  <p className="service">Hizmet: {app.service}</p>
                  <p className="status">Durum: {statusTranslations[app.status] || app.status}</p>
                </li>
              ))
            ) : ( <p>Henüz bir randevunuz bulunmamaktadır.</p> )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;