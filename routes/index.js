'use strict';

const express = require('express');
const createPageController = require('../controllers/pageController');

const safe = (handler) => (request, response, next) => {
  Promise.resolve(handler(request, response, next)).catch(next);
};

function createRoutes(models) {
  const router = express.Router();
  const pages = createPageController(models);

  router.get('/', safe(pages.welcome));
  router.get('/tasks', safe(pages.tasks));
  router.get('/profile', safe(pages.profile));
  router.get('/about', pages.about);

  return router;
}

module.exports = createRoutes;
