import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateOptions, setDateOptions] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTime, setNewTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSlotsAndAppointments = useCallback(async () => {
    if (!selectedDate) return;
    setLoading(true);
    
    const slotsDocRef = doc(db, "availableSlots", selectedDate);
    const slotsDocSnap = await getDoc(slotsDocRef);
    setTimeSlots(slotsDocSnap.exists() ? slotsDocSnap.data().times.sort() : []);

    const q = query(collection(db, "appointments"), where("date", "==", selectedDate));
    const querySnapshot = await getDocs(q);
    const fetchedAppointments = [];
    querySnapshot.forEach((doc) => {
      fetchedAppointments.push({ id: doc.id, ...doc.data() });
    });
    setAppointments(fetchedAppointments.sort((a, b) => a.time.localeCompare(b.time)));
    
    setLoading(false);
  }, [selectedDate]);

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

  useEffect(() => {
    fetchSlotsAndAppointments();
  }, [fetchSlotsAndAppointments]);

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
      fetchSlotsAndAppointments();
      setNewTime('');
    }
  };

  const handleRemoveTime = async (timeToRemove) => {
    const slotsDocRef = doc(db, "availableSlots", selectedDate);
    await updateDoc(slotsDocRef, { times: arrayRemove(timeToRemove) });
    fetchSlotsAndAppointments();
  };

  const handleConfirmAppointment = async (appId) => {
    const appointmentRef = doc(db, "appointments", appId);
    await updateDoc(appointmentRef, { status: 'confirmed' });
    fetchSlotsAndAppointments();
  };

  const handleCancelAppointment = async (appId, date, time) => {
    const appointmentRef = doc(db, "appointments", appId);
    await updateDoc(appointmentRef, { status: 'cancelled' });
    const slotsDocRef = doc(db, "availableSlots", date);
    await updateDoc(slotsDocRef, { times: arrayUnion(time) });
    fetchSlotsAndAppointments();
  };

  const handleDeleteAppointment = async (appId, date, time) => {
    if (window.confirm("Bu randevuyu tamamen silmek istediğinizden emin misiniz?")) {
      await deleteDoc(doc(db, "appointments", appId));
      const slotsDocRef = doc(db, "availableSlots", date);
      await updateDoc(slotsDocRef, { times: arrayUnion(time) });
      fetchSlotsAndAppointments();
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin-login');
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
  };

  return (
    <div className="admin-container">
      <div className="page-header-nav">
        <button onClick={handleLogout} className="nav-button">Çıkış Yap</button>
      </div>
      <div className="admin-box">
        {/* ... JSX içeriği aynı ... */}
      </div>
    </div>
  );
};

export default AdminDashboard;