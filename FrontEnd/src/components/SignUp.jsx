import './signup.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandSignUpForm from './BrandSignUpForm';
import ModelSignUpForm from './ModelSignUpForm';

const SignUp = ({ onClose, onSignupSuccess }) => {
  const [formType, setFormType] = useState(null); 
  const navigate = useNavigate();

  const handleSwitch = (type) => setFormType(type);

  const handleSignupSuccess = () => {
    // If parent passed a callback, call it and don't force navigation (useful when embedded as a modal)
    if (typeof onSignupSuccess === 'function') {
      onSignupSuccess();
      return;
    }
    // Default behavior when used as a standalone page
    if (typeof onClose === 'function') onClose();
    navigate('/login');
  };

  return (
    <div className="signup-container" style={{ position: 'relative' }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          background: 'transparent',
          border: 'none',
          fontSize: '2rem',
          color: '#1f2937',
          cursor: 'pointer',
          zIndex: 10,
        }}
        aria-label="Close Sign Up"
      >
        &times;
      </button>
      <h2 className="signup-title">Sign Up</h2>
      {formType === null && (
        <div className="signup-choice-btns" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', margin: '2rem 0' }}>
          <button onClick={() => handleSwitch('brand')} className="signup-btn">Brand</button>
          <button onClick={() => handleSwitch('model')} className="signup-btn">Model</button>
        </div>
      )}
      {formType === 'brand' && (
        <div className="signup-flow-box">
          <BrandSignUpForm onSwitch={() => handleSwitch('model')} onSignupSuccess={handleSignupSuccess} />
        </div>
      )}
      {formType === 'model' && (
        <div className="signup-flow-box">
          <ModelSignUpForm onSwitch={() => handleSwitch('brand')} onSignupSuccess={handleSignupSuccess} />
        </div>
      )}
    </div>
  );
};

export default SignUp;
