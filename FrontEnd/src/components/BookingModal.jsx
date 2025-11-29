import React, { useState, useMemo } from 'react';
import './BookingModal.css';

const BookingModal = ({ model, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState(1);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const perDay = model?.pricePerDay || 0;

  const totalPrice = useMemo(() => {
    const d = Number(days) || 0;
    return (Number(perDay) * d).toFixed(2);
  }, [perDay, days]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!startDate) {
      setError('Please choose a start date');
      return;
    }
    if (!name || !email) {
      setError('Please provide your name and email');
      return;
    }

    const payload = {
      modelId: model._id,
      brandName: name,
      brandEmail: email,
      contact: '',
      startDate,
      days: Number(days) || 1,
      message
    };

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Optionally call parent's onSubmit
        if (onSubmit) onSubmit(data.booking);
        alert(`Booking created. Total: ${data.booking.totalPrice}`);
        onClose();
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-overlay">
      <div className="booking-modal">
        <button className="booking-close" onClick={onClose} aria-label="Close">×</button>
        <h2>Book {model.username}</h2>

        <form onSubmit={handleSubmit} className="booking-form">
          <label>
            Brand name
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </label>

          <label>
            Your email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>

          <label>
            Start date
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </label>

          <label>
            Number of days
            <input type="number" min="1" value={days} onChange={e => setDays(e.target.value)} required />
          </label>

          <p><strong>Price per day:</strong> {perDay}</p>
          <p><strong>Estimated total:</strong> {totalPrice}</p>

          <label>
            Message
            <textarea value={message} onChange={e => setMessage(e.target.value)} />
          </label>

          {error && <p className="booking-error">{error}</p>}

          <div className="booking-actions">
            <button type="button" className="booking-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="booking-submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send booking request'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
