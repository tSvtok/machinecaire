const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/auth.middleware');
const machineController = require('../controllers/machineController');

router.post('/', protect, machineController.create);
router.get('/', protect, machineController.getAll);
router.get('/:id', protect, machineController.getOne);
router.put('/:id', protect, machineController.update);
router.delete('/:id', protect, machineController.delete);
router.get('/:id/signalements', protect, machineController.getHistory);

module.exports = router;
