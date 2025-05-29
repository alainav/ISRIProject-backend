import fs from "fs/promises";
import * as generalFs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import {
  consoleConnection,
  getFechaCubaText,
  getHoraCubaText,
} from "./utils.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "verificacionaplicaciones@gmail.com",
    pass: "lccarbpmsyeqtkgk",
  },
});

const LOG_FILE = path.join(__dirname, "applicationLogs.log");
let isProcessing = false;

export const consoleLog = async (
  message: string,
  color: string = "white",
  identity?: string
) => {
  const tag = consoleConnection(message, color, identity);
  const logEntry = `[${tag}] ${message}\n`;

  try {
    await fs.appendFile(LOG_FILE, logEntry);
  } catch (error) {
    consoleConnection(`❌ Error escribiendo en log: ${error}`, "red", identity);
  }
};

export const consoleError = (
  identity: string | undefined,
  error: unknown,
  message: string,
  color: string = "red"
) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  consoleLog(`❌ ${message}\nError: ${errorMessage}`, color, identity);
};

const scheduleLogTasks = () => {
  const now = new Date();
  const target = new Date(now);
  target.setHours(6, 0, 0, 0);

  if (now > target) target.setDate(target.getDate() + 1);

  setTimeout(async () => {
    if (!isProcessing) {
      isProcessing = true;
      await sendAndRotateLogs();
      isProcessing = false;
    }
    scheduleLogTasks();
  }, target.getTime() - now.getTime());
};

const sendAndRotateLogs = async () => {
  try {
    const logContent = await fs.readFile(LOG_FILE, "utf8");

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

    const logsDir = path.join(__dirname, "logs");
    await fs.mkdir(logsDir, { recursive: true });
    const archiveName = `applicationLogs-${getFechaCubaText()}.log`;
    await fs.rename(LOG_FILE, path.join(logsDir, archiveName));
    await fs.writeFile(LOG_FILE, "");

    consoleConnection("✅ Logs enviados y rotados", "green");
  } catch (error) {
    consoleError(undefined, error, "Error procesando logs", "red");
  }
};

(async () => {
  try {
    await fs.mkdir(path.join(__dirname, "logs"), { recursive: true });

    if (!generalFs.existsSync(LOG_FILE)) {
      await fs.writeFile(LOG_FILE, "");
    }

    console.log("📁 Sistema de logs inicializado");

    scheduleLogTasks();

    const direccion = __dirname.split(path.sep);
    const displayDir = direccion.slice(-3).join(path.sep);
    consoleLog(
      `📁 Sistema de logs inicializado en ${displayDir} (${getFechaCubaText()} ${getHoraCubaText()})`,
      "purple"
    );
  } catch (error) {
    console.error("❌ Error crítico inicializando logs:", error);
    process.exit(1);
  }
})();

export default consoleLog;
