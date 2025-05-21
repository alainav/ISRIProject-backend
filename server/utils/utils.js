import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { online } from "../../onlines.js";
import { obtenerSocketsPorUsuario } from "../controllers/controller.js";
import moment from "moment-timezone";

export const PRIVATEKEY = `MyPubl1cK3yS3cr3t${new Date().getDate()}k3yS3c4r1ty`;
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//
/**
 * Permite unir varias rutas con el path del proyecto
 * @param {*} routes Array con todas las rutas que se desean unir al absolute route
 * @returns
 */
export const unir = (routes) => {
  let rutaCompleta = __dirname;
  routes.map((route) => (rutaCompleta = path.join(rutaCompleta, route)));
  return rutaCompleta;
};

/**
 * Convierte de minutos a milisegundos
 * @param {*} minutes Cantidad de minutos a convertir
 * @returns
 */
export const minutesToMiliseconds = (minutes) => {
  return minutes * 60 * 1000;
};

/**
 * Devuelve la cantidad de páginas que hay
 * @param {*} count Cantidad total de registros
 * @param {*} limit Limite de registros
 * @returns
 */
export const calcularPaginas = (count, limit) => {
  const paginado = {
    totalPages:
      Number.parseInt(count) % Number.parseInt(limit) === 0
        ? Number.parseInt(Number.parseInt(count) / Number.parseInt(limit))
        : Number.parseInt(Number.parseInt(count) / Number.parseInt(limit)) + 1,
    totalRecords: count,
  };

  return paginado;
};

/**
 * Devuelve el número con la cantidad de registros que se deben saltar
 * @param {*} page El numero de la página actual
 * @param {*} limit El numero de la cantidad de registros a mostrar
 * @returns
 */
export const calcularOffset = (page = 1, limit = 10) => {
  if (page === 0) page = 1;
  return (Number.parseInt(page) - 1) * Number.parseInt(limit);
};

/**
 * Muestra un mensaje encapsulado con *
 * @param {string} message
 * @param {string} color
 * @param {string} userId
 * @returns {string} Devuelve Fecha, Hora y Ip del usuario
 */
export const consoleConnection = (message, color = "white", userId) => {
  const sizeBorder = 75;
  const border = "*".repeat(sizeBorder);
  const colors = {
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
  if (
    userId &&
    userId !== null &&
    userId !== undefined &&
    obtenerSocketsPorUsuario(userId)
  ) {
    const address =
      obtenerSocketsPorUsuario(userId).socketActual?.handshake.address;
    tag = `${tag} ${address}`;
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

export const getHoraCubaText = () => {
  // Formato: "HH:mm:ss A" (ej: "14:30:00 PM")
  return moment().tz("America/Havana").format("hh:mm:ss A");
};

export const getFechaCuba = () => {
  // Retorna un Date en UTC que representa el inicio del día en Cuba (00:00 hora local)
  return moment().tz("America/Havana").startOf("day").toDate();
};
export const getFechaCubaText = () => {
  // Formato: "dd-MM-yyyy"
  return moment().tz("America/Havana").format("DD-MM-YYYY");
};

export const convertImagetoURL = async (image_name) => {
  const imagePath = path.join(process.cwd(), "public", "img", image_name);
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const dataUrl = `data:image/png;base64,${base64Image}`;
  return dataUrl;
};

/**
 * Devuelve un json con el objeto incluido con el evento required
 * @param {*} option Opciones que debe ser incluidas
 * @returns {JSON} Retorna el elemento incluido con el argumento required
 */
export const requerir = (option) => {
  return { ...option, required: true };
};

export default {
  __filename,
  __dirname,
  unir,
  minutesToMiliseconds,
};
