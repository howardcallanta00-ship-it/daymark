'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env'), quiet: true });

function adminConnectionConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      multipleStatements: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };
}

async function initialize() {
  const databaseDirectory = path.join(__dirname, '..', 'database');
  const [schema, seed] = await Promise.all([
    fs.readFile(path.join(databaseDirectory, 'schema.sql'), 'utf8'),
    fs.readFile(path.join(databaseDirectory, 'seed.sql'), 'utf8')
  ]);

  const connection = await mysql.createConnection(adminConnectionConfig());
  try {
    await connection.query(schema);
    await connection.query(seed);

    const [[taskCount]] = await connection.query(
      'SELECT COUNT(*) AS total, COUNT(DISTINCT task_date) AS dates FROM tasks_today_db.tasks'
    );
    const [[userCount]] = await connection.query(
      'SELECT COUNT(*) AS total FROM tasks_today_db.users'
    );

    console.log(`Database ready: ${taskCount.total} tasks across ${taskCount.dates} dates, ${userCount.total} user.`);
  } finally {
    await connection.end();
  }
}

initialize().catch((error) => {
  console.error('Database setup failed:', error.message);
  process.exitCode = 1;
});
