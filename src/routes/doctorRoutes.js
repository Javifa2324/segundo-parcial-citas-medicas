const express = require('express');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.get('/', doctorController.listar);

module.exports = router;
