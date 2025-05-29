// src/helpers/dataFormatters/listFormatters.js
import { optionalMap } from "../database/dataHelpers.js";
import { prepararMunicipio } from "./addressFormatters.js";
import { prepararProvincia } from "./addressFormatters.js";
import { prepararAdministrador } from "./userFormatters.js";
import { prepararDestinatario } from "./recipientFormatters.js";
import { prepararReferido } from "./referralFormatters.js"; // Importación directa
import { prepararProducto, prepararCategoria } from "./productFormatters.js";
import { prepararProductoTienda } from "./productFormatters.js";
import { prepararSolicitud } from "./productFormatters.js";
import { prepararPendiente } from "./pendingFormatters.js";
import { prepararReparto } from "./addressFormatters.js";
import { prepararEstado } from "./statusFormatters.js";

// Funciones normales
export const [
  prepararEnvioMunicipios,
  prepararEnvioProvincias,
  prepararEnvioAdministradores,
  prepararEnvioDestinatarios,
  prepararEnvioReferidos,
  prepararEnvioProductos,
  prepararEnvioCategorias,
  prepararEnvioProductosTienda,
  prepararEnvioSolicitudes,
  prepararEnvioPendientes,
  prepararEnvioRepartos,
  prepararEnvioEstados,
] = [
  prepararMunicipio,
  prepararProvincia,
  prepararAdministrador,
  prepararDestinatario,
  prepararReferido,
  prepararProducto,
  prepararCategoria,
  prepararProductoTienda,
  prepararSolicitud,
  prepararPendiente,
  prepararReparto,
  prepararEstado,
].map((fn) => (items) => optionalMap(items, fn));

// Funciones asincrónicas especiales
export { prepararEnvioClientes } from "./clientFormatters.js";
export const prepararEnvioPaquetes = (packages) =>
  Promise.all(packages.map(prepararPaquete));
