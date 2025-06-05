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
export const sequelize = new Sequelize(
  "nations_model_db",
  "root",
  "root",
  {
    dialect: "postgres",
    protocol: "postgres",
    host: "localhost",
    logging: false,
    dialectModule: pg,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
      match: ["SequelizeDatabaseError: deadlock detected", /Deadlock/i],
    },
  } as CustomSequelizeOptions // Type assertion para opciones personalizadas
);

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
