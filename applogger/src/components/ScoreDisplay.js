// src/components/ScoreDisplay.js
import React from 'react';

function ScoreDisplay({ score }) {
  return (
    <div className="score-display">
      <h2>Total Points: <span className="score-value">{score}</span></h2>
    </div>
  );
}

export default ScoreDisplay;