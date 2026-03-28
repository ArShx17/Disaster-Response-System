const express = require('express');
const router = express.Router();
const { getDisasters, addDisaster } = require('../controllers/disasterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getDisasters)
    .post(protect, addDisaster);

module.exports = router;
