const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// This line tells Node to show your HTML/CSS files from the 'public' folder
app.use(express.static('public')); 

// Database Connection Settings
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,        // Your XAMPP MariaDB port
    user: 'root',
    password: '',      // Your empty password
    database: 'uol_bus_portal'
});

// API Endpoint to get bus data
app.get('/api/buses', (req, res) => {
    const sql = `
        SELECT r.route_name, t.stop_name, t.arrival_time 
        FROM bus_routes r 
        JOIN route_timings t ON r.route_id = t.route_id`;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});