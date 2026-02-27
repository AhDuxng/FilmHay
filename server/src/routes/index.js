const { Router } = require('express');
const movieRoutes = require('./movieRoutes');
const { healthCheck } = require('../controllers/movieController');

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// Movie routes
router.use('/movies', movieRoutes);

module.exports = router;
