# AppLogger - Job Application Gamifier ++

## Description
AppLogger is a tool designed to help users track their job applications while gamifying the process. It allows users to log their applications, assign points for various actions (like tailoring a CV or getting a referral), and level up based on the points accumulated. This approach aims to make the often tedious job application process more engaging and motivating.

## Features
*   Track job applications (job title, company, date applied, status, notes, etc.)
*   Gamified points system for actions like tailoring CVs, networking, or getting referrals.
*   User leveling system based on points earned, providing a sense of progression.
*   Analytics dashboard to visualize application progress, success rates, and other metrics.
*   Full CRUD operations for managing applications (Create, Read, Update, Delete).
*   Data persistence using CSV files for easy management and portability.
*   Ability to download all application data as a CSV file.

## Technology Stack
*   **Frontend:** React.js
*   **Backend:** Node.js with Express.js
*   **Data Storage:** CSV files (`applications.csv`)
*   **Development Environment:** `concurrently` to run frontend and backend servers simultaneously.

## Getting Started

### Prerequisites
*   Node.js (which includes npm) must be installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

### Installation
1.  **Clone the repository** (or download and extract the source code):
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd applogger
    ```
3.  **Install dependencies** for both the frontend and backend:
    ```bash
    npm install
    ```

### Running the Application
1.  To start both the React development server (frontend) and the Express backend server, run the following command from the `applogger` directory:
    ```bash
    npm run dev
    ```
2.  This command uses `concurrently` to manage both processes.
    *   The React frontend will typically be available at `http://localhost:3000`.
    *   The Node.js/Express backend server will typically be available at `http://localhost:3001`.

## API Endpoints (Backend: `server.js`)

The backend server provides the following API endpoints:

*   **`GET /api/applications`**
    *   Description: Fetches all job applications and the current total score.
    *   Response: JSON array of application objects and the total score.

*   **`POST /api/applications`**
    *   Description: Adds a new job application.
    *   Request Body: JSON object representing the new application.
    *   Response: The newly added application object.

*   **`PUT /api/applications/:id`**
    *   Description: Updates an existing job application identified by its `id`.
    *   Request Body: JSON object containing the fields to update.
    *   Response: The updated application object.

*   **`DELETE /api/applications/:id`**
    *   Description: Deletes a job application identified by its `id`.
    *   Response: A confirmation message.

*   **`GET /api/download-csv`**
    *   Description: Downloads all application data as a CSV file named `applications_export.csv`.
    *   Response: A CSV file download.

## Project Structure

```
applogger/
├── data/             # Stores CSV data files (applications.csv)
├── public/           # Static assets for the React app (index.html, favicon.ico, etc.)
├── src/              # React application source code
│   ├── components/   # Reusable React components
│   │   └── analytics/ # Components specifically for the analytics dashboard
│   ├── App.css       # Main styles for App.js
│   ├── App.js        # Main application component orchestrating the UI
│   ├── App.test.js   # Tests for App.js
│   ├── index.css     # Global styles
│   ├── index.js      # Entry point for the React application
│   ├── logo.svg      # Sample logo
│   ├── reportWebVitals.js # Performance reporting (Create React App specific)
│   └── setupTests.js # Test setup (Create React App specific)
├── .env              # Environment variables (if any specific configurations are needed)
├── .gitignore        # Specifies intentionally untracked files that Git should ignore
├── launch_dev.bat    # Windows batch file to launch the dev environment (alternative to npm run dev)
├── package-lock.json # Records exact versions of dependencies
├── package.json      # Project metadata, dependencies, and npm scripts
├── server.js         # Express.js backend server logic (API endpoints, CSV handling)
└── README.md         # This file: Project overview, setup, and usage instructions
```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for bugs, feature requests, or improvements.

Before contributing, please ensure your code adheres to the existing style and that any new features are well-tested (if applicable).

## License
This project is licensed under the MIT License. (You may want to create a `LICENSE` file in the root of the `applogger` directory with the full MIT License text if one does not already exist).
