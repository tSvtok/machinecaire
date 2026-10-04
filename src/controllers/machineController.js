const Machine = require('../models/Machine');
const Signalement = require('../models/Signalement');
const AppError = require('../utils/AppError');

exports.create = async (req, res, next) => {
  try {
    const { reference, name, atelier, etat } = req.body;
    if (!reference || !name || !atelier) {
      return next(new AppError('Référence, nom et atelier sont requis.', 400));
    }
    const machine = await Machine.create({ reference, name, atelier, etat });
    res.status(201).json({ status: 'success', data: { machine } });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.atelier) filter.atelier = req.query.atelier;
    if (req.query.etat) filter.etat = req.query.etat;
    const machines = await Machine.find(filter);
    res.json({ status: 'success', results: machines.length, data: { machines } });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return next(new AppError('Machine non trouvée.', 404));
    res.json({ status: 'success', data: { machine } });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!machine) return next(new AppError('Machine non trouvée.', 404));
    res.json({ status: 'success', data: { machine } });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return next(new AppError('Machine non trouvée.', 404));
    const linked = await Signalement.findOne({ machine: machine._id });
    if (linked) {
      return next(new AppError('Impossible de supprimer : des signalements sont liés à cette machine.', 409));
    }
    await Machine.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};

exports.getHistory = async (req, res, next) => {
  try {
    const signalements = await Signalement.find({ machine: req.params.id }).populate('declarePar', 'name email').sort({ createdAt: -1 });
    res.json({ status: 'success', results: signalements.length, data: { signalements } });
  } catch (err) { next(err); }
};
