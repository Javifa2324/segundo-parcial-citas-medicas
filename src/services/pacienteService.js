const pacienteRepository = require('../repositories/pacienteRepository');

async function listarPacientes() {
    return pacienteRepository.listar();
}

module.exports = {
    listarPacientes
};
