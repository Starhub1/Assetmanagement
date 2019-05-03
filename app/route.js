
const express = require('express');
const router = express.Router();
const eventsController = require('./controllers/events.controller');


router.get('/', eventsController.showEvents);

router.get('/seed',eventsController.seedEvents);

router.post('/create',eventsController.showCreate);

router.get('/:slug', eventsController.showSingle);



module.exports = router;