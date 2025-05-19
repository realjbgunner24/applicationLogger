// src/components/EditModal.js
import React, { useState, useEffect } from 'react';

function EditModal({ application, onSave, onClose, statusOptions }) {
  // Initialize modal state with the application data being edited
  const [formData, setFormData] = useState({ ...application });
  const [error, setError] = useState(''); // For potential validation errors

  // Update state if the application prop changes (though usually modal closes/opens)
  useEffect(() => {
    setFormData({ ...application });
  }, [application]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    // Basic validation example
    if (!formData.jobTitle || !formData.companyName) {
        setError('Job Title and Company cannot be empty.');
        return;
    }
    // Pass only the changed data or the whole object back? Pass whole object for simplicity now.
    // Ensure numeric fields are numbers if necessary before saving
    onSave(formData); // Call the save handler passed from App.js
  };

  // Prevent modal close on background click if needed, or handle here
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        onClose();
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackgroundClick}>
      <div className="modal-content card">
        <h2>Edit Application: {application.jobTitle}</h2>
        <form onSubmit={handleSave}>
          {error && <p className="error-message">{error}</p>}

          {/* Include fields to edit */}
          <div className="form-grid">
            {/* Row 1: Title / Company */}
            <div>
                <label htmlFor="edit-jobTitle">Job Title*:</label>
                <input type="text" id="edit-jobTitle" name="jobTitle" value={formData.jobTitle || ''} onChange={handleChange} required />
            </div>
             <div>
                <label htmlFor="edit-companyName">Company*:</label>
                <input type="text" id="edit-companyName" name="companyName" value={formData.companyName || ''} onChange={handleChange} required />
            </div>
            {/* Row 2: Link / Status */}
             <div>
                <label htmlFor="edit-jobLink">Job Link/URL:</label>
                <input type="url" id="edit-jobLink" name="jobLink" value={formData.jobLink || ''} onChange={handleChange} placeholder="https://..."/>
            </div>
            <div>
                <label htmlFor="edit-status">Status:</label>
                <select id="edit-status" name="status" value={formData.status || ''} onChange={handleChange}>
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            {/* Row 3: Dates */}
            <div>
                <label htmlFor="edit-followUpDate">Next Follow Up:</label>
                <input type="date" id="edit-followUpDate" name="followUpDate" value={formData.followUpDate || ''} onChange={handleChange} />
            </div>
             <div>
                <label htmlFor="edit-interviewDate">Interview Date:</label>
                <input type="date" id="edit-interviewDate" name="interviewDate" value={formData.interviewDate || ''} onChange={handleChange} />
            </div>

            {/* Row 4: Notes (spans width) */}
             <div className="form-grid-span-col-2">
                 <label htmlFor="edit-notes">Notes:</label>
                 <textarea id="edit-notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows="4"></textarea>
             </div>

            {/* Could add tailored/referred checkboxes if you want to edit points, but maybe keep simple */}
            {/* <p>Points: {formData.pointsEarned} (Edit logic TBD)</p> */}

          </div>

          <div className="modal-actions">
            <button type="submit" className="button-primary">Save Changes</button>
            <button type="button" onClick={onClose} className="button-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;