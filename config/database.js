'use strict';

const mysql = require('mysql2/promise');

function connectionConfig() {
  const base = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    dateStrings: ['DATE']
  };

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      ...base,
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    };
  }

  return {
    ...base,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tasks_today_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };
}

module.exports = mysql.createPool(connectionConfig());
