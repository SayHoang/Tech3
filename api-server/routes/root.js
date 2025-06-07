// routes/root.js

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API Server is running' });
});

module.exports = router;