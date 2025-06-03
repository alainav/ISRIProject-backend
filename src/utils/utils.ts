import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import moment from "moment-timezone";
import { getSockets } from "../server/controllers/general.controller.js";
import { online } from "../server/onlines.js";

export const PRIVATEKEY = `MyPubl1cK3yS3cr3t${new Date().getDate()}k3yS3c4r1ty`;
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const unir = (...routes: string[]): string => {
  return path.join(__dirname, ...routes);
};

export const minutesToMiliseconds = (minutes: number): number => {
  return minutes * 60 * 1000;
};

export const milisecondsToDays = (miliseconds: number): number => {
  return miliseconds / 24 / 60 / 60 / 1000;
};

export const calcularPaginas = (
  count: number,
  limit: number
): { totalPages: number; totalRecords: number } => {
  const totalPages = Math.ceil(count / limit);
  return {
    totalPages,
    totalRecords: count,
  };
};

export const calcularOffset = (
  page: number = 1,
  limit: number = 10
): number => {
  
  if (Number.isNaN(page)) page = 1;

  if (page < 1) page = 1;
  return (page - 1) * limit;
};

export const consoleConnection = (
  message: string,
  color: string = "white",
  identity?: string
): string => {
  const sizeBorder = 75;
  const border = "*".repeat(sizeBorder);
  const colors: Record<string, string> = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    purple: "\x1b[95m",
  };
  const statusMessage = `📊 Clientes en línea: ${online.toString().padEnd(3)}`;

  console.log(`${colors[color]}%s\x1b[0m`, border);
  let tag = `${getFechaCubaText()} ${getHoraCubaText()}`;
  if (identity) {
    const socketObj = getSockets(identity);
    if (socketObj) {
      const address = socketObj.socket.handshake.address;
      tag = `${tag} ${address}`;
    }
  }
  console.log(`${colors[color]}%s\x1b[0m`, `* ${tag.padEnd(sizeBorder - 4)} *`);
  console.log(
    `${colors[color]}%s\x1b[0m`,
    `* ${message.padEnd(sizeBorder - 4)} *`
  );
  console.log(
    `${colors[color]}%s\x1b[0m`,
    `* ${statusMessage.padEnd(sizeBorder - 4)} *`
  );
  console.log(`${colors[color]}%s\x1b[0m`, border);

  return tag;
};

export const getHoraCubaText = (): string => {
  return moment().tz("America/Havana").format("hh:mm:ss A");
};

export const getFechaCuba = (): Date => {
  return moment().tz("America/Havana").startOf("day").toDate();
};

export const getFechaCubaText = (): string => {
  return moment().tz("America/Havana").format("DD-MM-YYYY");
};

export const addYears = (date: Date, years: number): Date => {
  return new Date(date.setFullYear(date.getFullYear() + years));
};

export const convertImagetoURL = async (
  image_name: string
): Promise<string> => {
  const imagePath = path.join(process.cwd(), "public", "img", image_name);
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = imageBuffer.toString("base64");
  return `data:image/png;base64,${base64Image}`;
};

export const requerir = <T>(option: T): T & { required: true } => {
  return { ...option, required: true };
};

export default {
  __filename,
  __dirname,
  unir,
  minutesToMiliseconds,
};
