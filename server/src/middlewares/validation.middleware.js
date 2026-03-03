const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const handleValidationErrors = (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
};

const loginValidation = [
    body('identifier')
        .trim()
        .notEmpty().withMessage('Username hoac email la bat buoc')
        .isLength({ min: 3, max: 255 }).withMessage('Username/email phai tu 3-255 ky tu'),
    body('password')
        .notEmpty().withMessage('Mat khau la bat buoc')
        .isLength({ min: 6 }).withMessage('Mat khau phai co it nhat 6 ky tu'),
    handleValidationErrors,
];

const refreshTokenValidation = [
    body('refreshToken')
        .optional()
        .isString().withMessage('Refresh token phai la chuoi'),
    handleValidationErrors,
];

const verifyTokenValidation = [
    body('token')
        .optional()
        .isString().withMessage('Token phai la chuoi'),
    handleValidationErrors,
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Mat khau hien tai la bat buoc'),
    body('newPassword')
        .notEmpty().withMessage('Mat khau moi la bat buoc')
        .isLength({ min: 8 }).withMessage('Mat khau moi phai co it nhat 8 ky tu')
        .custom((val, { req }) => {
            if (val === req.body.currentPassword) throw new Error('Mat khau moi phai khac mat khau hien tai');
            return true;
        }),
    body('confirmPassword')
        .notEmpty().withMessage('Xac nhan mat khau la bat buoc')
        .custom((val, { req }) => {
            if (val !== req.body.newPassword) throw new Error('Xac nhan mat khau khong khop');
            return true;
        }),
    handleValidationErrors,
];

module.exports = {
    loginValidation,
    refreshTokenValidation,
    verifyTokenValidation,
    changePasswordValidation,
    handleValidationErrors,
};
