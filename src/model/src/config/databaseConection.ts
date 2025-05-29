import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { globalEnv } from "./configEnv.js";
import { __dirname } from "../../../utils/utils.js";

const conectionDB = new DataSource({
  type: "mysql",
  host: globalEnv.DB_HOST,
  port: parseInt(globalEnv.DB_PORT || "3306"),
  username: globalEnv.DB_USERNAME || "root",
  password: globalEnv.DB_PASSWORD || "root",
  database: "db_elecciones",
  entities: [path.join(__dirname, "../models/Entity/**/*.ts")],
  synchronize: true,
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await conectionDB.initialize();
    console.log("Base de Datos inicializada");
  } catch (error) {
    console.log("Error al conectar la base de datos: /n", error);
  }
};
