import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Contact from './Contact';
import UserList from './components/UserList';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import AdminBookings from './components/AdminBookings';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          {/* Landing / Main Page (Home) */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <section id="about"><About /></section>
                <section id="portfolio"><Portfolio /></section>
              </>
            }
          />
          
          {/* Routes for Authentication */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Contact Page */}
          <Route path="/contact" element={<Contact />} />
          
          {/* Users List Page */}
          <Route path="/users" element={<UserList />} />
          {/* Admin pages (no auth in this minimal example) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
