
const express = require('express');
const router = express.Router();
const AssetsController = require('./controllers/assets.controller');


router.get('/', AssetsController.showAssets);

router.get('/seed',AssetsController.seedAssets);

router.get('/create',AssetsController.showCreate);

router.post('/create',AssetsController.processCreate);

router.get('/:IMEI/edit',AssetsController.showEdit);

router.post('/:IMEI',AssetsController.processEdit);

router.get('/:IMEI', AssetsController.showSingle);

router.get('/:IMEI/delete',AssetsController.deleteAsset);

router.post('/:IMEI/assign',AssetsController.assignNewOwner)



module.exports = router;