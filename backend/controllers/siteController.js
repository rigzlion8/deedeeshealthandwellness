const { body, validationResult } = require('express-validator');
const SiteSettings = require('../models/SiteSettings');

exports.heroValidators = [
  body('title').optional().isString().trim(),
  body('subtitle').optional().isString().trim(),
  body('ctaText').optional().isString().trim(),
  body('ctaLink').optional().isString().trim(),
  body('imageUrl').optional().isString().trim(),
  body('stats').optional().isArray(),
];

exports.getHeroSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.getOrCreate();
    res.json(settings.hero);
  } catch (error) {
    next(error);
  }
};

exports.updateHeroSettings = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settings = await SiteSettings.getOrCreate();
    settings.hero = {
      ...settings.hero.toObject(),
      ...req.body,
    };
    settings.updatedBy = req.user?._id;
    await settings.save();

    res.json(settings.hero);
  } catch (error) {
    next(error);
  }
};

