const doctorService = require('../services/doctorService');

async function listar(req, res) {
    try {
        const doctores = await doctorService.listarDoctores();

        res.status(200).json(doctores);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Error al obtener los doctores'
        });
    }
}

module.exports = {
    listar
};
