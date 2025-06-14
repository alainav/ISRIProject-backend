/**
 * Configuración de la conexión a PostgreSQL usando Sequelize
 * @module database/config
 * @requires sequelize
 * @requires pg
 */

import { Sequelize, Options, SyncOptions } from "sequelize";
import pg from "pg";

// Extender las opciones de Sequelize para incluir la configuración de reintentos
interface CustomSequelizeOptions extends Options {
  retry?: {
    max: number;
    match: (string | RegExp)[];
  };
}

/**
 * Instancia de Sequelize configurada para conexión con PostgreSQL
 * @type {Sequelize}
 */
export const sequelize = new Sequelize({
  dialect: "postgres",
  host: "postgresql-tecnologia.alwaysdata.net",
  //host: "localhost", //--dev
  database: "tecnologia_nations_model_db",
  //database: "nations_model_db", //--dev
  username: "tecnologia_root",
  //username: "root", //--dev
  password: "114427salvador",
  //password: "root", //--dev
  //port: 5432, // Puerto por defecto de PostgreSQL
  dialectOptions: {
    ssl: {
      require: true, // Render PostgreSQL requiere SSL
      rejectUnauthorized: false, // Necesario para conexiones SSL en Render
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false, // Desactiva los logs de SQL en producción
});

/**
 * Establece conexión con la base de datos y sincroniza modelos
 * @async
 * @function dbConnection
 * @returns {Promise<void>}
 * @throws {Error} Si falla la conexión o sincronización
 * @example
 * await dbConnection();
 */
export const dbConnection = async (): Promise<void> => {
  try {
    // Autenticar con reintento automático
    await sequelize.authenticate();

    // Opciones de sincronización con tipo explícito
    const syncOptions: SyncOptions = {
      alter: true,
    };

    await sequelize.sync(syncOptions);
    console.log("✅ Base de datos online");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }
};
