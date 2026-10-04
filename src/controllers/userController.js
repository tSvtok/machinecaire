const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return next(new AppError('Utilisateur non trouvé.', 404));
    res.json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true }).select('-password');
    if (!user) return next(new AppError('Utilisateur non trouvé.', 404));
    res.json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};
