// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// --- Data file setup ---
const dataDir = path.join(__dirname, 'data');
const csvFilePath = path.join(dataDir, 'applications.csv');
const dataCsvHeader = "ID,Job Title,Company,Points Earned,Tailored CV,Referred,Date Applied,Status,Follow Up Date,Interview Date,Job Link,Notes\n";
const requiredColumns = 12; // Keep this updated! Match header columns
const rewardFilePath = path.join(dataDir, 'rewards.csv');
const rewardsCsvHeader = "ID,Reward Title, Points Needed\n";
const rewardsRequiredColumns = 3;
const historyFilePath = path.join(dataDir, 'history.csv');
const historyCsvHeader = "ID,Reward Item, Points Spent\n";
const historyRequiredColumns = 3;

//ENDED HERE!!!!!!



// --- Utility: Function to read and parse CSV ---
function readApplications() {
    // Returns promise { applications: [], totalScore: 0 }
    return new Promise((resolve, reject) => {
        fs.readFile(csvFilePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') { // File doesn't exist
                    console.warn('Data file not found on read, returning empty.');
                    return resolve({ applications: [], totalScore: 0 }); // Don't reject, just return empty
                }
                console.error('Error reading file:', err);
                return reject("Failed to read data file.");
            }

            const lines = data.trim().split('\n');
            const applications = [];
            let totalScore = 0;

            if (lines.length <= 1) {
                console.log('Data file empty or only header on read.');
                return resolve({ applications: [], totalScore: 0 });
            }

            // Skip header row (index 0)
            for (let i = 1; i < lines.length; i++) {
                // Basic CSV split - Better handling for quotes might be needed for complex notes
                 const values = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''));

                if (values.length >= requiredColumns) { // Check correct column count
                    const points = parseInt(values[3], 10); // Column index 3 is Points Earned
                    if (isNaN(points)) {
                         console.warn(`Skipping line ${i+1} due to invalid points: ${values[3]}`);
                         continue;
                    }
                    applications.push({
                        // Match header order carefully
                        id: values[0], // Use ID from CSV
                        jobTitle: values[1],
                        companyName: values[2],
                        pointsEarned: points,
                        isTailored: values[4] === 'true',
                        hasReferral: values[5] === 'true',
                        timestamp: values[6], // Date Applied
                        status: values[7] || 'Applied', // Default if empty
                        followUpDate: values[8] || '',
                        interviewDate: values[9] || '',
                        jobLink: values[10] || '',
                        notes: values[11] || '',
                    });
                    totalScore += points;
                } else {
                     console.warn(`Skipping malformed CSV line ${i+1} (expected ${requiredColumns}+ values, got ${values.length}): ${lines[i]}`);
                }
            }
            console.log(`Read complete. Found ${applications.length} valid applications.`);
            resolve({ applications, totalScore });
        });
    });
}

// --- Utility: Function to write applications array to CSV ---
function writeApplications(applications) {
    return new Promise((resolve, reject) => {
         // Regenerate CSV content from the array
        const escapeCSV = (str) => `"${String(str ?? '').replace(/"/g, '""')}"`; // Handle null/undefined safely
        const csvRows = applications.map(app => {
            return [
                escapeCSV(app.id), // Make sure ID is present
                escapeCSV(app.jobTitle),
                escapeCSV(app.companyName),
                app.pointsEarned, // Not a string
                app.isTailored, // Boolean
                app.hasReferral, // Boolean
                escapeCSV(app.timestamp),
                escapeCSV(app.status),
                escapeCSV(app.followUpDate),
                escapeCSV(app.interviewDate),
                escapeCSV(app.jobLink),
                escapeCSV(app.notes),
            ].join(',');
        });

        const csvContent = dataCsvHeader + csvRows.join('\n') + '\n'; // Add trailing newline

        fs.writeFile(csvFilePath, csvContent, 'utf8', (err) => {
            if (err) {
                console.error('Error writing data file:', err);
                return reject("Failed to write data to file.");
            }
            console.log(`Write complete. Saved ${applications.length} applications.`);
            resolve();
        });
    });
}




// --- Ensure data directory and initial file exist ---
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(csvFilePath)) {
  try {
    fs.writeFileSync(csvFilePath, dataCsvHeader, 'utf8');
    console.log(`Created data file with header: ${csvFilePath}`);
  } catch (err) {
    console.error("FATAL: Could not create data file!", err);
    process.exit(1);
  }
} else {
     // Optional: Check header on startup? Might be overkill.
     console.log(`Data file found: ${csvFilePath}`);
}

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Enable JSON body parsing

// --- API Endpoints ---

// GET all applications
app.get('/api/applications', async (req, res) => {
  console.log(`\n[${new Date().toISOString()}] GET /api/applications`);
  try {
    const data = await readApplications();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error || "Failed to read applications." });
  }
});

// ADD a new application
app.post('/api/applications', async (req, res) => {
    console.log(`\n[${new Date().toISOString()}] POST /api/applications`);
    const newAppData = req.body;
    console.log('Received new app data:', newAppData);

    // Basic validation (add more as needed)
    if (!newAppData || !newAppData.id || !newAppData.jobTitle || !newAppData.companyName || newAppData.pointsEarned == null) {
        console.error('Validation Error: Missing required fields for new app.');
        return res.status(400).json({ error: "Missing required application data fields (incl. ID)." });
    }

    try {
        const { applications } = await readApplications(); // Read current data
        applications.push(newAppData); // Add the new one
        await writeApplications(applications); // Write the whole thing back
        res.status(201).json({ message: "Application saved successfully.", application: newAppData });
    } catch (error) {
        res.status(500).json({ error: error || "Failed to save application." });
    }
});

// UPDATE an existing application
app.put('/api/applications/:id', async (req, res) => {
    const appIdToUpdate = req.params.id;
    const updatedAppData = req.body;
    console.log(`\n[${new Date().toISOString()}] PUT /api/applications/${appIdToUpdate}`);
    console.log('Received updated data:', updatedAppData);

    // Ensure the ID in the body matches the URL param for consistency
    if (!updatedAppData || updatedAppData.id !== appIdToUpdate) {
        console.error('Validation Error: ID mismatch or missing update data.');
        return res.status(400).json({ error: "Application ID mismatch or missing data." });
    }

    try {
        let { applications } = await readApplications();
        let found = false;

        // Find and replace the application
        const updatedApplications = applications.map(app => {
            if (app.id === appIdToUpdate) {
                found = true;
                // Important: Make sure ALL fields from updatedAppData are present and overwrite correctly
                // Also recalculate points maybe? Or assume client sends correct points? Assume client sends correct points for now.
                return { ...app, ...updatedAppData }; // Merge updates over original
            }
            return app;
        });

        if (!found) {
            console.warn(`Update failed: Application with ID ${appIdToUpdate} not found.`);
            return res.status(404).json({ error: "Application not found." });
        }

        await writeApplications(updatedApplications); // Write updated array back
        res.json({ message: "Application updated successfully.", application: updatedAppData });

    } catch (error) {
        res.status(500).json({ error: error || "Failed to update application." });
    }
});

// DELETE an application
app.delete('/api/applications/:id', async (req, res) => {
    const appIdToDelete = req.params.id;
    console.log(`\n[${new Date().toISOString()}] DELETE /api/applications/${appIdToDelete}`);

    try {
        let { applications } = await readApplications();
        const initialLength = applications.length;

        // Filter out the application to delete
        const remainingApplications = applications.filter(app => app.id !== appIdToDelete);

        if (remainingApplications.length === initialLength) {
            console.warn(`Delete failed: Application with ID ${appIdToDelete} not found.`);
            return res.status(404).json({ error: "Application not found." });
        }

        await writeApplications(remainingApplications); // Write filtered array back
        res.json({ message: "Application deleted successfully." });

    } catch (error) {
        res.status(500).json({ error: error || "Failed to delete application." });
    }
});


// --- Download Endpoint (no changes needed, reads current file) ---
app.get('/api/download-csv', (req, res) => {
  console.log(`\n[${new Date().toISOString()}] GET /api/download-csv request`);
  res.download(csvFilePath, 'job_applications.csv', (err) => {
     // ... (error handling as before) ...
     if (err) {
       if (err.code === 'ENOENT') {
           console.error('Error downloading: Data file not found.');
           res.status(404).send("Error: Data file not found.");
       } else {
           console.error('Error sending file:', err);
           res.status(500).send("Error downloading file.");
       }
     } else {
        console.log('CSV file download initiated.');
     }
  });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(` Gamifier Backend Server is running on http://localhost:${PORT}`);
  console.log(` Watching data file: ${csvFilePath}`);
});