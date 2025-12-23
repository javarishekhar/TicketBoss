# 🎫 TicketBoss – Event Ticketing System

TicketBoss is a lightweight, real-time event ticketing system designed to handle concurrent seat reservations **without over-selling**.  
It consists of a **Node.js + Express REST API** backend and a **React frontend dashboard**.

---

## 📂 Project Structure

SUPUR-ASSIGNMENT/
├── server/ # Backend API (Node.js + Express)
│ ├── server.js # Main application logic
│ └── package.json # Backend dependencies
│
└── ticketboss-client/ # Frontend Client (React)
├── src/ # React source code
├── public/ # Static assets
└── package.json # Frontend dependencies


---

## ⚙️ Setup Instructions

To run this application, you need **Node.js** installed.  
You must open **two terminal windows**:  
- One for the **backend**
- One for the **frontend**

---

## 🚀 Step 1: Start the Backend API

Open a terminal and navigate to the server directory:

```bash
cd server
npm install
node server.js
TicketBoss API running on http://localhost:3001

## Step 2: Start the Frontend Client

Open a new terminal window and navigate to the client directory:
cd ticketboss-client
npm install
npm start
http://localhost:3000
