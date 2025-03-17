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
    area: { type: mongoose.Schema.Types.ObjectId, ref: "Area", required: true },
    montoEstimado: { type: Number, required: true },
    faseVenta: { type: mongoose.Schema.Types.ObjectId, ref: "FaseVenta", required: true },
    probabilidadVenta: { type: String, required: true },
    fechaInicio: { type: String, required: true },
    // Eliminar la línea que define fechaCierre
    respComercial: { type: mongoose.Schema.Types.ObjectId, ref: "ResponsableComercial", required: true },
    respTecnico: { type: mongoose.Schema.Types.ObjectId, ref: "ResponsableTecnico", required: true },
    observaciones: { type: String },
   cantidadLapso: { type: Number, required: true }, // Aquí es la cantidad
    unidadLapso: { type: String, required: true },  // Aquí es la unidad (días, meses, años)
});

const Proyecto = mongoose.model("Proyecto", proyectoSchema, "Proyecto");

// 🟢 Modelo Oportunidad (Actualizaciones del Proyecto)
const oportunidadSchema = new mongoose.Schema({
    nombreProyecto: { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto", required: true },
    faseVenta: { type: mongoose.Schema.Types.ObjectId, ref: "FaseVenta", required: true },
    fechaInicio: { type: Date, required: true },
    fechaCierre: { type: Date, required: true },
    observaciones: { type: String, default: "Sin observaciones" }
});
const Oportunidad = mongoose.model("Oportunidad", oportunidadSchema, "Oportunidad");
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
// 🟢 Modelo RespTecnico
const respTecnicoSchema = new mongoose.Schema({
    respTecnico: String
});
const ResponsableTecnico = mongoose.model("ResponsableTecnico", respTecnicoSchema, "ResponsableTecnico");
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
        res.status(200).json(responsablesComerciales);  // Retorna los clientes como respuesta
    } catch (error) {
        console.error("❌ Error al obtener responsables-comerciales:", error);
        res.status(500).send({ message: "Error al obtener responsables-comerciales", error: error.message });
    }
});

app.get("/responsables-tecnicos", async (req, res) => {
        try {
        const responsablesTecnicos = await ResponsableTecnico.find();  // Obtener todos los clientes
        res.status(200).json(responsablesTecnicos);  // Retorna los clientes como respuesta
    } catch (error) {
        console.error("❌ Error al obtener responsables-tecnicos:", error);
        res.status(500).send({ message: "Error al obtener responsables-tecnicos", error: error.message });
    }
});
// Ruta para obtener los proyectos
app.get('/proyectos', async (req, res) => {
  try {
    // Obtén los proyectos con los datos relacionados utilizando populate para todos los campos necesarios
    const proyectos = await Proyecto.find()
        .populate('nombreProyecto', 'nombreProyecto')
      .populate('cliente', 'cliente')  // Popula el campo 'cliente' con el nombre del cliente
      .populate('area', 'area')        // Popula el campo 'area' con el nombre del área
      .populate('faseVenta', 'faseVenta')  // Popula el campo 'faseVenta' con el nombre de la fase
      .populate('respComercial', 'respComercial')  // Popula el campo 'respComercial' con el nombre del responsable comercial
      .populate('respTecnico', 'respTecnico')  // Popula el campo 'respTecnico' con el nombre del responsable técnico
      .exec();

    // Envía los proyectos con todos los datos relacionados
    res.json(proyectos);
  } catch (error) {
    res.status(500).send('Error al obtener los proyectos');
  }
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
// ✅ Ruta para actualizar un proyecto
app.post("/guardar1", async (req, res) => {
    try {
        const nuevoActProyecto = new Oportunidad(req.body);
        await nuevoActProyecto.save();
        res.status(200).json({ message: "Actualización guardada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el proyecto" });
    }
});
// ✅ Ruta para obtener las actualizaciones de un proyecto
// Ruta corregida para obtener actualizaciones de un proyecto
app.get("/informeOportunidad/:idProyecto", async (req, res) => {
  const { idProyecto } = req.params;

  try {
    const ObjectId = mongoose.Types.ObjectId;
    const idConvertido = new ObjectId(idProyecto);

    // Obtener el nombre del proyecto y el área con populate si es necesario
    const proyecto = await Proyecto.findById(idConvertido)
      .populate("area", "area") // Si área es un ObjectId referenciado
      .populate("faseVenta", "faseVenta"); // También populamos faseVenta

    if (!proyecto) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    // Extraer el área correctamente
    const area = proyecto.area ? proyecto.area.area || "Área no disponible" : "Área no disponible";

    // Extraer la fase de venta del proyecto correctamente
    const faseVentaProyecto = proyecto.faseVenta
      ? proyecto.faseVenta.faseVenta || "Fase no disponible"
      : "Fase no disponible";

    console.log("Proyecto encontrado:", proyecto);
    console.log("Área extraída:", area);
    console.log("Fase de Venta del Proyecto:", faseVentaProyecto);

    // Buscar oportunidades asociadas al proyecto
    const oportunidades = await Oportunidad.find({ nombreProyecto: idConvertido })
      .populate("nombreProyecto", "nombreProyecto")
      .populate("faseVenta", "faseVenta")
      .sort({ fechaInicio: 1 });

    console.log("Oportunidades encontradas:", oportunidades);

    // Formatear la respuesta con la faseVentaProyecto renombrada correctamente
    res.json({
      nombreProyecto: proyecto.nombreProyecto,
      area: area,
      montoEstimado: proyecto.montoEstimado,
      faseVentaProyecto: faseVentaProyecto, // <-- Aquí está la corrección
      oportunidades: oportunidades.length ? oportunidades : [],
    });

  } catch (error) {
    console.error("❌ Error al obtener actualizaciones del proyecto:", error);
    res.status(500).json({ mensaje: "Error al obtener las actualizaciones", error: error.message });
  }
});




// Configurar el puerto
const port = 5000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});











