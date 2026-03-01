const express = require('express');
const { getTest } = require('../controllers/test');

const router = express.Router();

router.get('/', getTest);

module.exports = router;
