import React, { useState } from 'react';
import './ModelSignUpForm.css';
import { getAdminAuthHeader } from '../utils/adminAuth';

const BrandSignUpForm = ({ onSwitch, onSignupSuccess, initialData = null, isEditMode = false, onEditCancel }) => {
  const [password, setPassword] = useState(initialData?.password || '');
  const [rePassword, setRePassword] = useState(initialData?.password || '');
  const [isMatch, setIsMatch] = useState(!!initialData?.password);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Validation
    if (!isMatch) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    const data = {
      username: form.brandName.value.trim(),
      email: form.brandEmail.value.trim(),
      password: form.brandPassword.value,
      type: 'brand',
      contact: form.brandContact.value.trim(),
      brandDesc: form.brandDesc.value.trim(),
    };

    try {
      let res;
      if (isEditMode && initialData?._id) {
        // Update existing brand user
        res = await fetch(`http://localhost:5000/admin/users/${initialData._id}?admin=true`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
          body: JSON.stringify(data),
        });
      } else {
        // Create new brand user
        res = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      const result = await res.json();
      if (res.ok) {
        alert(isEditMode ? 'User updated successfully!' : 'Signup successful!');
        form.reset();
        setPassword('');
        setRePassword('');
        setIsMatch(false);
        setErrorMessage('');
        if (typeof onSignupSuccess === 'function') onSignupSuccess();
      } else {
        setErrorMessage(result.error || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error. Please try again.');
    }
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setPassword(newPass);
    setIsMatch(newPass === rePassword && newPass !== '');
  };

  const handleRePasswordChange = (e) => {
    const newRePass = e.target.value;
    setRePassword(newRePass);
    setIsMatch(password === newRePass && newRePass !== '');
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'Edit Brand User' : 'Signup as Brand'}</h2>
      {errorMessage && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
          fontSize: '0.9rem'
        }}>
          {errorMessage}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="brandName">Brand Name</label>
        <input type="text" id="brandName" name="brandName" defaultValue={initialData?.username || ''} required />
      </div>
      <div className="form-group">
        <label htmlFor="brandEmail">Email</label>
        <input type="email" id="brandEmail" name="brandEmail" defaultValue={initialData?.email || ''} required />
      </div>
      <div className="form-group">
        <label htmlFor="brandContact">Contact Number</label>
        <input type="text" id="brandContact" name="brandContact" defaultValue={initialData?.contact || ''} maxLength={10} minLength={10} required />
      </div>
      <div className="form-group">
        <label htmlFor="brandPassword">Password</label>
        <input 
          type="password" 
          id="brandPassword" 
          name="brandPassword" 
          required 
          minLength="6"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="brandRePassword">Re-enter Password</label>
        <input 
          type="password" 
          id="brandRePassword" 
          name="brandRePassword" 
          required 
          minLength="6"
          value={rePassword}
          onChange={handleRePasswordChange}
        />
        {rePassword && !isMatch && (
          <small style={{ color: 'red', marginTop: '0.25rem', display: 'block' }}>
            Passwords do not match
          </small>
        )}
        {isMatch && (
          <small style={{ color: 'green', marginTop: '0.25rem', display: 'block' }}>
            Passwords match
          </small>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="brandDesc">Brand Description</label>
        <textarea id="brandDesc" name="brandDesc" rows="3" defaultValue={initialData?.brandDesc || ''} />
      </div>
      <button type="submit" className="signup-btn" disabled={!isMatch || password === ''}>
        {isEditMode ? 'Update' : 'Signup'}
      </button>
      {isEditMode && (
        <button type="button" className="btn-ghost" style={{ marginLeft: '0.5rem' }} onClick={onEditCancel}>
          Cancel
        </button>
      )}
      {!isEditMode && (
        <p style={{ marginTop: '1rem' }}>
          Want to signup as a model?{' '}
          <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer' }}>Signup as Model</button>
        </p>
      )}
    </form>
  );
};

export default BrandSignUpForm;
