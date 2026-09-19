const pacienteService = require('../services/pacienteService');

async function listar(req, res) {
    try {
        const pacientes = await pacienteService.listarPacientes();

        res.status(200).json(pacientes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al obtener los pacientes'
        });
    }
}

module.exports = {
    listar
};
