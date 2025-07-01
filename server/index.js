const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config(); // para leer variables de entorno

const app = express();
const port = process.env.PORT || 3000;

// Permitir peticiones desde Netlify
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ruta POST para guardar datos
app.post('/guardar_contacto', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  try {
    await pool.query(
      'INSERT INTO contactos (nombre, correo, mensaje) VALUES ($1, $2, $3)',
      [nombre, correo, mensaje]
    );
    res.send('¡Mensaje guardado con éxito!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar el mensaje');
  }
});

// Verificar si funciona
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.listen(port, () => {
  console.log(`Servidor en puerto ${port}`);
});
