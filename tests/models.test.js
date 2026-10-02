'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { TaskModel } = require('../models/TaskModel');
const { UserModel } = require('../models/UserModel');

test('TaskModel.findForToday filters with CURDATE', async () => {
  let capturedSql = '';
  const connection = {
    async execute(sql) {
      capturedSql = sql;
      return [[{
        id: 3,
        title: 'Today task',
        status: 'pending',
        task_date: '2026-10-02',
        created_at: new Date('2026-10-02T08:00:00')
      }]];
    }
  };

  const model = new TaskModel(connection);
  const tasks = await model.findForToday();

  assert.match(capturedSql, /WHERE\s+task_date\s*=\s*CURDATE\(\)/i);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].taskDate, '2026-10-02');
});

test('TaskModel.findAll orders all records by task date', async () => {
  let capturedSql = '';
  const connection = {
    async execute(sql) {
      capturedSql = sql;
      return [[], []];
    }
  };

  const model = new TaskModel(connection);
  await model.findAll();

  assert.doesNotMatch(capturedSql, /WHERE/i);
  assert.match(capturedSql, /ORDER BY\s+task_date\s+ASC/i);
});

test('UserModel returns the single demo record shape', async () => {
  const connection = {
    async execute(sql) {
      assert.match(sql, /LIMIT\s+1/i);
      return [[{
        id: 1,
        username: 'alex.morgan',
        full_name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        created_at: new Date('2026-01-15T08:30:00')
      }]];
    }
  };

  const model = new UserModel(connection);
  const user = await model.findDemoUser();

  assert.equal(user.fullName, 'Alex Morgan');
  assert.equal(user.username, 'alex.morgan');
});
