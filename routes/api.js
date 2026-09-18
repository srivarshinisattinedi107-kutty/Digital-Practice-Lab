const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { saveProgress, getUserProgress } = require('../controllers/LabController');

// Authentication Endpoints
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// Lab Progress Endpoints
router.post('/progress/save', saveProgress);
router.get('/progress/:userId', getUserProgress);

module.exports = router;