const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// --- 1. In-Memory Database (Simulating Persistence) ---
let eventDB = {
    eventId: "node-meetup-2025",
    name: "Node.js Meet-up",
    totalSeats: 500,
    availableSeats: 500,
    version: 0
};

const reservationsDB = []; 

// --- 2. Helper Functions ---

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 50));

// --- 3. Endpoints ---

app.get('/reservations', (req, res) => {
    res.json({
        eventId: eventDB.eventId,
        name: eventDB.name,
        totalSeats: eventDB.totalSeats,
        availableSeats: eventDB.availableSeats,
        reservationCount: reservationsDB.length,
        version: eventDB.version
    });
});

// POST /reservations/ - Reserve Seats
app.post('/reservations', async (req, res) => {
    const { partnerId, seats } = req.body;

    // Validation
    if (!partnerId || !seats) {
        return res.status(400).json({ error: "Missing partnerId or seats" });
    }
    const numSeats = parseInt(seats);
    if (numSeats <= 0 || numSeats > 10) {
        return res.status(400).json({ error: "Seats must be between 1 and 10" });
    }

    try {
        // OPTIMISTIC CONCURRENCY FLOW
        
        // Step 1: Read current state (Snapshot)
        const currentVersion = eventDB.version;
        
         // Uncomment to test race conditions manually
        // await simulateLatency();

        // Step 2: Check Logic against Snapshot
        if (eventDB.availableSeats < numSeats) {
            return res.status(409).json({ error: "Not enough seats left" });
        }

        // Step 3: Atomic Compare-and-Swap
        // We check if the version in DB is STILL the same as what we read in Step 1.
        if (eventDB.version !== currentVersion) {
            // The DB has changed since we looked at it! 
            // In a real DB, you'd do: UPDATE ... WHERE version = currentVersion
            return res.status(409).json({ error: "Concurrency conflict. Please retry." });
        }

        // Step 4: Commit Update
        eventDB.availableSeats -= numSeats;
        eventDB.version += 1; // Increment version
        
        const newReservation = {
            reservationId: crypto.randomUUID(),
            partnerId,
            seats: numSeats,
            status: "confirmed",
            timestamp: new Date()
        };
        reservationsDB.push(newReservation);

        console.log(`[BOOKED] ${numSeats} seats for ${partnerId}. Remaining: ${eventDB.availableSeats}`);
        
        return res.status(201).json({
            reservationId: newReservation.reservationId,
            seats: newReservation.seats,
            status: "confirmed"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE /reservations/:id - Cancel Reservation
app.delete('/reservations/:id', (req, res) => {
    const { id } = req.params;

    const index = reservationsDB.findIndex(r => r.reservationId === id);

    if (index === -1) {
        return res.status(404).json({ error: "Reservation not found" });
    }

    const reservation = reservationsDB[index];

    // Restore seats to pool
    eventDB.availableSeats += reservation.seats;
    eventDB.version += 1; // Any change updates the version
    
    // Remove from DB
    reservationsDB.splice(index, 1);

    console.log(`[CANCELLED] ID ${id}. Returned ${reservation.seats} seats.`);
    
    return res.status(204).send();
});

// Start Server
app.listen(PORT, () => {
    console.log(`TicketBoss API running on http://localhost:${PORT}`);
    console.log(`Seed Data: ${eventDB.availableSeats}/${eventDB.totalSeats} seats available.`);
});