// src/components/ActionButtons.js
import React from 'react';

function ActionButtons({ onDownloadCSV, onClearData, hasData }) {
  return (
    <div className="action-buttons">
      <button onClick={onDownloadCSV} disabled={!hasData}>
        Download Applications (CSV)
      </button>
      <button onClick={onClearData} disabled={!hasData} className="button-danger">
        Clear All Data
      </button>
    </div>
  );
}

export default ActionButtons;