// src/App.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Add this import line below the others
import DashboardAnalytics from './components/analytics/DashboardAnalytics';
import JobForm from './components/JobForm';
import ApplicationList from './components/ApplicationList';

import ScoreDisplay from './components/ScoreDisplay';
import ActionButtons from './components/ActionButtons';
import EditModal from './components/EditModal'; // <-- Import Modal
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api/applications'; // Base URL for API

// Define available statuses
const STATUS_OPTIONS = ['Applied', 'Screening', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];

function App() {
  const [applications, setApplications] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null); // Holds the app being edited

  // --- Fetch initial data ---
  const fetchData = useCallback(async () => {
    console.log('Fetching data...');
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data received:', data);
      setApplications(data.applications || []);
      setTotalScore(data.totalScore || 0);
    } catch (e) {
      console.error("Failed to fetch data:", e);
      setError(`Could not load application data: ${e.message}. Is the backend server running?`);
      setApplications([]);
      setTotalScore(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Points Calculation (keep as is for now) ---
  const calculatePoints = (isTailored, hasReferral) => {
    let points = 10;
    if (isTailored) points += 5;
    if (hasReferral) points += 7;
    return points;
    // Could enhance later: e.g., add points for reaching 'Interviewing' status
  };

  // --- Handlers ---

  const handleAddApplication = async (appFormData) => {
    setError(null);
    const pointsEarned = calculatePoints(appFormData.isTailored, appFormData.hasReferral);
    // Generate unique ID (simple timestamp based - good enough for prototype)
    const newApp = {
      ...appFormData, // Includes jobTitle, companyName, isTailored, hasReferral, jobLink, notes
      id: String(Date.now()), // Use string ID based on timestamp
      pointsEarned,
      timestamp: new Date().toISOString(), // Date applied
      status: appFormData.status || 'Applied', // Ensure status is set
      followUpDate: '', // Initialize date fields
      interviewDate: '', // Initialize date fields
      // jobLink and notes should be passed from form
    };
    console.log("Attempting to add:", newApp);

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(newApp),
        });
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }

        // Update UI optimistically or refetch
        setApplications(prevApps => [...prevApps, newApp]);
        setTotalScore(prevScore => prevScore + pointsEarned);
        // await fetchData(); // Refetch if optimistic update is problematic

    } catch (e) {
        console.error("Failed to save application:", e);
        setError(`Failed to save application: ${e.message}`);
    }
  };

  const handleEditClick = (appToEdit) => {
    console.log("Editing app:", appToEdit);
    setEditingApp(appToEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingApp(null); // Clear editing state
  };

  const handleSaveEdit = async (updatedAppData) => {
    if (!editingApp) return;
    setError(null);
    console.log("Attempting to save update for ID:", editingApp.id, "Data:", updatedAppData);

    try {
        // Note: Assuming points don't change on edit, or recalculate if needed
        const appToSave = { ...editingApp, ...updatedAppData };

        const response = await fetch(`${API_BASE_URL}/${editingApp.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appToSave),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.error || `Update failed.`);
        }

        // Update state locally
        setApplications(prevApps =>
            prevApps.map(app => (app.id === editingApp.id ? appToSave : app))
        );

        // Recalculate total score if points changed (not implemented yet)

        handleCloseModal(); // Close modal on success

    } catch (e) {
         console.error("Failed to update application:", e);
         setError(`Failed to update application: ${e.message}`);
         // Keep modal open on error so user doesn't lose changes? Or show error in modal?
    }
  };

  const handleDeleteClick = async (appToDelete) => {
    if (!window.confirm(`Are you sure you want to delete "${appToDelete.jobTitle}" at "${appToDelete.companyName}"?`)) {
        return;
    }
    setError(null);
    console.log("Attempting to delete app ID:", appToDelete.id);

    try {
         const response = await fetch(`${API_BASE_URL}/${appToDelete.id}`, {
             method: 'DELETE',
         });

         if (!response.ok) {
             const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
             throw new Error(errorData.error || `Delete failed.`);
         }

         // Update state locally
         setApplications(prevApps => prevApps.filter(app => app.id !== appToDelete.id));
         // Recalculate total score
         setTotalScore(prevScore => prevScore - appToDelete.pointsEarned);

     } catch (e) {
          console.error("Failed to delete application:", e);
          setError(`Failed to delete application: ${e.message}`);
     }
  };

  const calculateLevel = (score) => {
    if (score < 50) return { name: "New Recruit", level: 1, next: 50 };
    if (score < 150) return { name: "Job Scout", level: 2, next: 150 };
    if (score < 300) return { name: "Application Agent", level: 3, next: 300 };
    if (score < 500) return { name: "Resume Runner", level: 4, next: 500 };
    if (score < 800) return { name: "Interview Interceptor", level: 5, next: 800 };
    if (score < 1200) return { name: "Offer Outrunner", level: 6, next: 1200 };
    return { name: "Career Commando", level: 7, next: Infinity }; // Max level
};

const userLevel = useMemo(() => calculateLevel(totalScore), [totalScore]);


  // --- Render Logic ---
   let content;
   if (isLoading) {
       content = <p>Loading applications...</p>;
   } else if (!isLoading && error && applications.length === 0) {
       content = <p className="error-message">{error}</p>;
   } else if (applications.length === 0) {
       content = <p>No applications logged yet. Add one!</p>;
   } else {
       content = (
           <ApplicationList
               applications={applications}
               onEdit={handleEditClick}
               onDelete={handleDeleteClick} // Pass delete handler
           />
       );
   }

   


   return (
    <div className="app-container">
      <h1>Job Application Gamifier ++</h1>

      {error && !isLoading && <p className="error-message">{error}</p>}

      {/* Score and Level Display */}
      <div className="top-stats-container">
          <ScoreDisplay score={totalScore} />
          <div className="level-display card">
             <h2>Level: {userLevel.level} ({userLevel.name})</h2>
             {userLevel.next !== Infinity &&
                <p>Next Level at: {userLevel.next} points</p>
             }
             {/* Simple Progress Bar */}
             {userLevel.next !== Infinity &&
                <progress
                    max={userLevel.next}
                    value={totalScore}
                    title={`${totalScore} / ${userLevel.next} points`}>
                </progress>
             }
          </div>
      </div>


      {/* --- Analytics Dashboard --- */}
      {!isLoading && applications.length > 0 && ( // Show only if not loading & has data
           <DashboardAnalytics applications={applications} />
       )}
       {!isLoading && applications.length === 0 && ( // Show placeholder if empty
           <div className="analytics-container empty">Apply to jobs to see your progress visualized here!</div>
       )}
        {isLoading && <p>Loading data for analytics...</p>}


      <JobForm onAddApplication={handleAddApplication} />

      <ActionButtons
        onDownloadCSV={() => window.location.href = 'http://localhost:3001/api/download-csv'}
        onClearData={() => { alert('Clear All not implemented yet. Delete individually or manage the CSV file directly.'); }}
        hasData={applications.length > 0}
      />

       {/* Use the existing 'content' variable logic for the list */}
       {content}

      {isModalOpen && editingApp && (
        <EditModal /* ... modal props ... */ />
      )}
    </div>
  );
}

export default App;