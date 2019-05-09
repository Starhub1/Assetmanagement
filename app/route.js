
const express = require('express');
const router = express.Router();
const AssetsController = require('./controllers/assets.controller');


router.get('/', AssetsController.showAssets);

router.get('/:AssetSerial/history',AssetsController.showAssetHistory);

router.get('/assignmentHistory',AssetsController.showAssignmentHistory);

router.get('/seed',AssetsController.seedAssets);

router.get('/create',AssetsController.showCreate);

router.post('/create',AssetsController.processCreate);

router.get('/:AssetSerial/edit',AssetsController.showEdit);

router.post('/:AssetSerial',AssetsController.processEdit);

router.get('/:AssetSerial', AssetsController.showSingle);

router.get('/:AssetSerial/delete',AssetsController.deleteAsset);

router.post('/:AssetSerial/assignNewOwner',AssetsController.assignNewOwner);




module.exports = router;