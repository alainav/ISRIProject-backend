import { prepararAdministrador } from "./userFormatters.js";
import { prepararDireccion } from "./addressFormatters.js";
import { safeData } from "../database/dataHelpers.js";

export const prepararReferido = (referred) => ({
  ...prepararAdministrador(referred.Administrador),
  ...prepararDireccion(referred),
  referralsLink: safeData(referred).link,
  points: safeData(referred).puntos,
});
