import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Assume basic CSS for styling

const API_URL = "http://localhost:3001";

function App() {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  
  // Form State
  const [partnerId, setPartnerId] = useState("User-" + Math.floor(Math.random() * 1000));
  const [seatsToBook, setSeatsToBook] = useState(1);

  // Poll for event data every 2 seconds to simulate "Real Time"
  useEffect(() => {
    fetchEventData();
    const interval = setInterval(fetchEventData, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchEventData = async () => {
    try {
      const res = await axios.get(`${API_URL}/reservations`);
      setEventData(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(`${API_URL}/reservations`, {
        partnerId,
        seats: parseInt(seatsToBook)
      });
      
      // Add to local list of "My Reservations"
      const newRes = { ...res.data, partnerId, seats: parseInt(seatsToBook) };
      setMyReservations([newRes, ...myReservations]);
      setMessage({ type: 'success', text: 'Booking Confirmed!' });
      fetchEventData(); // Update immediately
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Booking Failed";
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`${API_URL}/reservations/${id}`);
      setMyReservations(myReservations.filter(r => r.reservationId !== id));
      setMessage({ type: 'info', text: 'Reservation Cancelled' });
      fetchEventData();
    } catch (err) {
      alert("Failed to cancel");
    }
  };

  if (!eventData) return <div className="loading">Loading TicketBoss...</div>;

  // Calculate percentage for progress bar
  const percentFull = ((eventData.totalSeats - eventData.availableSeats) / eventData.totalSeats) * 100;

  return (
    <div className="container">
      <header>
        <h1 className='header1'>🎫 TICKETBOSS  🚍</h1>
        <span className="live-badge">● LIVE</span>
      </header>

      <div className="stats-card">
        <h2>{eventData.name}</h2>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${percentFull}%` }}></div>
        </div>
        <div className="stats-row">
          <div className="stat">
            <strong>{eventData.availableSeats}</strong>
            <small>Seats Left</small>
          </div>
          <div className="stat">
            <strong>{eventData.totalSeats}</strong>
            <small>Total Capacity</small>
          </div>
          <div className="stat">
            <strong>{eventData.reservationCount}</strong>
            <small>Total Bookings</small>
          </div>
        </div>
      </div>

      <div className="action-area">
        <div className="card booking-form">
          <h3>Book Your Spot</h3>
          <form onSubmit={handleBook}>
            <div className="input-group">
              <label>Partner ID</label>
              <input 
                type="text" 
                value={partnerId} 
                onChange={(e) => setPartnerId(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Seats (Max 10)</label>
              <input 
                type="number" 
                min="1" max="10" 
                value={seatsToBook} 
                onChange={(e) => setSeatsToBook(e.target.value)} 
              />
            </div>
            <button type="submit" disabled={loading || eventData.availableSeats === 0}>
              {loading ? "Booking..." : "Reserve Now"}
            </button>
          </form>
          {message && <div className={`message ${message.type}`}>{message.text}</div>}
        </div>

        <div className="card my-reservations">
          <h3>Your Reservations</h3>
          {myReservations.length === 0 ? (
            <p className="empty-state">No active reservations.</p>
          ) : (
            <ul>
              {myReservations.map(res => (
                <li key={res.reservationId}>
                  <span><strong>{res.seats} Seats</strong> (ID: {res.reservationId.slice(0,6)}...)</span>
                  <button className="cancel-btn" onClick={() => handleCancel(res.reservationId)}>Cancel</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;