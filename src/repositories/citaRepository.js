const pool = require('../config/database');

async function listar(filtros = {}) {
    let sql = `
        SELECT
            c.id,
            c.paciente_id,
            CONCAT(p.nombre, ' ', p.apellido) AS paciente,
            c.doctor_id,
            CONCAT(d.nombre, ' ', d.apellido) AS doctor,
            d.especialidad,
            c.fecha_hora_inicio,
            c.fecha_hora_fin,
            c.motivo,
            c.estado
        FROM citas c
        INNER JOIN pacientes p ON p.id = c.paciente_id
        INNER JOIN doctores d ON d.id = c.doctor_id
        WHERE 1 = 1
    `;

    const params = [];

    if (filtros.doctor_id) {
        sql += ' AND c.doctor_id = ?';
        params.push(filtros.doctor_id);
    }

    if (filtros.paciente_id) {
        sql += ' AND c.paciente_id = ?';
        params.push(filtros.paciente_id);
    }

    if (filtros.desde) {
        sql += ' AND c.fecha_hora_inicio >= ?';
        params.push(filtros.desde);
    }

    if (filtros.hasta) {
        sql += ' AND c.fecha_hora_inicio <= ?';
        params.push(filtros.hasta);
    }

    sql += ' ORDER BY c.fecha_hora_inicio';

    const [rows] = await pool.query(sql, params);
    return rows;
}

async function obtenerPorId(id) {
    const [rows] = await pool.query(`
        SELECT
            c.id,
            c.paciente_id,
            CONCAT(p.nombre, ' ', p.apellido) AS paciente,
            c.doctor_id,
            CONCAT(d.nombre, ' ', d.apellido) AS doctor,
            d.especialidad,
            c.fecha_hora_inicio,
            c.fecha_hora_fin,
            c.motivo,
            c.estado
        FROM citas c
        INNER JOIN pacientes p ON p.id = c.paciente_id
        INNER JOIN doctores d ON d.id = c.doctor_id
        WHERE c.id = ?
    `, [id]);

    return rows[0] || null;
}

async function crear(cita) {
    const [result] = await pool.query(`
        INSERT INTO citas (
            paciente_id,
            doctor_id,
            fecha_hora_inicio,
            fecha_hora_fin,
            motivo
        )
        VALUES (?, ?, ?, ?, ?)
    `, [
        cita.paciente_id,
        cita.doctor_id,
        cita.fecha_hora_inicio,
        cita.fecha_hora_fin,
        cita.motivo
    ]);

    return obtenerPorId(result.insertId);
}

async function actualizar(id, cita) {
    const [result] = await pool.query(`
        UPDATE citas
        SET
            paciente_id = ?,
            doctor_id = ?,
            fecha_hora_inicio = ?,
            fecha_hora_fin = ?,
            motivo = ?
        WHERE id = ?
    `, [
        cita.paciente_id,
        cita.doctor_id,
        cita.fecha_hora_inicio,
        cita.fecha_hora_fin,
        cita.motivo,
        id
    ]);

    if (result.affectedRows === 0) {
        return null;
    }

    return obtenerPorId(id);
}

async function existePaciente(id) {
    const [rows] = await pool.query(
        'SELECT id FROM pacientes WHERE id = ?',
        [id]
    );

    return rows.length > 0;
}

async function existeDoctor(id) {
    const [rows] = await pool.query(
        'SELECT id FROM doctores WHERE id = ?',
        [id]
    );

    return rows.length > 0;
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    existePaciente,
    existeDoctor
};
