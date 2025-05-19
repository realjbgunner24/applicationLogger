// src/components/JobForm.js
import React, { useState } from 'react';

// Receive status options from App.js if needed, or define here
const STATUS_OPTIONS = ['Applied', 'Screening', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];


function JobForm({ onAddApplication }) {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isTailored, setIsTailored] = useState(false);
  const [hasReferral, setHasReferral] = useState(false);
  const [jobLink, setJobLink] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState(STATUS_OPTIONS[0]); // Default to 'Applied'


  const handleSubmit = (event) => {
    event.preventDefault();
    if (!jobTitle || !companyName) {
        alert('Please enter both Job Title and Company Name.');
        return;
    }

    onAddApplication({ // Pass all new fields
      jobTitle,
      companyName,
      isTailored,
      hasReferral,
      jobLink,
      notes,
      status
    });

    // Reset form fields
    setJobTitle('');
    setCompanyName('');
    setIsTailored(false);
    setHasReferral(false);
    setJobLink('');
    setNotes('');
    setStatus(STATUS_OPTIONS[0]); // Reset status
  };

  return (
    <form onSubmit={handleSubmit} className="job-form card">
      <h3>Add New Application</h3>
      <div className="form-grid">
        {/* Row 1 */}
        <div>
          <label htmlFor="jobTitle">Job Title*:</label>
          <input type="text" id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="companyName">Company*:</label>
          <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </div>
        {/* Row 2 */}
        <div>
          <label htmlFor="jobLink">Job Link/URL:</label>
          <input type="url" id="jobLink" value={jobLink} onChange={(e) => setJobLink(e.target.value)} placeholder="https://..." />
        </div>
         <div>
            <label htmlFor="status">Initial Status:</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
        {/* Row 3 */}
        <div className="form-grid-span-col-2"> {/* Make notes span full width */}
          <label htmlFor="notes">Initial Notes:</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="2"></textarea>
        </div>

        {/* Row 4 - Checkboxes */}
        <div className="checkbox-group">
          <label htmlFor="isTailored">
            <input type="checkbox" id="isTailored" checked={isTailored} onChange={(e) => setIsTailored(e.target.checked)}/> Tailored CV/Letter? (+5 pts)
          </label>
        </div>
        <div className="checkbox-group">
          <label htmlFor="hasReferral">
            <input type="checkbox" id="hasReferral" checked={hasReferral} onChange={(e) => setHasReferral(e.target.checked)}/> Via Referral? (+7 pts)
          </label>
        </div>
      </div>

      <button type="submit" className="button-primary">Add Application & Get Points!</button>
    </form>
  );
}

export default JobForm;