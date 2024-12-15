// routes/gameHistory.js
const express = require('express');
const router = express.Router();
const checkPlayerExist = require('../middleware/checkPlayerExist');
const gameHistoryController = require('../controllers/gameHistoryController');

router.post('/getHistory', checkPlayerExist, gameHistoryController);

module.exports = router;
