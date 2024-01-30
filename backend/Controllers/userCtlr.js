const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
  console.log('end point hit');
  res.send('hi');
});

module.exports = router;
