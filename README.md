# TicketBoss - Event Ticketing System

TicketBoss is a lightweight, real-time event ticketing system designed to handle concurrent seat reservations without over-selling. It consists of a Node.js/Express REST API backend and a React frontend dashboard.

## 📂 Project Structure

SUPUR-ASSIGNMENT/
├── server/                 # Backend API (Node.js + Express)
│   ├── server.js           # Main application logic
│   └── package.json        # Backend dependencies
│
└── ticketboss-client/      # Frontend Client (React)
    ├── src/                # React source code
    ├── public/             # Static assets
    └── package.json        # Frontend dependencies

# Setup Instructions
To run this application, you will need Node.js installed. You will need to open two separate terminal windows: one for the backend and one for the frontend.

# Step 1: Start the Backend API
Open your terminal.

Navigate to the server directory:
    cd server
Install dependencies:
    npm install
Start the server:
    node server.js
Output should verify: TicketBoss API running on http://localhost:3001

# Step 2: Start the Frontend Client

Open a new terminal window.
Navigate to the client directory:
Navigate to the client directory:
    cd ticketboss-client
Install dependencies:
    npm install
Start the React application:
    npm start

This will automatically open the dashboard at http://localhost:3000
