const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Cargar credenciales de Google
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth: client });

const SPREADSHEET_ID = '15JwIhhpG6iaUHOoFxHQWTUUF4y5rKACCXnNQRo7vhoA';
const range = 'Datos!A1:I10000';  // Asegúrate de que coincida con el nombre de tu hoja

app.post("/guardar", async (req, res) => {
    try {
        console.log("Datos recibidos en /guardar:", req.body);

        // Validar que los datos no están vacíos
        const values = [
            [
                req.body.nombre_oportunidad || "N/A",
                req.body.asesor_comercial || "N/A",
                req.body.asesor_ventas || "N/A",
                req.body.cliente || "N/A",
                req.body.categoria_ventas || "N/A",
                req.body.cantidad_prevista || "N/A",
                req.body.fase_venta || "N/A",
                req.body.probabilidad_venta || "N/A",
                req.body.cierre_probable || "N/A"
            ]
        ];

        if (values[0].every((val) => val === "N/A")) {
            console.error("❌ Error: Todos los datos están vacíos");
            return res.status(400).send({ message: "No se enviaron datos válidos" });
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Datos!A1:I10000", // Asegúrate de cambiar el nombre si es necesario
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values },
        });

        console.log("✅ Datos guardados en Google Sheets:", response.data);
        res.status(200).send({ message: "Datos guardados correctamente" });

    } catch (error) {
        console.error("Error al guardar en Google Sheets:", error);
        res.status(500).send({ message: "Error interno del servidor", error: error.message });
    }
});



// Configurar el puerto
const port = 5000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
