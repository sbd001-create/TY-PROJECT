import React, { useEffect, useState } from 'react';
import AddUserForm from './AddUserForm';
import AdminLayout from './AdminLayout';
import ConfirmModal from './ConfirmModal';
import BrandSignUpForm from './BrandSignUpForm';
import ModelSignUpForm from './ModelSignUpForm';
import './Admin.css'
import { getAdminAuthHeader } from '../utils/adminAuth';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [editModalUser, setEditModalUser] = useState(null);

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/admin/users?admin=true&q=${encodeURIComponent(q)}&page=${p}&limit=${limit}`, { headers: getAdminAuthHeader() });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        if (data.total !== undefined) setTotal(data.total);
      } else alert(data.error || 'Failed to fetch users');
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(1); }, []);

  const [confirmState, setConfirmState] = useState({ open:false, message:'', onConfirm: null })

  const softDelete = (id) => {
    setConfirmState({ open:true, message: 'Soft-delete this user?', onConfirm: async () => {
      try {
        const res = await fetch(`http://localhost:5000/admin/users/${id}?admin=true`, { method: 'DELETE', headers: getAdminAuthHeader() });
        const data = await res.json();
        if (res.ok) fetchUsers(page); else alert(data.error || 'Failed');
      } catch (err) { alert('Network error') }
      setConfirmState({ open:false })
    }})
  }

  const restore = (id) => {
    setConfirmState({ open:true, message:'Restore this user?', onConfirm: async () => {
      try {
        const res = await fetch(`http://localhost:5000/admin/users/${id}/restore?admin=true`, { method: 'POST', headers: getAdminAuthHeader() });
        const data = await res.json();
        if (res.ok) fetchUsers(page); else alert(data.error || 'Failed');
      } catch (err) { alert('Network error') }
      setConfirmState({ open:false })
    }})
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <h2>Manage Users</h2>
        <div>
          <AddUserForm onCreated={() => fetchUsers(page)} />
        </div>
      </div>

      <div className="search-row" style={{ marginBottom: 12 }}>
        <input className="form-input" placeholder="Search by name or email" value={q} onChange={e => setQ(e.target.value)} />
        <button className="btn-primary" onClick={() => { setPage(1); fetchUsers(1); }} disabled={loading}>Search</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Type</th><th>Deleted</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>
                {editingId === u._id ? (
                  <input className="form-input" value={editingValues.username || ''} onChange={e => setEditingValues(prev => ({ ...prev, username: e.target.value }))} />
                ) : u.username}
              </td>
              <td>
                {editingId === u._id ? (
                  <input className="form-input" value={editingValues.email || ''} onChange={e => setEditingValues(prev => ({ ...prev, email: e.target.value }))} />
                ) : u.email}
              </td>
              <td>
                {editingId === u._id ? (
                  <select className="form-input" value={editingValues.type || u.type} onChange={e => setEditingValues(prev => ({ ...prev, type: e.target.value }))}>
                    <option value="model">model</option>
                    <option value="brand">brand</option>
                  </select>
                ) : u.type}
              </td>
              <td>{u.isDeleted ? 'Yes' : 'No'}</td>
              <td className="admin-actions">
                {editingId === u._id ? (
                  <>
                    <button className="btn-primary" onClick={async () => {
                      try {
                        const res = await fetch(`http://localhost:5000/admin/users/${u._id}?admin=true`, { method: 'PUT', headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify(editingValues) });
                        const data = await res.json();
                        if (res.ok) {
                          setEditingId(null);
                          fetchUsers(page);
                        } else alert(data.error || 'Failed to save');
                      } catch (err) { alert('Network error'); }
                    }}>Save</button>
                    <button className="btn-ghost" onClick={() => { setEditingId(null); setEditingValues({}); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn-ghost" onClick={() => { setEditModalUser({ ...u }); }}>Edit</button>
                    <button className="btn-danger" onClick={() => softDelete(u._id)}>delete</button>
                    {u.isDeleted && <button className="btn-primary" onClick={() => restore(u._id)}>Restore</button>}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <button className="btn-ghost" onClick={() => { if (page > 1) { const np = page - 1; setPage(np); fetchUsers(np); } }} disabled={page <= 1}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
        <button className="btn-ghost" onClick={() => { if (page < Math.ceil(total / limit)) { const np = page + 1; setPage(np); fetchUsers(np); } }} disabled={page >= Math.ceil(total / limit)}>Next</button>
      </div>

      <ConfirmModal open={confirmState.open} message={confirmState.message} onConfirm={confirmState.onConfirm} onCancel={() => setConfirmState({ open:false })} />

      {/* Edit Modal - Show signup form based on user type */}
      {editModalUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {editModalUser.type === 'brand' ? (
              <BrandSignUpForm
                initialData={editModalUser}
                isEditMode={true}
                onEditCancel={() => setEditModalUser(null)}
                onSignupSuccess={() => {
                  setEditModalUser(null);
                  fetchUsers(page);
                }}
              />
            ) : (
              <ModelSignUpForm
                initialData={editModalUser}
                isEditMode={true}
                onEditCancel={() => setEditModalUser(null)}
                onSignupSuccess={() => {
                  setEditModalUser(null);
                  fetchUsers(page);
                }}
              />
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
