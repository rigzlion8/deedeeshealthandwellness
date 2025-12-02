const express = require('express');

const router = express.Router();

const SAMPLE_USERS = [
  { _id: 'user-001', name: 'Dee Dee', email: 'hello@deedeeshealthandwellness.com', role: 'admin' },
  { _id: 'user-002', name: 'Wellness Coach', email: 'coach@deedeeshealthandwellness.com', role: 'user' },
];

router.get('/', (req, res) => {
  res.json(SAMPLE_USERS);
});

router.get('/:id', (req, res) => {
  const user = SAMPLE_USERS.find((item) => item._id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

router.all('*', (req, res) => {
  res.status(501).json({
    error: 'User route not implemented for this method or path',
    path: req.originalUrl,
    method: req.method,
  });
});

module.exports = router;

