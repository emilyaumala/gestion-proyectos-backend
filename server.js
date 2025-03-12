const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (asegurate de reemplazar tu URI de MongoDB)
const mongoURI = process.env.MONGO_URI || 'mongodb://iot:Constecoin2021@157.100.18.147:53236/'; // Usa el URI de tu base de datos MongoDB
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

app.post("/guardar", async (req, res) => {
    try {
        console.log("Datos recibidos en /guardar:", req.body);

        // Validar que los datos no están vacíos
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

        if (Object.values(datos).every(val => val === "N/A")) {
            console.error("❌ Error: Todos los datos están vacíos");
            return res.status(400).send({ message: "No se enviaron datos válidos" });
        }

        // Crear un nuevo proyecto en la base de datos
        const nuevoProyecto = new Proyecto(datos);
        await nuevoProyecto.save();

        console.log("✅ Datos guardados en MongoDB:", datos);
        res.status(200).send({ message: "Datos guardados correctamente en MongoDB" });

    } catch (error) {
        console.error("Error al guardar en MongoDB:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
});

// Configurar el puerto
const port = 5000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
