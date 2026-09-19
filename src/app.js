require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

const pacienteRoutes = require('./routes/pacienteRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const citaRoutes = require('./routes/citaRoutes');

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        res.status(200).json({
            status: 'ok',
            database: 'connected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            database: 'disconnected'
        });
    }
});

app.use('/api/pacientes', pacienteRoutes);
app.use('/api/doctores', doctorRoutes);
app.use('/api/citas', citaRoutes);

app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});
