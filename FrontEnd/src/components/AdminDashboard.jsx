import React, { useEffect, useState } from 'react';
import './Admin.css'
import AdminLayout from './AdminLayout'
import AdminLogin from './AdminLogin'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin token exists
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchStats(token);
    }
  }, []);

  const fetchStats = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401 || res.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        setIsAuthenticated(false);
        setError('Admin session expired. Please login again.');
        return;
      }
      
      const data = await res.json();
      if (res.ok) setStats(data.data);
      else setError(data.error || 'Failed to load stats');
    } catch (err) {
      setError('Failed to fetch stats');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setIsAuthenticated(false);
    setStats(null);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {
      setIsAuthenticated(true);
      const token = localStorage.getItem('adminToken');
      fetchStats(token);
    }} />;
  }

  if (error) return <div className="admin-panel">Error: {error}</div>;
  if (!stats) return <div className="admin-panel">Loading dashboard...</div>;

  return (
    <AdminLayout onLogout={handleLogout}>
      <div>
        <div className="admin-header">
          <h2>Dashboard</h2>
          <div>
            <button className="btn-ghost" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat">
            <div className="stat-number">{stats.totalBrands ?? 0}</div>
            <div className="stat-label">Brands</div>
          </div>
          <div className="stat">
            <div className="stat-number">{stats.totalModels ?? 0}</div>
            <div className="stat-label">Models</div>
          </div>
          <div className="stat">
            <div className="stat-number">{stats.totalBookings ?? 0}</div>
            <div className="stat-label">Bookings</div>
          </div>
        </div>

        <section>
          <h3>Recent Signups</h3>
          <ul>
            {stats.recentSignups.map(u => (
              <li key={u._id}>{u.username} ({u.email}) - {u.type}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: 12 }}>
          <h3>Recent Bookings</h3>
          <ul>
            {stats.recentBookings.map(b => (
              <li key={b._id}>{b.brandName} → {b.modelId?.username || b.modelId} on {new Date(b.startDate).toLocaleDateString()} ({b.days} day(s))</li>
            ))}
          </ul>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
