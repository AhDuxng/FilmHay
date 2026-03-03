class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Thong bao loi
     * @param {boolean} [isOperational=true] - Loi du kien (true) hay loi he thong (false)
     */
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = 'ApiError';

        // Giu nguyen stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Yeu cau khong hop le') {
        return new ApiError(400, message);
    }

    static notFound(message = 'Khong tim thay') {
        return new ApiError(404, message);
    }

    static tooManyRequests(message = 'Qua nhieu yeu cau, vui long thu lai sau') {
        return new ApiError(429, message);
    }

    static internal(message = 'Loi he thong') {
        return new ApiError(500, message, false);
    }

    static badGateway(message = 'Loi ket noi den nguon du lieu') {
        return new ApiError(502, message);
    }
}

module.exports = ApiError;
