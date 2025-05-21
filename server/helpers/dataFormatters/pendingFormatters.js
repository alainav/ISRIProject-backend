import { prepararUsuario } from "./userFormatters.js";

export const prepararPendiente = (pending) => ({
  ...prepararUsuario(pending.Usuario),
  dateLastShipping: pending.dataValues.fechaEnvio,
  quantityShippingUnassigned: pending.dataValues.cantidad,
});
