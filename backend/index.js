// backend/index.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'carrots' // Make sure this is your correct password
};

// Create a connection pool
const pool = mysql.createPool({ ...dbConfig, database: 'griffins_db', waitForConnections: true, connectionLimit: 10, queueLimit: 0 });
const db = pool.promise();

// --- FINAL CORRECTED: Function to initialize the database ---
async function initializeDatabase() {
  // 1. Create a temporary connection to create the database if it doesn't exist
  let tempConnection;
  try {
    tempConnection = await mysql.createConnection(dbConfig).promise();
    await tempConnection.query('CREATE DATABASE IF NOT EXISTS griffins_db');
    console.log('Database griffins_db created or already exists.');
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1); // Exit if we can't create the DB
  } finally {
    if (tempConnection) tempConnection.end();
  }

  // 2. Run the SQL script to create tables and insert data
  try {
    let shouldSeedData = false;

    // Check if the Manufacturers table is empty. If it doesn't exist, it means we need to seed.
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Manufacturers');
      if (rows[0].count === 0) {
        shouldSeedData = true; // Table exists but is empty
      }
    } catch (checkErr) {
      // This error means the table doesn't exist, so we need to create and seed.
      shouldSeedData = true;
      console.log('Manufacturers table not found, will create and seed.');
    }

    const sqlFilePath = path.join(__dirname, '..', 'Griffins.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    const statements = sql.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0);

    // Execute statements sequentially
    for (const statement of statements) {
      const isInsert = statement.toUpperCase().startsWith('INSERT');
      const isSelect = statement.toUpperCase().startsWith('SELECT');
      // Run CREATE TABLE statements always.
      // Run INSERT statements only if shouldSeedData is true.
      // Ignore SELECT statements at the end of the SQL file.
      if (isInsert && shouldSeedData) {
        await db.query(statement);
      } else if (!isInsert && !isSelect) {
        await db.query(statement);
      }
    }
    console.log('Database tables initialized successfully.');
    if (shouldSeedData) {
      console.log('Initial data has been seeded.');
    } else {
      console.log('Database already contains data. Skipping seeding.');
    }
  } catch (err) {
    // Ignore "Table already exists" errors during development, but log others.
    if (err.code !== 'ER_TABLE_EXISTS_ERROR' && err.code !== 'ER_DUP_ENTRY') {
      console.error('Error initializing database tables and data:', err);
    }
  }
}

// Initialize DB and then start the server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from the Griffins API!');
});

// --- CORRECTED: Add a new aircraft ---
app.post('/api/aircraft', async (req, res) => {
  const { aircraft, specifications } = req.body;

  // Basic validation
  if (!aircraft || !aircraft.name || !specifications || !specifications.max_range) {
    return res.status(400).send({ message: 'Aircraft name and max range are required.' });
  }

  // Validate manufacturer_id is a number
  const manufacturerId = parseInt(aircraft.manufacturer_id, 10);
  if (isNaN(manufacturerId)) {
    return res.status(400).send({ message: 'A valid Manufacturer must be selected.' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert aircraft record using a fixed SQL statement
    const aircraftSql = `
      INSERT INTO Aircraft (name, type, max_speed, first_flight, status, description, manufacturer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const aircraftValues = [
      aircraft.name,
      aircraft.type || null,
      aircraft.max_speed ? parseInt(aircraft.max_speed) : null,
      aircraft.first_flight || null,
      aircraft.status || 'Active',
      aircraft.description || null,
      manufacturerId,
    ];

    const [aircraftResult] = await connection.query(aircraftSql, aircraftValues);
    const aircraftId = aircraftResult.insertId;

    // 2. Insert specifications record using a fixed SQL statement
    const specSql = `
      INSERT INTO Specifications (aircraft_id, max_range, ceiling, crew, engine_type)
      VALUES (?, ?, ?, ?, ?)
    `;
    const specValues = [
      aircraftId,
      specifications.max_range ? parseInt(specifications.max_range) : null,
      specifications.ceiling ? parseInt(specifications.ceiling) : null,
      specifications.crew ? parseInt(specifications.crew) : null,
      specifications.engine_type || null,
    ];

    await connection.query(specSql, specValues);

    await connection.commit();
    res.status(201).send({ message: 'Aircraft added successfully', aircraftId });
  } catch (err) {
    await connection.rollback();
    console.error('Error adding aircraft:', err);
    res.status(500).send({ message: 'Failed to add aircraft', error: err.message });
  } finally {
    connection.release();
  }
});

// Get all aircraft with search and filtering
app.get('/api/aircraft', async (req, res) => {
  const { search, type, country } = req.query;

  let sql = `
    SELECT a.*
    FROM Aircraft a
    LEFT JOIN Manufacturers m ON a.manufacturer_id = m.manufacturer_id
  `;
  const params = [];
  const whereClauses = [];

  if (search) {
    whereClauses.push(`(a.name LIKE ? OR a.description LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (type) {
    whereClauses.push(`a.type = ?`);
    params.push(type);
  }

  if (country) {
    whereClauses.push(`m.country = ?`);
    params.push(country);
  }

  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  try {
    const [results] = await db.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error('Error fetching aircraft:', err);
    res.status(500).send({ message: 'Failed to fetch aircraft', error: err.message });
  }
});

// Get all manufacturers
app.get('/api/manufacturers', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM Manufacturers');
    res.json(results);
  } catch (err) {
    console.error('Error fetching manufacturers:', err);
    res.status(500).send({ message: 'Failed to fetch manufacturers', error: err.message });
  }
});

// Get a single aircraft by id with all details
app.get('/api/aircraft/:id/details', async (req, res) => {
  const aircraftId = req.params.id;

  try {
    const [aircraft] = await db.query('SELECT * FROM Aircraft WHERE aircraft_id = ?', [aircraftId]);

    if (aircraft.length === 0) {
      return res.status(404).send({ message: 'Aircraft not found' });
    }

    const [specifications] = await db.query('SELECT * FROM Specifications WHERE aircraft_id = ?', [aircraftId]);
    const [operators] = await db.query(`
      SELECT o.name, o.country
      FROM Operators o
      JOIN Aircraft_Operators ao ON o.operator_id = ao.operator_id
      WHERE ao.aircraft_id = ?
    `, [aircraftId]);
    const [armaments] = await db.query(`
      SELECT a.name, a.type, a.description
      FROM Armaments a
      JOIN Aircraft_Armaments aa ON a.armament_id = aa.armament_id
      WHERE aa.aircraft_id = ?
    `, [aircraftId]);

    const result = {
      ...aircraft[0],
      specifications: specifications.length > 0 ? specifications[0] : null,
      operators,
      armaments
    };

    res.json(result);
  } catch (err) {
    console.error(`Error fetching details for aircraft ${aircraftId}:`, err);
    res.status(500).send({ message: 'Failed to fetch aircraft details', error: err.message });
  }
});

// Get a single manufacturer by id with all its aircraft
app.get('/api/manufacturer/:id', async (req, res) => {
  const manufacturerId = req.params.id;

  try {
    const [manufacturer] = await db.query('SELECT * FROM Manufacturers WHERE manufacturer_id = ?', [manufacturerId]);

    if (manufacturer.length === 0) {
      return res.status(404).send({ message: 'Manufacturer not found' });
    }

    const [aircraft] = await db.query('SELECT * FROM Aircraft WHERE manufacturer_id = ?', [manufacturerId]);

    const result = {
      ...manufacturer[0],
      aircraft
    };

    res.json(result);
  } catch (err) {
    console.error(`Error fetching manufacturer ${manufacturerId}:`, err);
    res.status(500).send({ message: 'Failed to fetch manufacturer', error: err.message });
  }
});

// Add a new manufacturer
app.post('/api/manufacturers', async (req, res) => {
  const { name, country } = req.body;

  if (!name || !country) {
    return res.status(400).send({ message: 'Manufacturer name and country are required.' });
  }

  try {
    const [result] = await db.query('INSERT INTO Manufacturers (name, country) VALUES (?, ?)', [name, country]);
    const newManufacturerId = result.insertId;
    res.status(201).send({ message: 'Manufacturer added successfully', manufacturerId: newManufacturerId });
  } catch (err) {
    console.error('Error adding manufacturer:', err);
    res.status(500).send({ message: 'Failed to add manufacturer', error: err.message });
  }
});