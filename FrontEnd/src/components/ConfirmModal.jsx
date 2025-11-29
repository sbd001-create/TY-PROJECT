import React from 'react'

export default function ConfirmModal({ open, message = 'Are you sure?', onConfirm, onCancel }){
  if (!open) return null
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p style={{marginBottom:12}}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap:8 }}>
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
