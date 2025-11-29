import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Check if user is logged in on component mount and window storage change
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const user = localStorage.getItem('user');
      
      setIsLoggedIn(loggedIn);
      if (loggedIn && user) {
        setCurrentUser(JSON.parse(user));
      } else {
        setCurrentUser(null);
      }
    };

    checkLoginStatus();

    // Listen for storage changes in other tabs/windows
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLogin(true);
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setShowSignUp(true);
  };

  const handleCloseLogin = () => setShowLogin(false);
  const handleCloseSignUp = () => setShowSignUp(false);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setShowLogin(false);
  };

  const handleSignupSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setShowSignUp(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <>
      <style>
        {`
        .navbar-header {
            background-color: #1f2937; /* Dark charcoal color for the black box look */
            color: white;
            padding: 1rem 1.5rem; /* Vertical and horizontal padding */
            position: fixed; /* Ensures it stays at the top */
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 50;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
        }

        .navbar-container {
            width: 100%;
            display: flex;
            justify-content: space-between; /* Puts the logo and links far apart */
            align-items: center;
            box-sizing: border-box;
        }

        .navbar-logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 0.05em;
        }

        /* Links container for desktop view */
        .navbar-links {
            display: none; /* Hidden by default for mobile */
        }

        @media (min-width: 640px) { /* Shows links on screens wider than 640px (desktop/tablet) */
            .navbar-links {
                display: block;
            }
        }

        .navbar-links ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex; 
            gap: 2rem;
        }

        .navbar-links a {
            text-decoration: none;
            color: white;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            transition: color 0.3s;
        }

        .navbar-links a:hover {
            color: #9ca3af; /* Light gray on hover */
        }

        /* Mobile menu button styling */
        .navbar-mobile-button {
            display: block;
            cursor: pointer;
            background: none;
            border: none;
            color: white;
        }

        @media (min-width: 640px) {
            .navbar-mobile-button {
                display: none;
            }
        .navbar-auth-buttons {
          display: flex;
          gap: 1rem;
        }
      }
        }
        `}
      </style>
      

      <header className="navbar-header">
        <div className="navbar-container">
          
         <h1>Modeling Agency</h1>

          <nav className="navbar-links">
            <ul>
              <li><Link to="/" onClick={() => {
                setTimeout(() => {
                  const homeSection = document.getElementById('home');
                   if (homeSection) homeSection.scrollIntoView({ behavior: 'smooth' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}>Home</Link></li>
              <li><Link to="/" onClick={e => {
                // Delay scroll to About after navigation
                setTimeout(() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}>About</Link></li>
              <li><Link to="/" onClick={e => {
                setTimeout(() => {
                  const portfolioSection = document.getElementById('portfolio');
                  if (portfolioSection) portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}>Portfolio</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/users">Users</Link></li>
              {/* <li><Link to="/admin">Admin</Link></li> */}
            </ul>
          </nav>
          
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {!isLoggedIn ? (
                <div className="navbar-auth-buttons">
                  <a href="#login" style={{
                    background: 'transparent',
                    border: '1px solid #fff',
                    color: '#fff',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    marginRight: '0.5rem',
                    transition: 'background 0.3s, color 0.3s',
                    boxShadow: 'none',
                  }}
                      onMouseOver={e => { e.target.style.background = '#fff'; e.target.style.color = '#1f2937'; }}
                      onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}
                      onClick={handleLoginClick}
                    >Login</a>
                    <a href="#signup" style={{
                      background: '#fff',
                      color: '#1f2937',
                      border: '1px solid #fff',
                      padding: '0.5rem 1.2rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'background 0.3s, color 0.3s',
                      boxShadow: 'none',
                    }}
                      onMouseOver={e => { e.target.style.background = '#1f2937'; e.target.style.color = '#fff'; }}
                      onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.color = '#1f2937'; }}
                      onClick={handleSignUpClick}
                    >Signup</a>
                </div>
              ) : (
                <div className="navbar-auth-buttons" style={{ alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>Welcome, {currentUser?.username || 'User'}</span>
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: 'transparent',
                      border: '1px solid #fff',
                      color: '#fff',
                      padding: '0.5rem 1.2rem',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'background 0.3s, color 0.3s',
                    }}
                    onMouseOver={e => { e.target.style.background = '#fff'; e.target.style.color = '#1f2937'; }}
                    onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}
                  >
                    Logout
                  </button>
                </div>
              )}
              <button className="navbar-mobile-button">
                  {/* Menu icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
              </button>
            </div>
        </div>
      </header>
        {/* Login Modal */}
        {showLogin && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}>
            <div style={{ position: 'relative' }}>
              <button onClick={handleCloseLogin} style={{
                position: 'absolute',
                top: '-2.5rem',
                right: 0,
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '2rem',
                cursor: 'pointer',
              }}>&times;</button>
              <Login onClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        )}
          {/* SignUp Modal */}
          {showSignUp && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}>
              <div style={{ position: 'relative' }}>
                <button onClick={handleCloseSignUp} style={{
                  position: 'absolute',
                  top: '-2.5rem',
                  right: 0,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '2rem',
                  cursor: 'pointer',
                }}>&times;</button>
                <SignUp onClose={handleCloseSignUp} onSignupSuccess={handleSignupSuccess} />
              </div>
            </div>
          )}
    </>
  );
}
;

export default Navbar;
