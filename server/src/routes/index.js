const { Router } = require('express');
const movieRoutes = require('./movieRoutes');
const authRoutes = require('./authRoutes');
const { healthCheck } = require('../controllers/movieController');

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);

module.exports = router;
