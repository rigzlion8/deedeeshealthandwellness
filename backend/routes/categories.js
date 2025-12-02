const express = require('express');

const router = express.Router();

const SAMPLE_CATEGORIES = [
  {
    _id: 'herbal',
    name: 'Herbal Remedies',
    description: 'Roots, leaves, and blends for everyday balance.',
    productCount: 12,
  },
  {
    _id: 'skincare',
    name: 'Skincare Rituals',
    description: 'Botanical skincare crafted for all skin types.',
    productCount: 9,
  },
  {
    _id: 'supplements',
    name: 'Supplements',
    description: 'Nutrition-packed powders and capsules.',
    productCount: 7,
  },
];

router.get('/', (req, res) => {
  res.json(SAMPLE_CATEGORIES);
});

module.exports = router;

