// server.js - Express backend for Schedule Planner

const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite DB (data folder is mounted via Docker volume)
const dbPath = path.join(__dirname, 'data', 'events.db');
const db = new Database(dbPath);

// Ensure events table exists
db.exec(`
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  description TEXT,
  category TEXT DEFAULT 'Other',
  created_at TEXT DEFAULT (datetime('now'))
);
`);

// Helper to format rows as plain objects
function rowToEvent(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    start_time: row.start_time,
    end_time: row.end_time,
    description: row.description,
    category: row.category,
    created_at: row.created_at,
  };
}

// ----- API ROUTES ----- //

// Get all events
app.get('/api/events', (req, res) => {
  const stmt = db.prepare('SELECT * FROM events ORDER BY date, start_time');
  const rows = stmt.all();
  res.json(rows.map(rowToEvent));
});

// Create a new event
app.post('/api/events', (req, res) => {
  const { title, date, start_time, end_time, description, category } = req.body;
  const stmt = db.prepare(`INSERT INTO events (title, date, start_time, end_time, description, category)
    VALUES (?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(title, date, start_time, end_time, description, category || 'Other');
  const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(rowToEvent(newEvent));
});

// Update an event
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, date, start_time, end_time, description, category } = req.body;
  const stmt = db.prepare(`UPDATE events SET title = ?, date = ?, start_time = ?, end_time = ?, description = ?, category = ?
    WHERE id = ?`);
  stmt.run(title, date, start_time, end_time, description, category || 'Other', id);
  const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  res.json(rowToEvent(updated));
});

// Delete an event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM events WHERE id = ?');
  stmt.run(id);
  res.sendStatus(204);
});

// Summary statistics
app.get('/api/events/summary', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const monthStartStr = new Date().toISOString().slice(0, 7) + '-01';

  // Total events this week
  const weekCount = db.prepare('SELECT COUNT(*) as cnt FROM events WHERE date >= ? AND date <= ?')
    .get(weekStartStr, today).cnt;
  // Total events this month
  const monthCount = db.prepare('SELECT COUNT(*) as cnt FROM events WHERE date >= ? AND date <= ?')
    .get(monthStartStr, today).cnt;

  // Busiest day this week (most events)
  const busiest = db.prepare(`SELECT date, COUNT(*) as cnt FROM events WHERE date >= ? AND date <= ?
    GROUP BY date ORDER BY cnt DESC LIMIT 1`).get(weekStartStr, today);

  // Most frequent category overall
  const frequentCat = db.prepare(`SELECT category, COUNT(*) as cnt FROM events GROUP BY category ORDER BY cnt DESC LIMIT 1`).get();

  res.json({
    weekCount,
    monthCount,
    busiestDay: busiest ? busiest.date : null,
    busiestDayCount: busiest ? busiest.cnt : 0,
    mostFrequentCategory: frequentCat ? frequentCat.category : null,
    mostFrequentCategoryCount: frequentCat ? frequentCat.cnt : 0,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
