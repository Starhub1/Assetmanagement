
const express = require('express');
const router = express.Router();
const AssetsController = require('./controllers/assets.controller');


router.get('/', AssetsController.showAssets);

router.get('/:id/history',AssetsController.showAssetHistory);

router.get('/assignmentHistory',AssetsController.showAssignmentHistory);

//router.get('/seed',AssetsController.seedAssets);

router.get('/create',AssetsController.showCreate);

router.post('/create',AssetsController.processCreate);

router.get('/:id/edit',AssetsController.showEdit);

router.post('/:id',AssetsController.processEdit);

router.get('/:id', AssetsController.showSingle);

router.get('/:id/delete',AssetsController.deleteAsset);

router.post('/:id/assignNewOwner',AssetsController.assignNewOwner);


module.exports = router;