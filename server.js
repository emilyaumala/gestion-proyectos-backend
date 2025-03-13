const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://iot:Constecoin2021@157.100.18.147:53236/";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Conexión a MongoDB exitosa"))
    .catch(err => console.error("❌ Error al conectar con MongoDB:", err));

// Definir modelo Cliente
const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
});
const Cliente = mongoose.model("Cliente", clienteSchema, "Cliente");

// Definir modelo Proyecto
const proyectoSchema = new mongoose.Schema({
    nombreProyecto: { type: String, required: true }
});
const Proyecto = mongoose.model("Proyecto", proyectoSchema, "Proyecto");

// Ruta para obtener clientes
app.get("/clientes", async (req, res) => {
    try {
        const clientes = await Cliente.find({}, "_id nombre");
        res.json(clientes);
    } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        res.status(500).json({ message: "Error al obtener clientes" });
    }
});

// Ruta para obtener nombres de proyectos
app.get("/proyectos", async (req, res) => {
    try {
        const proyectos = await Proyecto.find({}, "nombreProyecto");
        res.json(proyectos);
    } catch (error) {
        console.error("❌ Error al obtener proyectos:", error);
        res.status(500).json({ message: "Error al obtener proyectos" });
    }
});

// Ruta para obtener fases de venta
app.get("/fases-venta", (req, res) => {
    res.json(["Prospecto", "Cotización enviada", "Negociación", "Cierre"]);
});

// Ruta para obtener responsables comerciales
app.get("/responsables-comerciales", (req, res) => {
    res.json(["Juan Pérez", "María Gómez", "Carlos López"]);
});

// Ruta para obtener responsables técnicos
app.get("/responsables-tecnicos", (req, res) => {
    res.json(["Andrea Martínez", "Roberto Sánchez", "Laura Fernández"]);
});

// Configurar el puerto
const port = 5000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

