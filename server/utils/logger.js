// 📁 utils/logger.js
import fs from "fs/promises";
import * as generalFs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { __dirname, getFechaCubaText, getHoraCubaText } from "./utils.js";
import { consoleConnection } from "./utils.js";
import { notificarError } from "../helpers/index.js";

// Configuración de transporte (usando el existente de enviar-email.js)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "verificacionaplicaciones@gmail.com",
    pass: "lccarbpmsyeqtkgk",
  },
});

// Ruta del log único
const LOG_FILE = path.join(__dirname, "applicationLogs.log");
let isProcessing = false;

// Función modificada que mantiene formato y añade logging
const consoleLog = async (message, color = "white", userId) => {
  // Llamar a la implementación original
  const tag = consoleConnection(message, color, userId);

  // Escribir en archivo sin formato
  const logEntry = `[${tag}] ${message}\n`;

  try {
    await fs.appendFile(LOG_FILE, logEntry);
  } catch (error) {
    consoleConnection(`❌ Error escribiendo en log: ${error}`, "red", userId);
  }
};

export const consoleError = (userId, error, message, color = "red") => {
  consoleLog(`❌ ${message}\nError: ${error}`, color, userId);
  if (userId && userId !== null && userId !== undefined) {
    notificarError(userId, error, message);
  }
};

// Programar tareas diarias
const scheduleLogTasks = () => {
  const now = new Date();
  const target = new Date(now);
  target.setHours(6, 0, 0, 0); // 12:00 AM Hora Cuba

  if (now > target) target.setDate(target.getDate() + 1);

  setTimeout(async () => {
    if (!isProcessing) {
      isProcessing = true;
      await sendAndRotateLogs();
      isProcessing = false;
    }
    scheduleLogTasks();
  }, target - now);
};

// Enviar y rotar logs
const sendAndRotateLogs = async () => {
  try {
    // Enviar log actual
    const logContent = await fs.readFile(LOG_FILE);

    await transporter.sendMail({
      from: "verificacionaplicaciones@gmail.com",
      to: [
        "alainalvaresvergara@gmail.com",
        "derikzgm@gmail.com",
        "adiazm21@gmail.com",
        "yonnydominguez22@gmail.com",
        "redmac.sa@gmail.com",
      ],
      subject: `Logs Diarios - ${getFechaCubaText()}`,
      text: "Adjunto archivo de logs",
      attachments: [
        {
          filename: `applicationLogs - ${getFechaCubaText()}.log`,
          content: logContent,
        },
      ],
    });

    console.log("✅ Logs Enviados");

    // Rotar archivo
    const archiveName = `applicationLogs-${getFechaCubaText()}.log`;
    await fs.rename(LOG_FILE, path.join(__dirname, "logs", archiveName));
    await fs.writeFile(LOG_FILE, "");

    consoleConnection("✅ Logs enviados y rotados", "green");
  } catch (error) {
    consoleError(`❌ Error procesando logs: ${error}`, "red");
  }
};

// Inicialización
(async () => {
  try {
    // 1. Crear directorio de logs primero
    await fs.mkdir(path.join(__dirname, "logs"), { recursive: true });

    // 2. Revisar si existe el archivo principal y si no Inicializar el mismo
    if (!generalFs.existsSync(LOG_FILE)) {
      await fs.writeFile(LOG_FILE, "");
    }

    // 3. Mostrar mensaje usando console estándar primero
    console.log("📁 Sistema de logs inicializado"); // Mensaje temporal

    // 4. Programar tareas
    scheduleLogTasks();

    const direccion = __dirname.includes("/")
      ? __dirname.split(`/`)
      : __dirname.split(`\\`);
    // 5. Ahora usar la versión modificada
    consoleLog(
      `📁 Sistema de logs inicializado en ${path.join(
        direccion[3],
        direccion[4],
        direccion[5]
      )} (${getFechaCubaText()} ${getHoraCubaText()})`,
      "purple"
    );
  } catch (error) {
    // 6. Usar console nativo para errores de inicialización
    console.error("❌ Error crítico inicializando logs:", error);
    process.exit(1);
  }
})();

export default consoleLog;
