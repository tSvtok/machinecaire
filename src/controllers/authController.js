const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return next(new AppError('Email, mot de passe et nom sont requis.', 400));
    }
    const user = await User.create({ email, password, name });
    res.status(201).json({ status: 'success', token: signToken(user._id), data: { user: { id: user._id, email: user.email, name: user.name } } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Email et mot de passe requis.', 400));
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Email ou mot de passe incorrect.', 401));
    }
    res.json({ status: 'success', token: signToken(user._id) });
  } catch (err) { next(err); }
};
