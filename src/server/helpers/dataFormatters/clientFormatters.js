import { prepararAdministrador } from "./userFormatters.js";
import { prepararDireccion } from "./addressFormatters.js";
import { safeData } from "../database/dataHelpers.js";
import Cliente from "../../API/models/db/Cliente.js";
import Paquete from "../../API/models/db/Paquete.js";
import Pend_Puntuacion from "../../API/models/db/Pend_Puntuacion.js";

const prepararDatosCliente = (data) => ({
  address: {},
  cps: data.CPS,
  points: data.puntos,
  referralsLink: data.link,
  referrerEmail: data.correoInv || "free",
});

export const prepararCliente = async (client) => {
  const baseClient = prepararAdministrador(client);
  const { Cliente: clienteData, CPS: cpsData } = safeData(client);

  const mergedClient = {
    ...baseClient,
    ...(clienteData && {
      ...prepararDatosCliente(clienteData),
      ...prepararDireccion(clienteData),
    }),
    ...(cpsData && {
      ...prepararDatosCliente(cpsData),
      ...prepararDireccion(client),
    }),
  };

  const [numberReferrals, numberPackages, pendingPointsCount] =
    await Promise.all([
      Cliente.count({ where: { correoInv: mergedClient.mail } }),
      Paquete.count({ where: { usuario: mergedClient.userName } }),
      Pend_Puntuacion.count({ where: { usuario: mergedClient.userName } }),
    ]);

  return {
    ...mergedClient,
    numberReferrals,
    numberPackages,
    pendingPoints: pendingPointsCount !== 0,
  };
};

// Función especial para listado
export const prepararEnvioClientes = (clients) =>
  Promise.all(clients.map(prepararCliente));
