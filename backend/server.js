const express = require("express");
const cors    = require("cors");
const sqlite  = require("@databases/sqlite");
const path    = require("path");

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

let db;

async function iniciar() {
  db = await sqlite.default("socios.db");

  await db.query(sqlite.sql`
    CREATE TABLE IF NOT EXISTS socios (
      id            INTEGER  PRIMARY KEY AUTOINCREMENT,
      nombre        TEXT     NOT NULL,
      correo        TEXT     NOT NULL UNIQUE,
      fecha_ingreso TEXT     NOT NULL DEFAULT (date('now'))
    );
  `);
  console.log('✅ Tabla "socios" lista.');

  app.get("/api/socios", async (req, res) => {
    try {
      const socios = await db.query(sqlite.sql`SELECT * FROM socios ORDER BY fecha_ingreso DESC`);
      res.json(socios);
    } catch (e) {
      res.status(500).json({ error: "Error interno." });
    }
  });

  app.post("/api/socios", async (req, res) => {
    const { nombre, correo } = req.body;
    if (!nombre || !correo)
      return res.status(400).json({ error: "Nombre y correo son obligatorios." });
    try {
      await db.query(sqlite.sql`INSERT INTO socios (nombre, correo) VALUES (${nombre}, ${correo})`);
      res.status(201).json({ mensaje: "Socio registrado correctamente." });
    } catch (e) {
      if (e.message.includes("UNIQUE"))
        return res.status(409).json({ error: "Ese correo ya está registrado." });
      res.status(500).json({ error: "Error interno." });
    }
  });

  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
}

iniciar();
