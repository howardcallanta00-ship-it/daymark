'use strict';

const database = require('../config/database');

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    taskDate: row.task_date,
    createdAt: row.created_at
  };
}

class TaskModel {
  constructor(connection = database) {
    this.connection = connection;
  }

  async findForToday() {
    const [rows] = await this.connection.execute(`
      SELECT id, title, status, task_date, created_at
      FROM tasks
      WHERE task_date = CURDATE()
      ORDER BY created_at ASC, id ASC
    `);

    return rows.map(mapTask);
  }

  async findAll() {
    const [rows] = await this.connection.execute(`
      SELECT id, title, status, task_date, created_at
      FROM tasks
      ORDER BY task_date ASC, created_at ASC, id ASC
    `);

    return rows.map(mapTask);
  }
}

module.exports = new TaskModel();
module.exports.TaskModel = TaskModel;
