class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(msg = 'Yeu cau khong hop le') { return new ApiError(400, msg); }
    static unauthorized(msg = 'Chua xac thuc') { return new ApiError(401, msg); }
    static forbidden(msg = 'Khong co quyen truy cap') { return new ApiError(403, msg); }
    static notFound(msg = 'Khong tim thay') { return new ApiError(404, msg); }
    static tooManyRequests(msg = 'Qua nhieu yeu cau') { return new ApiError(429, msg); }
    static internal(msg = 'Loi he thong') { return new ApiError(500, msg, false); }
    static badGateway(msg = 'Loi ket noi den nguon du lieu') { return new ApiError(502, msg); }
}

module.exports = ApiError;
