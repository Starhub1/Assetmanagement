
const express = require('express');
const router = express.Router();
const AssetsController = require('./controllers/assets.controller');
const passport = require('passport');
const passportStrategy = require('./config/passport.config');


router.get('/', AssetsController.showLoginPage);

router.post('/',passport.authenticate('local',{ failureRedirect: '/' }),AssetsController.showAssets);

router.get('/home', AssetsController.showAssets);

router.get('/home/:id/history',AssetsController.showAssetHistory);

router.get('/home/assignmentHistory',AssetsController.showAssignmentHistory);

//router.get('/seed',AssetsController.seedAssets);

router.get('/home/create',AssetsController.showCreate);

router.post('/home/create',AssetsController.processCreate);

router.get('/home/:id/edit',AssetsController.showEdit);

router.post('/home/:id',AssetsController.processEdit);

router.get('/home/:id', AssetsController.showSingle);

router.get('/home/:id/delete',AssetsController.deleteAsset);

router.post('/home/:id/assignNewOwner',AssetsController.assignNewOwner);


module.exports = router;