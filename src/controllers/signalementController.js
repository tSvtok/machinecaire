const Signalement = require('../models/Signalement');
const Machine = require('../models/Machine');
const AppError = require('../utils/AppError');

const VALID_TRANSITIONS = {
  ouvert: ['en_cours'],
  en_cours: ['resolu'],
  resolu: []
};

exports.create = async (req, res, next) => {
  try {
    const { machine, description } = req.body;
    if (!machine || !description || description.trim() === '') {
      return next(new AppError('Machine et description requis. La description ne peut pas être vide.', 400));
    }
    const machineDoc = await Machine.findById(machine);
    if (!machineDoc) return next(new AppError('Machine inexistante.', 404));
    const signalement = await Signalement.create({
      machine,
      description: description.trim(),
      declarePar: req.user.id
    });
    await signalement.populate('machine declarePar', 'name reference email');
    res.status(201).json({ status: 'success', data: { signalement } });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.machine) filter.machine = req.query.machine;
    if (req.query.statut) filter.statut = req.query.statut;
    const signalements = await Signalement.find(filter).populate('machine declarePar', 'name reference email');
    res.json({ status: 'success', results: signalements.length, data: { signalements } });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const signalement = await Signalement.findById(req.params.id).populate('machine declarePar', 'name reference email');
    if (!signalement) return next(new AppError('Signalement non trouvé.', 404));
    res.json({ status: 'success', data: { signalement } });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { description, statut } = req.body;
    const signalement = await Signalement.findById(req.params.id);
    if (!signalement) return next(new AppError('Signalement non trouvé.', 404));

    if (description !== undefined) {
      if (description.trim() === '') return next(new AppError('La description ne peut pas être vide.', 400));
      signalement.description = description.trim();
    }

    if (statut) {
      const validStatuses = ['ouvert', 'en_cours', 'resolu'];
      if (!validStatuses.includes(statut)) return next(new AppError('Statut inconnu.', 400));
      if (!VALID_TRANSITIONS[signalement.statut].includes(statut)) {
        return next(new AppError(`Transition invalide : ${signalement.statut} → ${statut}.`, 400));
      }
      signalement.statut = statut;
    }

    await signalement.save();
    await signalement.populate('machine declarePar', 'name reference email');
    res.json({ status: 'success', data: { signalement } });
  } catch (err) { next(err); }
};

exports.resolve = async (req, res, next) => {
  try {
    const { noteResolution } = req.body;
    if (!noteResolution || noteResolution.trim() === '') {
      return next(new AppError('Note de résolution obligatoire.', 400));
    }
    const signalement = await Signalement.findById(req.params.id);
    if (!signalement) return next(new AppError('Signalement non trouvé.', 404));
    if (signalement.statut === 'resolu') {
      return next(new AppError('Signalement déjà résolu.', 400));
    }
    signalement.statut = 'resolu';
    signalement.noteResolution = noteResolution.trim();
    signalement.dateResolution = new Date();
    await signalement.save();
    await signalement.populate('machine declarePar', 'name reference email');
    res.json({ status: 'success', data: { signalement } });
  } catch (err) { next(err); }
};
