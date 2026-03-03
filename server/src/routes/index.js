const { Router } = require('express');
const movieRoutes = require('./movieRoutes');
const authRoutes = require('./authRoutes');
const { healthCheck } = require('../controllers/movieController');

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Auth routes - Khong can authentication
router.use('/auth', authRoutes);

// Movie routes - Can authentication (se them middleware sau)
router.use('/movies', movieRoutes);

module.exports = router;
