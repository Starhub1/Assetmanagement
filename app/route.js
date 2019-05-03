const express = require('express');
const router = express.Router();
const mainController = require('./controllers/maincontroler');
const eventsController = require('./controllers/events.controller');

router.get('/', mainController.showHome);

router.get('/events', eventsController.showEvents);


router.get('/events/seed',eventsController.seedEvents);









router.get('/events/:slug', eventsController.showSingle);

module.exports = router;