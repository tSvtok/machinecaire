const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Accès refusé. Token manquant.', 401));
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    next(new AppError('Token invalide ou expiré.', 401));
  }
};

module.exports = { protect };
