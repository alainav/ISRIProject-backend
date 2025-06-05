// config/configEnv.ts
import path from "path";
import dotenv from "dotenv";
import { __dirname } from "../../utils/utils.js";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Verificar que las variables requeridas estén definidas
if (!process.env.KEY_JWT) {
  throw new Error("La variable KEY_JWT no está definida en el archivo .env");
}

export const globalEnv = {
  PORT: process.env.PORT || "3000",
  DB_PORT: process.env.DB_PORT || "5432",
  DB_USERNAME: process.env.DB_USERNAME || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_HOST: process.env.DB_HOST || "localhost",
  KEY_JWT: process.env.KEY_JWT as string,
};
