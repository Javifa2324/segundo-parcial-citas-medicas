SET NAMES utf8mb4;

INSERT INTO pacientes (nombre, apellido, telefono, correo) VALUES
('Juan', 'Pérez', '5555-1001', 'juan.perez@example.com'),
('María', 'López', '5555-1002', 'maria.lopez@example.com'),
('Carlos', 'Ramírez', '5555-1003', 'carlos.ramirez@example.com'),
('Ana', 'García', '5555-1004', 'ana.garcia@example.com');

INSERT INTO doctores (nombre, apellido, especialidad, telefono, correo) VALUES
('Luis', 'Gómez', 'Medicina General', '5555-2001', 'luis.gomez@clinica.test'),
('Andrea', 'Morales', 'Pediatría', '5555-2002', 'andrea.morales@clinica.test'),
('Roberto', 'Castillo', 'Cardiología', '5555-2003', 'roberto.castillo@clinica.test');

INSERT INTO citas (
    paciente_id,
    doctor_id,
    fecha_hora_inicio,
    fecha_hora_fin,
    motivo,
    estado
) VALUES
(
    1,
    1,
    '2026-09-22 09:00:00',
    '2026-09-22 09:30:00',
    'Consulta general',
    'confirmada'
),
(
    2,
    2,
    '2026-09-22 10:00:00',
    '2026-09-22 10:45:00',
    'Control pediátrico',
    'pendiente'
),
(
    3,
    3,
    '2026-09-23 14:00:00',
    '2026-09-23 14:30:00',
    'Evaluación cardiológica',
    'pendiente'
);
