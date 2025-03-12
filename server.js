const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (usando la URI de MongoDB Atlas o local)
const mongoURI = 'mongodb://iot:Constecoin2021@157.100.18.147:53236/Proyectos';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.error('Error al conectar con MongoDB:', err));

// Definir el modelo de datos para los proyectos
const proyectoSchema = new mongoose.Schema({
  nombre_oportunidad: String,
  asesor_comercial: String,
  asesor_ventas: String,
  cliente: String,
  categoria_ventas: String,
  cantidad_prevista: String,
  fase_venta: String,
  probabilidad_venta: String,
  cierre_probable: String
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

// Ruta para guardar proyectos
app.post("/guardar", async (req, res) => {
    try {
        const datos = {
            nombre_oportunidad: req.body.nombre_oportunidad || "N/A",
            asesor_comercial: req.body.asesor_comercial || "N/A",
            asesor_ventas: req.body.asesor_ventas || "N/A",
            cliente: req.body.cliente || "N/A",
            categoria_ventas: req.body.categoria_ventas || "N/A",
            cantidad_prevista: req.body.cantidad_prevista || "N/A",
            fase_venta: req.body.fase_venta || "N/A",
            probabilidad_venta: req.body.probabilidad_venta || "N/A",
            cierre_probable: req.body.cierre_probable || "N/A"
        };

        // Crear un nuevo proyecto
        const nuevoProyecto = new Proyecto(datos);
        await nuevoProyecto.save();

        res.status(200).send({ message: "Datos guardados correctamente" });
    } catch (error) {
        console.error("Error al guardar:", error);
        res.status(500).send({ message: "Error al guardar en la base de datos" });
    }
});

// Definir el puerto (solo una vez)
const port = process.env.PORT || 5000;  // Usar un puerto dinámico o 5000 como fallback
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
