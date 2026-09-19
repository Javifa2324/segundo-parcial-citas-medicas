const pool = require('../config/database');

async function listar() {
    const [rows] = await pool.query(`
        SELECT id, nombre, apellido, telefono, correo
        FROM pacientes
        ORDER BY apellido, nombre
    `);

    return rows;
}

module.exports = {
    listar
};
