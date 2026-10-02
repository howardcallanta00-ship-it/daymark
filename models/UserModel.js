'use strict';

const database = require('../config/database');

function mapUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at
  };
}

class UserModel {
  constructor(connection = database) {
    this.connection = connection;
  }

  async findDemoUser() {
    const [rows] = await this.connection.execute(`
      SELECT id, username, full_name, email, created_at
      FROM users
      ORDER BY id ASC
      LIMIT 1
    `);

    return mapUser(rows[0]);
  }
}

module.exports = new UserModel();
module.exports.UserModel = UserModel;
