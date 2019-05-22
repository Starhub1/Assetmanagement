
const express = require('express');
const router = express.Router();
const AssetsController = require('./controllers/assets.controller');
const ReportController = require('./controllers/report.controller');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// Logout
router.get('/home/logout', AssetsController.logout);

router.get('/', forwardAuthenticated,AssetsController.showLoginPage);

router.post('/',passport.authenticate('local',{ failureRedirect: '/' }),AssetsController.showAssets);

router.get('/home',ensureAuthenticated, AssetsController.showAssets);

router.get('/getAllAssets',ensureAuthenticated, AssetsController.getAssets);

router.get('/home/:id/history',ensureAuthenticated,AssetsController.showAssetHistory);

router.get('/home/assignmentHistory',ensureAuthenticated,AssetsController.showAssignmentHistory);

//router.get('/seed',AssetsController.seedAssets);

router.get('/home/create',ensureAuthenticated,AssetsController.showCreate);

router.post('/home/create',ensureAuthenticated,AssetsController.processCreate);

router.get('/home/:id/edit',ensureAuthenticated,AssetsController.showEdit);

router.post('/home/:id',ensureAuthenticated,AssetsController.processEdit);

router.get('/home/:id', ensureAuthenticated,AssetsController.showSingle);

router.get('/home/:id/delete',ensureAuthenticated,AssetsController.deleteAsset);

router.post('/home/:id/assignNewOwner',ensureAuthenticated,AssetsController.assignNewOwner);

router.get('/home/:id/return',ensureAuthenticated,AssetsController.returnAsset);


module.exports = router;