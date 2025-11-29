import React from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

export default function AdminLayout({ children }){
  return (
    <div className="admin-layout">
      <aside className="admin-side">
        <h3>Admin</h3>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/bookings">Bookings</Link>
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-panel">
          {children}
        </div>
      </main>
    </div>
  )
}
