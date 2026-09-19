const citaRepository = require('../repositories/citaRepository');

function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}

function validarId(valor, nombre) {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        throw crearError(`${nombre} debe ser un entero positivo`, 400);
    }

    return id;
}

function normalizarFecha(valor) {
    if (typeof valor !== 'string') {
        throw crearError('Formato de fecha/hora inválido', 400);
    }

    const match = valor.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
    );

    if (!match) {
        throw crearError(
            'La fecha/hora debe usar formato YYYY-MM-DD HH:mm:ss',
            400
        );
    }

    const [, anio, mes, dia, hora, minuto, segundo = '00'] = match;

    const fecha = new Date(Date.UTC(
        Number(anio),
        Number(mes) - 1,
        Number(dia),
        Number(hora),
        Number(minuto),
        Number(segundo)
    ));

    if (
        fecha.getUTCFullYear() !== Number(anio) ||
        fecha.getUTCMonth() !== Number(mes) - 1 ||
        fecha.getUTCDate() !== Number(dia) ||
        fecha.getUTCHours() !== Number(hora) ||
        fecha.getUTCMinutes() !== Number(minuto)
    ) {
        throw crearError('Fecha/hora inválida', 400);
    }

    return `${anio}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
}

function normalizarFiltroFecha(valor, finDelDia = false) {
    if (!valor) {
        return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return `${valor} ${finDelDia ? '23:59:59' : '00:00:00'}`;
    }

    return normalizarFecha(valor);
}

async function validarDatosCita(datos) {
    if (
        datos.paciente_id === undefined ||
        datos.doctor_id === undefined ||
        !datos.fecha_hora_inicio ||
        !datos.fecha_hora_fin ||
        !datos.motivo
    ) {
        throw crearError(
            'paciente_id, doctor_id, fecha_hora_inicio, fecha_hora_fin y motivo son obligatorios',
            400
        );
    }

    const paciente_id = validarId(datos.paciente_id, 'paciente_id');
    const doctor_id = validarId(datos.doctor_id, 'doctor_id');

    const fecha_hora_inicio = normalizarFecha(datos.fecha_hora_inicio);
    const fecha_hora_fin = normalizarFecha(datos.fecha_hora_fin);

    if (fecha_hora_fin <= fecha_hora_inicio) {
        throw crearError(
            'fecha_hora_fin debe ser posterior a fecha_hora_inicio',
            400
        );
    }

    const motivo = String(datos.motivo).trim();

    if (!motivo) {
        throw crearError('El motivo es obligatorio', 400);
    }

    if (!(await citaRepository.existePaciente(paciente_id))) {
        throw crearError('Paciente no encontrado', 404);
    }

    if (!(await citaRepository.existeDoctor(doctor_id))) {
        throw crearError('Doctor no encontrado', 404);
    }

    return {
        paciente_id,
        doctor_id,
        fecha_hora_inicio,
        fecha_hora_fin,
        motivo
    };
}

async function listarCitas(filtros) {
    const filtrosValidos = {};

    if (filtros.doctor_id) {
        filtrosValidos.doctor_id = validarId(
            filtros.doctor_id,
            'doctor_id'
        );
    }

    if (filtros.paciente_id) {
        filtrosValidos.paciente_id = validarId(
            filtros.paciente_id,
            'paciente_id'
        );
    }

    if (filtros.desde) {
        filtrosValidos.desde = normalizarFiltroFecha(filtros.desde);
    }

    if (filtros.hasta) {
        filtrosValidos.hasta = normalizarFiltroFecha(
            filtros.hasta,
            true
        );
    }

    return citaRepository.listar(filtrosValidos);
}

async function obtenerCita(id) {
    id = validarId(id, 'id');

    const cita = await citaRepository.obtenerPorId(id);

    if (!cita) {
        throw crearError('Cita no encontrada', 404);
    }

    return cita;
}

async function crearCita(datos) {
    const cita = await validarDatosCita(datos);
    return citaRepository.crear(cita);
}

async function actualizarCita(id, datos) {
    id = validarId(id, 'id');

    const existente = await citaRepository.obtenerPorId(id);

    if (!existente) {
        throw crearError('Cita no encontrada', 404);
    }

    const cita = await validarDatosCita(datos);

    return citaRepository.actualizar(id, cita);
}

module.exports = {
    listarCitas,
    obtenerCita,
    crearCita,
    actualizarCita
};
