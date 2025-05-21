import { safeData } from "../database/dataHelpers.js";

export const prepararEstado = (status) => {
  const { idEstado, nombreEstado } = safeData(status);
  return { id: idEstado, name: nombreEstado };
};
