import { safeData } from "../database/dataHelpers.js";
import { prepararDireccion } from "./addressFormatters.js";

export const prepararDestinatario = (recipient) => ({
  ...prepararDireccion(recipient),
  ...Object.fromEntries(
    Object.entries({
      id: "idDestinatario",
      identityCard: "CI",
      firstName: "pNombre",
      secondName: "sNombre",
      firstSurname: "aPaterno",
      secondSurname: "aMaterno",
      phone: "celular",
    }).map(([key, val]) => [key, safeData(recipient)[val]])
  ),
});
