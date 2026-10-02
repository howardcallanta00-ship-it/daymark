'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const createApp = require('../app');

const todayTask = {
  id: 1,
  title: 'Only shown today',
  status: 'in-progress',
  taskDate: '2026-10-02',
  createdAt: new Date('2026-10-02T08:00:00')
};

const futureTask = {
  id: 2,
  title: 'Future task marker',
  status: 'pending',
  taskDate: '2026-10-03',
  createdAt: new Date('2026-10-02T09:00:00')
};

const models = {
  taskModel: {
    async findForToday() { return [todayTask]; },
    async findAll() { return [todayTask, futureTask]; }
  },
  userModel: {
    async findDemoUser() {
      return {
        id: 1,
        username: 'alex.morgan',
        fullName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        createdAt: new Date('2026-01-15T08:30:00')
      };
    }
  }
};

async function withServer(run) {
  const server = createApp({ models }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('all required pages render and welcome includes only today data', async () => {
  await withServer(async (baseUrl) => {
    const welcome = await fetch(`${baseUrl}/`);
    const welcomeHtml = await welcome.text();
    assert.equal(welcome.status, 200);
    assert.match(welcomeHtml, /Only shown today/);
    assert.doesNotMatch(welcomeHtml, /Future task marker/);

    const tasks = await fetch(`${baseUrl}/tasks`);
    const tasksHtml = await tasks.text();
    assert.equal(tasks.status, 200);
    assert.match(tasksHtml, /Only shown today/);
    assert.match(tasksHtml, /Future task marker/);

    const profile = await fetch(`${baseUrl}/profile`);
    const profileHtml = await profile.text();
    assert.equal(profile.status, 200);
    assert.match(profileHtml, /Alex Morgan/);
    assert.match(profileHtml, /alex\.morgan@example\.com/);

    const about = await fetch(`${baseUrl}/about`);
    const aboutHtml = await about.text();
    assert.equal(about.status, 200);
    assert.match(aboutHtml, /OpenAI Codex/);
  });
});

test('unknown routes return a branded 404 page', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/missing`);
    const html = await response.text();
    assert.equal(response.status, 404);
    assert.match(html, /Page not found/);
  });
});
