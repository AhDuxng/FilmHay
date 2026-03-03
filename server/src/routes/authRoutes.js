const { Router } = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth.middleware');
const { createRateLimiter } = require('../middlewares/rateLimiter');
const { 
    loginValidation, 
    refreshTokenValidation, 
    verifyTokenValidation 
} = require('../middlewares/validation.middleware');

const router = Router();

// Rate limiter cho auth endpoints
const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 phut
    max: 5, // 5 requests
    message: 'Qua nhieu yeu cau dang nhap. Vui long thu lai sau 15 phut',
});

const verifyLimiter = createRateLimiter({
    windowMs: 60 * 1000, // 1 phut
    max: 30, // 30 requests
    message: 'Qua nhieu yeu cau verify',
});

/**
 * @route   POST /api/auth/login
 * @desc    Dang nhap
 * @access  Public 
 */
router.post('/login', authLimiter, loginValidation, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Dang xuat - revoke tokens
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/logout-all
 * @desc    Dang xuat tat ca devices
 * @access  Private
 */
router.post('/logout-all', authenticate, authController.logoutAll);

/**
 * @route   GET /api/auth/me
 * @desc    Lay thong tin user hien tai
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify access token
 * @access  Public
 */
router.post('/verify', verifyLimiter, verifyTokenValidation, authController.verifyToken);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token bang refresh token
 * @access  Public (can refresh token)
 */
router.post('/refresh', authLimiter, refreshTokenValidation, authController.refreshToken);

/**
 * @route   GET /api/auth/health
 * @desc    Health check
 * @access  Public
 */
router.get('/health', authController.healthCheck);

module.exports = router;
