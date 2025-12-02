const express = require('express');
const { adminAuth } = require('../middleware/auth');
const siteController = require('../controllers/siteController');

const router = express.Router();

router.get('/hero', siteController.getHeroSettings);
router.put('/hero', adminAuth, siteController.heroValidators, siteController.updateHeroSettings);

module.exports = router;

