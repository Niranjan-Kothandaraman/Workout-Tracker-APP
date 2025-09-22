const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database("./workouts.db", (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise TEXT,
        sets INTEGER,
        reps INTEGER,
        weight INTEGER,
        date TEXT
      )`
    );
  }
});

// Routes

// Get all workouts
app.get("/workouts", (req, res) => {
  db.all("SELECT * FROM workouts", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new workout
app.post("/workouts", (req, res) => {
  const { exercise, sets, reps, weight, date } = req.body;
  db.run(
    `INSERT INTO workouts (exercise, sets, reps, weight, date) VALUES (?, ?, ?, ?, ?)`,
    [exercise, sets, reps, weight, date],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Delete a workout
app.delete("/workouts/:id", (req, res) => {
  db.run(`DELETE FROM workouts WHERE id = ?`, req.params.id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deletedID: req.params.id });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});