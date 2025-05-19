// src/components/ApplicationList.js
import React from 'react';

// Helper to format dates nicely, handles empty strings/null
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};

function ApplicationList({ applications, onEdit, onDelete }) { // Receive handlers

  return (
    <div className="app-list-container">
      <h2>Logged Applications ({applications.length})</h2>
      <ul className="app-list">
        {/* Display in reverse chronological order (newest first) */}
        {[...applications].reverse().map((app) => (
          <li key={app.id} className="app-item card">
            <div className="app-item-header">
                <h3>
                    {app.jobTitle} @ {app.companyName}
                </h3>
                <span className={`status-badge status-${app.status?.toLowerCase().replace(/\s+/g, '-')}`}>{app.status || 'N/A'}</span>
            </div>

            <div className="app-item-details">
                <p><strong>Applied:</strong> {formatDate(app.timestamp)}</p>
                <p><strong>Points:</strong> <span className="points-earned">+{app.pointsEarned}</span>
                    {app.isTailored && <span className="badge tailored">Tailored</span>}
                    {app.hasReferral && <span className="badge referred">Referred</span>}
                </p>
                {app.jobLink && <p><strong>Link:</strong> <a href={app.jobLink} target="_blank" rel="noopener noreferrer">{app.jobLink.length > 40 ? app.jobLink.substring(0, 37) + '...' : app.jobLink}</a></p>}
                <p><strong>Next Follow Up:</strong> {formatDate(app.followUpDate)}</p>
                <p><strong>Interview Date:</strong> {formatDate(app.interviewDate)}</p>
                {app.notes && <p className="notes"><strong>Notes:</strong> {app.notes}</p>}
            </div>

            <div className="app-item-actions">
                <button onClick={() => onEdit(app)} className="button-secondary small">Edit / Update</button>
                <button onClick={() => onDelete(app)} className="button-danger small">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApplicationList;