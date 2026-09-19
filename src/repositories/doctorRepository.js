const pool = require('../config/database');

async function listar() {
    const [rows] = await pool.query(`
        SELECT id, nombre, apellido, especialidad, telefono, correo
        FROM doctores
        ORDER BY apellido, nombre
    `);

    return rows;
}

module.exports = {
    listar
};
