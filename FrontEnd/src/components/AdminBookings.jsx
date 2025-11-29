import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import './Admin.css'
import { getAdminAuthHeader } from '../utils/adminAuth';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchBookings = async (p = 1) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/bookings?admin=true&page=${p}&limit=${limit}`, { headers: getAdminAuthHeader() });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        if (data.total !== undefined) setTotal(data.total);
      } else alert(data.error || 'Failed to fetch bookings');
    } catch (err) {
      alert('Network error');
    }
  };

  useEffect(() => { fetchBookings(1); }, []);

  const updateStatus = async (id, status) => {
    const res = await fetch(`http://localhost:5000/admin/bookings/${id}?admin=true`, {
      method: 'PUT', headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (res.ok) fetchBookings(page); else alert(data.error || 'Failed to update');
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2>Manage Bookings</h2>
      </div>

      <table className="admin-table">
        <thead><tr><th>Brand</th><th>Model</th><th>Start</th><th>Days</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.brandName} ({b.brandEmail})</td>
              <td>{b.modelId?.username || b.modelId}</td>
              <td>{new Date(b.startDate).toLocaleDateString()}</td>
              <td>{b.days}</td>
              <td>{b.status}</td>
              <td className="admin-actions">
                <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}>
                  <option value="pending">pending</option>
                  <option value="accepted">accepted</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12 }}>
        <button className="btn-ghost" onClick={() => { if (page > 1) { const np = page - 1; setPage(np); fetchBookings(np); } }} disabled={page <= 1}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
        <button className="btn-ghost" onClick={() => { if (page < Math.ceil(total / limit)) { const np = page + 1; setPage(np); fetchBookings(np); } }} disabled={page >= Math.ceil(total / limit)}>Next</button>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
