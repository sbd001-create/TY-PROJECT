import React, { useState, useEffect } from 'react';
import './ModelSignUpForm.css';
import { getAdminAuthHeader } from '../utils/adminAuth';

const ModelSignUpForm = ({ onSwitch, onSignupSuccess, initialData = null, isEditMode = false, onEditCancel }) => {
  const [password, setPassword] = useState(initialData?.password || '');
  const [rePassword, setRePassword] = useState(initialData?.password || '');
  const [isMatch, setIsMatch] = useState(!!initialData?.password);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [certPreview, setCertPreview] = useState(initialData?.modelCertificate || null);

  // Prefill photos and certificate when editing
  useEffect(() => {
    if (initialData) {
      try {
        const initPhotos = (initialData.modelPhotos || []).map(p => ({
          file: null,
          caption: (p && p.caption) ? p.caption : '',
          preview: (p && (p.url || p)) ? (p.url || p) : null,
        }));
        setPhotos(initPhotos);
        setCertPreview(initialData.modelCertificate || null);
      } catch (err) {
        // ignore errors while initializing previews
      }
    }
  }, [initialData]);

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

    setUploading(true);

    const toBase64 = file => new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    try {
      // Convert photos to base64 where new files were added; keep existing previews otherwise
      const modelPhotos = await Promise.all(photos.map(async (photo) => {
        let url = '';
        if (photo.file) {
          url = await toBase64(photo.file);
        } else if (photo.preview) {
          url = photo.preview;
        }
        return {
          url,
          caption: photo.caption || ''
        };
      }));

      // Certificate: if a new file is selected, convert it; otherwise keep existing certificate when editing
      const modelCertificateFile = form.modelCertificate && form.modelCertificate.files && form.modelCertificate.files[0];
      let modelCertificate = '';
      if (modelCertificateFile) {
        modelCertificate = await toBase64(modelCertificateFile);
      } else if (isEditMode && initialData?.modelCertificate) {
        modelCertificate = initialData.modelCertificate;
      }

      const data = {
        username: form.modelName.value.trim(),
        email: form.modelEmail.value.trim(),
        gender: form.gender ? form.gender.value : '',
        password: form.modelPassword.value,
        type: 'model',
        contact: form.modelContact.value.trim(),
        modelPortfolio: form.modelPortfolio.value.trim(),
        modelPhotos,
        modelCertificate,
        skills: form.skills.value.split(',').map(skill => skill.trim()).filter(s => s),
        experience: form.experience.value.trim(),
        availability: form.availability.value,
        pricePerDay: Number(form.pricePerDay.value || 0),
        location: form.location.value.trim(),
      };

      let res;
      if (isEditMode && initialData?._id) {
        // Update existing model user
        res = await fetch(`http://localhost:5000/admin/users/${initialData._id}?admin=true`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
          body: JSON.stringify(data),
        });
      } else {
        // Create new model user
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
        setPhotos([]);
        setErrorMessage('');
        if (typeof onSignupSuccess === 'function') onSignupSuccess();
      } else {
        setErrorMessage(result.error || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error processing images or network error');
    } finally {
      setUploading(false);
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
      <h2>{isEditMode ? 'Edit Model User' : 'Signup as Model'}</h2>

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
        <label htmlFor="modelName">Model Name</label>
        <input type="text" id="modelName" name="modelName" defaultValue={initialData?.username || ''} required />
      </div>

      <div className="form-group">
        <label htmlFor="modelEmail">Email</label>
        <input type="email" id="modelEmail" name="modelEmail" defaultValue={initialData?.email || ''} required />
      </div>


      <div className="form-group">
        <label htmlFor="modelPassword">Password</label>
        <input
          type="password"
          id="modelPassword"
          name="modelPassword"
          value={password}
          onChange={handlePasswordChange}
          required
          minLength="6"
        />
      </div>

      <div className="form-group">
        <label htmlFor="modelRePassword">Re-enter Password</label>
        <input
          type="password"
          id="modelRePassword"
          name="modelRePassword"
          value={rePassword}
          onChange={handleRePasswordChange}
          required
          minLength="6"
        />
        {!isMatch && rePassword && (
          <p style={{ color: 'red', fontSize: '0.9rem' }}>Passwords do not match</p>
        )}
      </div>

    <div className="form-group">
  <label htmlFor="modelContact">Contact Number</label>
  <input type="text" id="modelContact" name="modelContact" defaultValue={initialData?.contact || ''} required pattern="[0-9]*" inputMode="numeric"   maxLength="10"
    minLength="10"
    onInput={(e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }}
  />
</div>

      <div className="form-group">
        <label htmlFor="modelPortfolio">Portfolio Link</label>
        <input type="url" id="modelPortfolio" name="modelPortfolio" defaultValue={initialData?.modelPortfolio || ''} />
      </div>

      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" defaultValue={initialData?.gender || ''} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_say">Prefer not to say</option>
        </select>
      </div>

      <div className="form-group">
        <label>Model Photos</label>
        <div className="photo-upload-container">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const newPhotos = files.map(file => ({
                file,
                caption: '',
                preview: URL.createObjectURL(file)
              }));
              setPhotos(prev => [...prev, ...newPhotos]);
            }}
          />
          {/* existing certificate preview moved below the certificate input */}
          {photos.length < 4 && (
            <p className="photo-requirement">Please upload at least 4 photos</p>
          )}
          
          <div className="photo-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img src={photo.preview} alt={`Preview ${index + 1}`} />
                <input
                  type="text"
                  placeholder="Add caption"
                  value={photo.caption}
                  onChange={(e) => {
                    const newPhotos = [...photos];
                    newPhotos[index].caption = e.target.value;
                    setPhotos(newPhotos);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    // Only revoke object URL for files created with URL.createObjectURL
                    if (photo.file && photo.preview && photo.preview.startsWith('blob:')) {
                      URL.revokeObjectURL(photo.preview);
                    }
                    setPhotos(photos.filter((_, i) => i !== index));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="skills">Skills</label>
        <input
          type="text"
          id="skills"
          name="skills"
          defaultValue={initialData?.skills?.join(', ') || ''}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="experience">Experience</label>
        <select id="experience" name="experience" defaultValue={initialData?.experience || ''} required>
          <option value="">Select Experience</option>
          <option value="Beginner">Beginner (0-2 years)</option>
          <option value="Intermediate">Intermediate (2-5 years)</option>
          <option value="Advanced">Advanced (5+ years)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="availability">Availability</label>
        <select id="availability" name="availability" defaultValue={initialData?.availability || ''} required>
          <option value="">Select Availability</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="City, Country"
          defaultValue={initialData?.location || ''}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="pricePerDay">Price per day (numeric)</label>
        <input
          type="number"
          id="pricePerDay"
          name="pricePerDay"
          min="0"
          step="0.01"
          placeholder="e.g., 100"
          defaultValue={initialData?.pricePerDay || ''}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="modelCertificate">Upload Certificate</label>
        <input type="file" id="modelCertificate" name="modelCertificate" accept="application/pdf,image/*" { ...(isEditMode ? {} : { required: true }) } />
      </div>

      {isEditMode && certPreview && (
        <div style={{ marginTop: 8 }}>
          <strong>Existing Certificate:</strong>
          <div style={{ marginTop: 6 }}>
            {certPreview.startsWith('data:') || /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(certPreview) ? (
              <img src={certPreview} alt="certificate" style={{ maxWidth: 220, display: 'block', borderRadius: 6, border: '1px solid #eee' }} />
            ) : (
              <a href={certPreview} target="_blank" rel="noreferrer">View certificate</a>
            )}
            <div style={{ marginTop: 6 }}>
              <button type="button" className="btn-ghost" onClick={() => setCertPreview(null)}>Remove existing certificate</button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Button only enabled when passwords match */}
      <button type="submit" className="signup-btn" disabled={!isMatch || uploading}    
         style={{
          backgroundColor: (isMatch && !uploading) ? '#646cff' : '#aaa',
          cursor: (isMatch && !uploading) ? 'pointer' : 'not-allowed',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
        }}
>
        {uploading ? 'Processing...' : (isEditMode ? 'Update' : 'Signup')}
      </button>

      {isEditMode && (
        <button type="button" className="btn-ghost" style={{ marginLeft: '0.5rem' }} onClick={onEditCancel}>
          Cancel
        </button>
      )}
      
      {!isEditMode && (
        <p style={{ marginTop: '1rem' }}>
          Want to signup as a brand?{' '}
          <button
            type="button"
            onClick={onSwitch}
            style={{
              background: 'none',
              border: 'none',
              color: '#646cff',
              cursor: 'pointer'
            }}
          >
            Signup as Brand
          </button>
        </p>
      )}
    </form>
  );
};

export default ModelSignUpForm;
