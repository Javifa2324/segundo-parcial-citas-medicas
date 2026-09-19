const doctorRepository = require('../repositories/doctorRepository');

async function listarDoctores() {
    return doctorRepository.listar();
}

module.exports = {
    listarDoctores
};
