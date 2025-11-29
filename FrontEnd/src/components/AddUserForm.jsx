import React, { useState } from 'react';
import './Admin.css'
import SignUp from './SignUp';

const AddUserForm = ({ onCreated }) => {
  const [show, setShow] = useState(false);

  if (!show) return <button className="btn-primary" onClick={() => setShow(true)}>Add user</button>;

  // Render the main SignUp component inside the admin modal. When used here, we pass
  // an onSignupSuccess callback so SignUp won't navigate away and instead will
  // notify the parent to refresh the users list.
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 840 }}>
        <SignUp onClose={() => setShow(false)} onSignupSuccess={() => { setShow(false); if (onCreated) onCreated(); }} />
      </div>
    </div>
  );
};

export default AddUserForm;
