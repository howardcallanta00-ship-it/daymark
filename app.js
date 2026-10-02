'use strict';

const path = require('node:path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ quiet: true });

const createRoutes = require('./routes');

function getDefaultModels() {
  if (process.env.DEMO_MODE === 'true') {
    return require('./data/demoRepositories');
  }

  return {
    taskModel: require('./models/TaskModel'),
    userModel: require('./models/UserModel')
  };
}

function createApp(options = {}) {
  const app = express();
  const models = options.models || getDefaultModels();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.disable('x-powered-by');

  app.use((request, response, next) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', createRoutes(models));

  app.use((request, response) => {
    response.status(404).render('error', {
      pageTitle: 'Page not found',
      activePath: request.path,
      statusCode: 404,
      message: 'The page you are looking for does not exist.'
    });
  });

  app.use((error, request, response, next) => {
    if (response.headersSent) return next(error);

    console.error(error);
    response.status(500).render('error', {
      pageTitle: 'Something went wrong',
      activePath: request.path,
      statusCode: 500,
      message: process.env.NODE_ENV === 'development'
        ? error.message
        : 'We could not load this page. Please try again in a moment.'
    });
  });

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp();
  app.listen(port, () => {
    const mode = process.env.DEMO_MODE === 'true' ? 'preview data' : 'MySQL';
    console.log(`Daymark is running at http://localhost:${port} (${mode})`);
  });
}

module.exports = createApp;
