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

// 🟢 Modelo Cliente
const clienteSchema = new mongoose.Schema({
    ruc: String,
    cliente: String, // Nombre del cliente
});
const Cliente = mongoose.model("Cliente", clienteSchema, "Cliente");

// 🟢 Modelo Proyecto
const proyectoSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    nombreProyecto: { type: String, required: true },
    area: { type: String, required: true },
    montoEstimado: { type: Number, required: true },
    faseVenta: { type: String, required: true },
    probabilidadVenta: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaCierre: { type: Date, required: true },
    respComercial: { type: String, required: true },
    respTecnico: { type: String, required: true },
    observaciones: { type: String },
});
const Proyecto = mongoose.model("Proyecto", proyectoSchema, "Proyecto");
// 🟢 Modelo Área
const areaSchema = new mongoose.Schema({
    area: String
});
const Area = mongoose.model("Area", areaSchema, "Area");
// 🟢 Modelo Fase de Venta
const faseVentaSchema = new mongoose.Schema({
    faseVenta: String
});
const FaseVenta = mongoose.model("FaseVenta", faseVentaSchema, "FaseVenta");
// 🟢 Modelo RespComercial
const respComercialSchema = new mongoose.Schema({
    respComercial: String
});
const ResponsableComercial = mongoose.model("ResponsableComercial", respComercialSchema, "ResponsableComercial");
// ✅ Rutas para obtener datos
app.get("/clientes", async (req, res) => {
    try {
        const clientes = await Cliente.find();  // Obtener todos los clientes
        res.status(200).json(clientes);  // Retorna los clientes como respuesta
    } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
        res.status(500).send({ message: "Error al obtener clientes", error: error.message });
    }
});
// ✅ Rutas para obtener datos /área
app.get("/areas", async (req, res) => {
    try {
        const areas = await Area.find();  // Obtener todos los clientes
        res.status(200).json(areas);  // Retorna los clientes como respuesta
    } catch (error) {
        console.error("❌ Error al obtener areas:", error);
        res.status(500).send({ message: "Error al obtener areas", error: error.message });
    }
});
// ✅ Rutas para obtener datos /fases
app.get("/fasesVenta", async (req, res) => {
    try {
        const fasesVenta = await FaseVenta.find();  // Obtener todos los clientes
        res.status(200).json(fasesVenta);  // Retorna los clientes como respuesta
    } catch (error) {
        console.error("❌ Error al obtener fasesVenta:", error);
        res.status(500).send({ message: "Error al obtener fases-venta", error: error.message });
    }
});

app.get("/probabilidad-venta", (req, res) => {
    res.json(["Baja", "Mediana", "Alta"]);
});

app.get("/responsables-comerciales", async (req, res) => {
        try {
        const responsablesComerciales = await ResponsableComercial.find();  // Obtener todos los clientes
        res.status(200).json(responsables-comerciales);  // Retorna los clientes como respuesta
    } catch (error) {
        console.error("❌ Error al obtener responsables-comerciales:", error);
        res.status(500).send({ message: "Error al obtener responsables-comerciales", error: error.message });
    }
});

app.get("/responsables-tecnicos", (req, res) => {
    res.json(["Andrea Martínez", "Roberto Sánchez", "Laura Fernández"]);
});

// ✅ Ruta para guardar un proyecto
app.post("/guardar", async (req, res) => {
    try {
        const nuevoProyecto = new Proyecto(req.body);
        await nuevoProyecto.save();
        res.status(200).json({ message: "Proyecto guardado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al guardar el proyecto" });
    }
});

// Configurar el puerto
const port = 5000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});











