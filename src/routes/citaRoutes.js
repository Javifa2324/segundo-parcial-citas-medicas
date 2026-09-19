const express = require('express');
const citaController = require('../controllers/citaController');

const router = express.Router();

router.get('/', citaController.listar);
router.post('/', citaController.crear);
router.get('/:id', citaController.obtenerPorId);
router.put('/:id', citaController.actualizar);
router.patch('/:id/estado', citaController.cambiarEstado);

module.exports = router;
