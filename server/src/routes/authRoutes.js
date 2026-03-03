const { Router } = require('express');
const auth = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth.middleware');
const { createRateLimiter } = require('../middlewares/rateLimiter');
const { loginValidation, refreshTokenValidation, verifyTokenValidation } = require('../middlewares/validation.middleware');

const router = Router();

const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Qua nhieu yeu cau dang nhap. Vui long thu lai sau 15 phut',
});

const verifyLimiter = createRateLimiter({
    windowMs: 60_000,
    max: 30,
    message: 'Qua nhieu yeu cau verify',
});

router.post('/login', authLimiter, loginValidation, auth.login);
router.post('/logout', authenticate, auth.logout);
router.post('/logout-all', authenticate, auth.logoutAll);
router.get('/me', authenticate, auth.getCurrentUser);
router.post('/verify', verifyLimiter, verifyTokenValidation, auth.verifyToken);
router.post('/refresh', authLimiter, refreshTokenValidation, auth.refreshToken);
router.get('/health', auth.healthCheck);

module.exports = router;
