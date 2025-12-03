const express = require('express');
const siteController = require('../controllers/siteController');

const router = express.Router();

router.get('/hero', siteController.getHeroSettings);
router.put('/hero', siteController.heroValidators, siteController.updateHeroSettings);

module.exports = router;

