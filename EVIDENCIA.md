# Evidencia - Segundo Parcial

## Sistema de Citas Médicas

Proyecto desarrollado para Análisis de Sistemas II.

## Repositorio

https://github.com/Javifa2324/segundo-parcial-citas-medicas

## Pull Requests

1. Docker + MySQL + esquema
   https://github.com/Javifa2324/segundo-parcial-citas-medicas/pull/1

2. API REST de citas
   https://github.com/Javifa2324/segundo-parcial-citas-medicas/pull/2

3. Validación de conflictos y estados
   https://github.com/Javifa2324/segundo-parcial-citas-medicas/pull/3

4. FullCalendar interactivo
   https://github.com/Javifa2324/segundo-parcial-citas-medicas/pull/4

## Docker y MySQL

MySQL se ejecuta en Docker utilizando la imagen `mysql:8.4`.

Se utiliza un volumen persistente para conservar los datos.

Datos semilla iniciales:

- 4 pacientes
- 3 doctores
- 3 citas

Tablas:

- pacientes
- doctores
- citas

La salida de Docker se encuentra en:

`evidencia/docker-ps.txt`

## API REST

Endpoints implementados:

- GET `/api/health`
- GET `/api/pacientes`
- GET `/api/doctores`
- GET `/api/citas`
- GET `/api/citas/{id}`
- POST `/api/citas`
- PUT `/api/citas/{id}`
- PATCH `/api/citas/{id}/estado`

Se verificaron respuestas:

- 200 OK
- 201 Created
- 400 Bad Request
- 404 Not Found
- 409 Conflict

## Validación de conflicto

Se verificó en el servidor la prevención de doble reserva para un mismo doctor.

Respuesta obtenida:

`HTTP/1.1 409 Conflict`

Mensaje:

`El doctor ya tiene una cita activa en ese horario`

## Estados de cita

Estados soportados:

- pendiente
- confirmada
- cancelada
- atendida

Los cambios se almacenan en MySQL.

## FullCalendar

La interfaz permite:

- vista mensual;
- vista semanal;
- crear citas;
- ver detalle;
- filtrar por doctor;
- representar estados mediante colores;
- reprogramar mediante drag & drop;
- adaptación responsive.

## Evidencia de drag & drop

Se movió la cita ID 1 mediante FullCalendar.

Antes:

`2026-09-25 09:00:00 - 2026-09-25 09:30:00`

Después:

`2026-09-26 09:00:00 - 2026-09-26 09:30:00`

La nueva fecha fue consultada directamente en MySQL y quedó persistida.

## Flujo Git

Ramas feature utilizadas:

- `feature/docker-mysql-schema`
- `feature/api-rest-citas`
- `feature/validacion-conflictos-estados`
- `feature/fullcalendar-ui`

Todas fueron integradas mediante Pull Request hacia `main`.

El historial Git se encuentra en:

`evidencia/git-log.txt`

## Requisitos cubiertos

### RQF

RQF-01, RQF-02, RQF-03, RQF-04, RQF-05, RQF-06, RQF-07, RQF-08, RQF-09 y RQF-10.

### RQNF

RQNF-01, RQNF-02, RQNF-03, RQNF-04, RQNF-05, RQNF-06, RQNF-07 y RQNF-08.

## Capturas de pantalla

- Calendario principal: `evidencia/01-fullcalendar.png`
- Formulario de creación de cita: `evidencia/02-crear-cita.png`
- Detalle de cita: `evidencia/03-detalle-cita.png`

## Comandos ejecutados

Los comandos utilizados durante la implementación y las pruebas se encuentran en:

`evidencia/comandos-ejecutados.txt`

Incluyen pruebas de:

- Docker Compose.
- MySQL.
- API REST.
- creación de citas;
- filtros;
- reprogramación;
- cambio de estado;
- conflicto HTTP 409;
- flujo Git.

## Respuestas de la API

Las respuestas principales obtenidas durante las pruebas se encuentran en:

`evidencia/respuestas-api.txt`

Se documentaron respuestas HTTP:

- 200 OK
- 201 Created
- 400 Bad Request
- 404 Not Found
- 409 Conflict

## Flujo Git con rama develop

El proyecto utiliza el siguiente flujo de integración:

`feature/* -> develop -> main`

Pull Requests de integración hacia `develop`:

- PR #6: `feature/docker-mysql-schema` -> `develop`
- PR #7: `feature/api-rest-citas` -> `develop`
- PR #8: `feature/validacion-conflictos-estados` -> `develop`
- PR #9: `feature/fullcalendar-ui` -> `develop`
- PR #10: `feature/evidencia-final` -> `develop`

Finalmente, la rama `develop` se integra a `main` mediante Pull Request, dejando visible el flujo completo en el historial de Git.
