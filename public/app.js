const API = '/api';

const colores = {
    pendiente: '#f59e0b',
    confirmada: '#2563eb',
    cancelada: '#dc2626',
    atendida: '#16a34a'
};

const modalCita = document.getElementById('modalCita');
const modalDetalle = document.getElementById('modalDetalle');

const pacienteSelect = document.getElementById('paciente');
const doctorSelect = document.getElementById('doctor');
const filtroDoctor = document.getElementById('filtroDoctor');

function pad(n) {
    return String(n).padStart(2, '0');
}

function fechaMysql(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

async function cargarCatalogos() {
    const [pacientes, doctores] = await Promise.all([
        fetch(`${API}/pacientes`).then(r => r.json()),
        fetch(`${API}/doctores`).then(r => r.json())
    ]);

    pacienteSelect.innerHTML = pacientes
        .map(p => `<option value="${p.id}">${p.nombre} ${p.apellido}</option>`)
        .join('');

    doctorSelect.innerHTML = doctores
        .map(d => `<option value="${d.id}">${d.nombre} ${d.apellido} - ${d.especialidad}</option>`)
        .join('');

    filtroDoctor.innerHTML =
        '<option value="">Todos los doctores</option>' +
        doctores.map(
            d => `<option value="${d.id}">${d.nombre} ${d.apellido}</option>`
        ).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    await cargarCatalogos();

    const calendar = new FullCalendar.Calendar(
        document.getElementById('calendar'),
        {
            initialView: 'dayGridMonth',

            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },

            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana'
            },

            locale: 'es',
            editable: true,
            selectable: true,

            events: async (info, success, failure) => {
                try {
                    const doctorId = filtroDoctor.value;

                    let url =
                        `${API}/citas?desde=${info.startStr.substring(0,10)}` +
                        `&hasta=${info.endStr.substring(0,10)}`;

                    if (doctorId) {
                        url += `&doctor_id=${doctorId}`;
                    }

                    const citas = await fetch(url).then(r => r.json());

                    success(
                        citas.map(c => ({
                            id: c.id,
                            title: `${c.paciente} - ${c.doctor}`,
                            start: c.fecha_hora_inicio.replace(' ', 'T'),
                            end: c.fecha_hora_fin.replace(' ', 'T'),
                            backgroundColor: colores[c.estado],
                            borderColor: colores[c.estado],
                            extendedProps: c
                        }))
                    );
                } catch (error) {
                    failure(error);
                }
            },

            dateClick(info) {
                const fecha = info.date;

                document.getElementById('fecha').value =
                    `${fecha.getFullYear()}-${pad(fecha.getMonth()+1)}-${pad(fecha.getDate())}`;

                const hora = info.allDay ? 9 : fecha.getHours();

                document.getElementById('horaInicio').value =
                    `${pad(hora)}:00`;

                document.getElementById('horaFin').value =
                    `${pad(hora + 1)}:00`;

                document.getElementById('motivo').value = '';

                modalCita.showModal();
            },

            eventClick(info) {
                const c = info.event.extendedProps;

                document.getElementById('detalleContenido').innerHTML = `
                    <h2>Detalle de la cita</h2>

                    <div class="detalle-fila"><strong>Paciente:</strong> ${c.paciente}</div>
                    <div class="detalle-fila"><strong>Doctor:</strong> ${c.doctor}</div>
                    <div class="detalle-fila"><strong>Especialidad:</strong> ${c.especialidad}</div>
                    <div class="detalle-fila"><strong>Inicio:</strong> ${c.fecha_hora_inicio}</div>
                    <div class="detalle-fila"><strong>Fin:</strong> ${c.fecha_hora_fin}</div>
                    <div class="detalle-fila"><strong>Motivo:</strong> ${c.motivo}</div>
                    <div class="detalle-fila"><strong>Estado:</strong> ${c.estado}</div>
                `;

                modalDetalle.showModal();
            },

            async eventDrop(info) {
                const cita = info.event.extendedProps;

                try {
                    const inicio = fechaMysql(info.event.start);

                    let fin;

                    if (info.event.end) {
                        fin = fechaMysql(info.event.end);
                    } else {
                        const inicioOriginal = new Date(
                            cita.fecha_hora_inicio.replace(' ', 'T')
                        );

                        const finOriginal = new Date(
                            cita.fecha_hora_fin.replace(' ', 'T')
                        );

                        const duracion =
                            finOriginal.getTime() - inicioOriginal.getTime();

                        fin = fechaMysql(
                            new Date(
                                info.event.start.getTime() + duracion
                            )
                        );
                    }

                    const respuesta = await fetch(
                        `${API}/citas/${info.event.id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                paciente_id: cita.paciente_id,
                                doctor_id: cita.doctor_id,
                                fecha_hora_inicio: inicio,
                                fecha_hora_fin: fin,
                                motivo: cita.motivo
                            })
                        }
                    );

                    const data = await respuesta.json();

                    if (!respuesta.ok) {
                        alert(data.error || 'No fue posible reprogramar');
                        info.revert();
                        return;
                    }

                    alert('Cita reprogramada correctamente');

                    calendar.refetchEvents();
                } catch (error) {
                    console.error(error);
                    info.revert();
                    alert('Error al reprogramar la cita');
                }
            }
        }
    );

    calendar.render();

    filtroDoctor.addEventListener('change', () => {
        calendar.refetchEvents();
    });

    document.getElementById('formCita').addEventListener(
        'submit',
        async event => {
            event.preventDefault();

            const fecha = document.getElementById('fecha').value;

            const respuesta = await fetch(`${API}/citas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paciente_id: Number(pacienteSelect.value),
                    doctor_id: Number(doctorSelect.value),
                    fecha_hora_inicio:
                        `${fecha} ${document.getElementById('horaInicio').value}:00`,
                    fecha_hora_fin:
                        `${fecha} ${document.getElementById('horaFin').value}:00`,
                    motivo: document.getElementById('motivo').value
                })
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                alert(data.error || 'No fue posible crear la cita');
                return;
            }

            modalCita.close();
            calendar.refetchEvents();
        }
    );

    document.getElementById('cerrarModal').onclick = () =>
        modalCita.close();

    document.getElementById('cerrarDetalle').onclick = () =>
        modalDetalle.close();
});
