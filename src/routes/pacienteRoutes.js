const express = require('express');
const pacienteController = require('../controllers/pacienteController');

const router = express.Router();

router.get('/', pacienteController.listar);

module.exports = router;
