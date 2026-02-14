const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

const initialize = () => {
  db.serialize(() => {
    // Tabla de datos meteorológicos
    db.run(`
      CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        temperature REAL,
        humidity INTEGER,
        pressure INTEGER,
        description TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de alertas
    db.run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        condition TEXT,
        threshold REAL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
};

const saveWeather = (data) => {
  db.run(
    `INSERT INTO weather (city, temperature, humidity, pressure, description) 
     VALUES (?, ?, ?, ?, ?)`,
    [data.city, data.temperature, data.humidity, data.pressure, data.description]
  );
};

const getWeatherHistory = (city, limit = 50) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM weather WHERE city = ? ORDER BY timestamp DESC LIMIT ?`,
      [city, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const createAlert = (city, condition, threshold) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO alerts (city, condition, threshold) VALUES (?, ?, ?)`,
      [city, condition, threshold],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const getAlerts = (city) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM alerts WHERE city = ? AND is_active = 1`,
      [city],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
};

module.exports = {
  db,
  initialize,
  saveWeather,
  getWeatherHistory,
  createAlert,
  getAlerts
};
