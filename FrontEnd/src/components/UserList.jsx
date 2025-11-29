import { useState, useEffect } from 'react';
import ImageSlideshow from './ImageSlideshow';
import BookingModal from './BookingModal';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    skills: [],
    availability: 'all',
    location: 'all',
    search: ''
  });
  const [metadata, setMetadata] = useState({
    availableSkills: [],
    availableLocations: []
  });
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [bookingModel, setBookingModel] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = new URL('http://localhost:5000/api/users');
        
        // Add filters to URL
        if (filters.type !== 'all') {
          url.searchParams.append('type', filters.type);
        }
        if (filters.skills.length > 0) {
          url.searchParams.append('skills', filters.skills.join(','));
        }
        if (filters.availability !== 'all') {
          url.searchParams.append('availability', filters.availability);
        }
        if (filters.location !== 'all') {
          url.searchParams.append('location', filters.location);
        }
        if (filters.search) {
          url.searchParams.append('search', filters.search);
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setUsers(data.users);
          setMetadata(data.metadata || {});
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Failed to fetch users. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters]);

  if (loading) return <div className="user-list-container">Loading...</div>;
  if (error) return <div className="user-list-container error">{error}</div>;

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, skills, or description..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>

      {/* Filter Section */}
      <div className="filters-section">
        <div className="filter-group">
          <h3>Type</h3>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="all">All Types</option>
            <option value="model">Models</option>
            <option value="brand">Brands</option>
          </select>
        </div>

        <div className="filter-group skills-dropdown-group">
          <h3>Skills</h3>
          <div>
            <button type="button" className="skills-dropdown-toggle" onClick={() => setSkillsOpen(o => !o)} aria-expanded={skillsOpen}>
              {filters.skills.length > 0 ? filters.skills.join(', ') : 'Select skills'}
              <span className="caret">▾</span>
            </button>
            {skillsOpen && (
              <div className="skills-dropdown-panel">
                {metadata.availableSkills?.map(skill => (
                  <label key={skill} className={`skill-checkbox ${filters.skills.includes(skill) ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={filters.skills.includes(skill)}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          skills: e.target.checked
                            ? [...prev.skills, skill]
                            : prev.skills.filter(s => s !== skill)
                        }));
                      }}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="filter-group">
          <h3>Availability</h3>
          <select
            value={filters.availability}
            onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
          >
            <option value="all">All</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div className="filter-group">
          <h3>Location</h3>
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          >
            <option value="all">All Locations</option>
            {metadata.availableLocations?.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Found {users.length} user(s)
      </div>

      {/* User Grid */}
      <div className="user-grid">
        {users.map((user) => {
          if (user.type === 'model') {
            // Build an array of model image URLs (support modelPhotos array or single modelPhoto)
            let modelImages = [];
            if (user.modelPhotos && Array.isArray(user.modelPhotos) && user.modelPhotos.length > 0) {
              modelImages = user.modelPhotos.map(p => (p && p.url) ? p.url : (typeof p === 'string' ? p : null)).filter(Boolean);
            } else if (user.modelPhoto) {
              modelImages = [user.modelPhoto];
            }

            // Determine certificate image if it's an image
            const cert = user.modelCertificate;
            let certImage = null;
            if (cert && typeof cert === 'string') {
              const isDataImage = cert.startsWith('data:image');
              const isFileImage = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(cert);
              if (isDataImage || isFileImage) certImage = cert;
            }

            const slides = [];
            if (modelImages && modelImages.length > 0) slides.push(...modelImages);
            if (certImage && !slides.includes(certImage)) slides.push(certImage);

            const thumb = slides[0] || '/public/placeholder.png' || '';

            return (
              <div key={user._id} className="model-card" onClick={() => setSelectedModel({ ...user, slides })} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') setSelectedModel({ ...user, slides }) }}>
                <div className="model-thumb">
                  {thumb ? <img src={thumb} alt={`${user.username} thumbnail`} /> : <div style={{height:120,background:'#eee'}} />}
                </div>
                <div style={{paddingTop:8,textAlign:'center'}}>
                  <strong>{user.username}</strong>
                  {user.gender && (
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: 4 }}>
                      {String(user.gender).replace(/_/g, ' ').replace(/(^|\s)\S/g, s => s.toUpperCase())}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Brand card - compact display with click to expand
          if (user.type === 'brand') {
            return (
              <div 
                key={user._id} 
                className="brand-card" 
                onClick={() => setSelectedBrand(user)}
                role="button" 
                tabIndex={0} 
                onKeyDown={(e) => { if(e.key === 'Enter') setSelectedBrand(user); }}
              >
                <div className="brand-card-content">
                  <h3 className="brand-name">{user.username}</h3>
                  {user.contact && <p className="brand-contact">{user.contact}</p>}
                </div>
                <div className="brand-card-footer">Click for details</div>
              </div>
            );
          }

          // Non-model, non-brand fallback (shouldn't happen, but keeping for safety)
          return (
            <div key={user._id} className="user-card">
              <div className="user-card-header">
                <h3>{user.username}</h3>
                <span className="user-type">{user.type}</span>
              </div>
              <div className="user-info">
                {user.contact && <p><strong>Contact:</strong> {user.contact}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {bookingModel && (
        <BookingModal
          model={bookingModel}
          onClose={() => setBookingModel(null)}
          onSubmit={(payload) => {
            // BookingModal passes the created booking object back as `payload`.
            // Show a simple confirmation message instead of referencing possibly-undefined fields.
            console.log('Booking payload', payload);
            alert('Booking request sent successfully');
            setBookingModel(null);
          }}
        />
      )}
      {selectedModel && (
        <div className="model-detail-overlay">
          <div className="model-detail-modal">
            <button className="detail-close" onClick={() => setSelectedModel(null)} aria-label="Close">×</button>
            <h2>{selectedModel.username}</h2>
            <div>
              <div>
                <ImageSlideshow images={selectedModel.slides || []} height={360} />
              </div>
              <div>
                {selectedModel.location && <p><strong>Location:</strong> {selectedModel.location}</p>}
                {selectedModel.gender && <p><strong>Gender:</strong> {String(selectedModel.gender).replace(/_/g, ' ').replace(/(^|\s)\S/g, s => s.toUpperCase())}</p>}
                {selectedModel.availability && <p><strong>Availability:</strong> {selectedModel.availability}</p>}
                {selectedModel.experience && <p><strong>Experience:</strong> {selectedModel.experience}</p>}
                {typeof selectedModel.pricePerDay !== 'undefined' && <p><strong>Price per Day:</strong> ₹{selectedModel.pricePerDay}</p>}
                {selectedModel.contact && <p><strong>Contact:</strong> {selectedModel.contact}</p>}
                
                {selectedModel.skills?.length > 0 && (
                  <div>
                    <strong>Skills</strong>
                    <div className="skills-tags">
                      {selectedModel.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                    </div>
                  </div>
                )}

                <button className="book-btn" onClick={() => { setBookingModel(selectedModel); setSelectedModel(null); }}>Book this model</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedBrand && (
        <div className="brand-detail-overlay">
          <div className="brand-detail-modal">
            <button className="detail-close" onClick={() => setSelectedBrand(null)} aria-label="Close">×</button>
            <h2>{selectedBrand.username}</h2>
            <div className="brand-details">
              {selectedBrand.email && <p><strong>Email:</strong> {selectedBrand.email}</p>}
              {selectedBrand.contact && <p><strong>Contact:</strong> {selectedBrand.contact}</p>}
              {selectedBrand.brandDesc && (
                <div>
                  <strong>Description:</strong>
                  <p>{selectedBrand.brandDesc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;