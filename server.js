const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://iot:Constecoin2021@157.100.18.147:53236/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch(err => console.error('❌ Error al conectar con MongoDB:', err));

// Definir el modelo de datos para los proyectos
const proyectoSchema = new mongoose.Schema({
    //ccliente: {
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'Cliente', // Referencia al modelo Cliente
    //    required: true
    //},
  cliente: { type: String, required: true },
    nombreProyecto: { type: String, required: true },
    montoEstimado: { type: Number, required: true },
    faseVenta: { type: String, required: true },
    probabilidadVenta: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaCierre: { type: Date, required: true },
    respComercial: { type: String, required: true },
    respTecnico: { type: String, required: true },
    observaciones: { type: String }
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema, 'Proyecto');

// Ruta para guardar proyectos
app.post("/guardar", async (req, res) => {
    try {
        const datos = {
            cliente: req.body.cliente,
            nombreProyecto: req.body.nombreProyecto,
            montoEstimado: parseFloat(req.body.montoEstimado) || 0,
            faseVenta: req.body.faseVenta,
            probabilidadVenta: req.body.probabilidadVenta,
            fechaInicio: new Date(req.body.fechaInicio),
            fechaCierre: new Date(req.body.fechaCierre),
            respComercial: req.body.respComercial,
            respTecnico: req.body.respTecnico,
            observaciones: req.body.observaciones || "Sin observaciones"
        };

        const nuevoProyecto = new Proyecto(datos);
        await nuevoProyecto.save();

        console.log("✅ Datos guardados en MongoDB:", datos);
        res.status(200).send({ message: "Datos guardados correctamente en MongoDB" });

    } catch (error) {
        console.error("❌ Error al guardar en MongoDB:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
});

// Configurar el puerto
const port = 5000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

