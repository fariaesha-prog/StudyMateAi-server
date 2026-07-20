"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.error('ERROR:', err); // always log, dev or prod
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        // Production Mode
        if (err.code === 11000) {
            res.status(400).json({ status: 'fail', message: 'Email address already exists.' });
            return;
        }
        if (err.isOperational) {
            res.status(err.statusCode).json({ status: 'fail', message: err.message });
            return;
        }
        res.status(500).json({ status: 'error', message: 'Something went completely wrong!' });
    }
};
exports.errorHandler = errorHandler;
