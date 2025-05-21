import { safeData, optionalMap } from "../database/dataHelpers.js";
import { prepararProducto } from "./productFormatters.js";
import Estado from "../../API/models/db/Estado.js";
import { prepararDestinatario } from "./recipientFormatters.js";

export const prepararPaquete = async (pack) => {
  const { information, personalPack, requestPack, storePack } = pack;
  const { idPaquete, usuario, Destinatario, fCreado, hCreado, idEstado } =
    safeData(information);

  const status = await Estado.findByPk(idEstado);
  const totalCost =
    storePack?.reduce(
      (acc, { cantidad, costo }) => acc + cantidad * costo,
      0
    ) || 0;

  return {
    information: {
      id: idPaquete,
      userName: usuario,
      addressee: prepararDestinatario(Destinatario),
      dateCreated: fCreado,
      timeCreated: hCreado,
      status: status?.dataValues.nombreEstado || "",
      ...(storePack && { totalCost }),
    },
    personalPack: optionalMap(personalPack, (p) => ({
      ...prepararProducto(p.Producto),
      amount: p.cantidad,
    })),
    requestPack: optionalMap(requestPack, (p) => ({
      ...prepararProducto(p.Producto),
      amount: p.cantidad,
      productLink: p.enlaceProd,
      store: p.Tienda ? safeData(p.Tienda).nombreTienda : null,
    })),
    storePack: optionalMap(storePack, (p) => ({
      ...prepararProducto(p.Producto),
      amount: p.cantidad,
      cost: p.costo,
      totalPoints: p.cantidad * p.costo,
    })),
  };
};
