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

##  API Documentation
Base URL : http://localhost:3001

1️⃣ Get Event Summary: GET /reservations
Response – 200 OK:
{
  "eventId": "node-meetup-2025",
  "name": "Node.js Meet-up",
  "totalSeats": 500,
  "availableSeats": 42,
  "reservationCount": 458,
  "version": 14
}
2️⃣ Create Reservation
Endpoint: POST /reservations
Request Body:
{
  "partnerId": "abc-corp",
  "seats": 3
}
Success – 201 Created:
{
  "reservationId": "uuid",
  "seats": 3,
  "status": "confirmed"
}
Errors

400 Bad Request → seats ≤ 0 or seats > 10

409 Conflict → not enough seats available

🧠 Technical Decisions
Architecture

RESTful API built with Express for simplicity and clarity

React frontend polling the backend every 2 seconds to simulate real-time updates

Clear separation between backend and frontend

Storage Method

Uses an in-memory data store (eventDB and reservationsDB)

Chosen for simplicity and to focus on concurrency logic

Suitable for evaluation and interview scenarios

Concurrency Control

Implemented optimistic concurrency control

Uses a version field to track state changes

Prevents race conditions and over-booking without locking

Why Optimistic Locking?

Scales better than pessimistic locks

Ideal when conflicts are rare but must be handled correctly

Commonly used in real-world distributed systems

📌 Assumptions

Single event is managed at a time

Maximum 10 seats per reservation

In-memory storage resets on server restart

Authentication is out of scope

Designed for learning, evaluation, and interview demonstration

✅ Features Summary

Real-time seat availability

No over-booking guaranteed

Create, update, and cancel reservations

Clean REST API design

Human-readable, maintainable code

Frontend + backend integration

🛠️ Tech Stack

Backend: Node.js, Express

Frontend: React, Axios

Concurrency: Optimistic locking (version-based)
