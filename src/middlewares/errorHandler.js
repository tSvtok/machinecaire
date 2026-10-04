const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ status: 'fail', message: messages.join('. ') });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ status: 'fail', message: `${field} déjà utilisé.` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ status: 'fail', message: 'ID invalide.' });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ status: err.status, message: err.message });
  }

  res.status(err.statusCode).json({ status: 'error', message: err.message });
};

module.exports = errorHandler;
