const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/auth.middleware');
const SignalementController = require('../controllers/signalementController');

router.post('/', protect, SignalementController.create);
router.get('/', protect, SignalementController.getAll);
router.get('/:id', protect, SignalementController.getOne);
router.put('/:id', protect, SignalementController.update);
router.post('/:id/resolve', protect, SignalementController.resolve);

module.exports = router;