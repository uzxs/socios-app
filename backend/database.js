const sqlite = require("@databases/sqlite");

let db;

async function init() {
  db = await sqlite.default(":memory:");
  await db.query(sqlite.sql`
    CREATE TABLE IF NOT EXISTS socios (
      id            INTEGER  PRIMARY KEY AUTOINCREMENT,
      nombre        TEXT     NOT NULL,
      correo        TEXT     NOT NULL UNIQUE,
      fecha_ingreso TEXT     NOT NULL DEFAULT (date('now'))
    );
  `);
  console.log('✅ Tabla "socios" lista.');
  return db;
}

module.exports = { init };
