const citaService = require('../services/citaService');

function manejarError(error, res) {
    console.error(error);

    res.status(error.statusCode || 500).json({
        error: error.statusCode
            ? error.message
            : 'Error interno del servidor'
    });
}

async function listar(req, res) {
    try {
        const citas = await citaService.listarCitas(req.query);
        res.status(200).json(citas);
    } catch (error) {
        manejarError(error, res);
    }
}

async function obtenerPorId(req, res) {
    try {
        const cita = await citaService.obtenerCita(req.params.id);
        res.status(200).json(cita);
    } catch (error) {
        manejarError(error, res);
    }
}

async function crear(req, res) {
    try {
        const cita = await citaService.crearCita(req.body);
        res.status(201).json(cita);
    } catch (error) {
        manejarError(error, res);
    }
}

async function actualizar(req, res) {
    try {
        const cita = await citaService.actualizarCita(
            req.params.id,
            req.body
        );

        res.status(200).json(cita);
    } catch (error) {
        manejarError(error, res);
    }
}


async function cambiarEstado(req, res) {
    try {
        const cita = await citaService.cambiarEstadoCita(
            req.params.id,
            req.body.estado
        );

        res.status(200).json(cita);
    } catch (error) {
        manejarError(error, res);
    }
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    cambiarEstado
};
