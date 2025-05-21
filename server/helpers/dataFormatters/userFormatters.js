import { safeData } from "../database/dataHelpers.js";
import { prepararDireccion } from "./addressFormatters.js";

export const prepararUsuario = (entity) => {
  const { usuario, fCreado, estado, message } = safeData(entity);
  return {
    userName: usuario,
    createdDate: fCreado,
    state: estado ? "Activo" : "Eliminado",
    ...(message && { message }),
  };
};

export const prepararAdministrador = (admin) => {
  const {
    correo,
    pNombre,
    sNombre,
    aPaterno,
    aMaterno,
    celular,
    codVerif,
    Usuario,
  } = safeData(admin);
  return {
    mail: correo,
    firstName: pNombre,
    secondName: sNombre,
    firstSurname: aPaterno,
    secondSurname: aMaterno,
    phone: celular,
    verified: codVerif === "verificado",
    ...(Usuario && prepararUsuario(Usuario)),
  };
};
