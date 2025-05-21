import { safeData } from "../database/dataHelpers.js";

export const prepararDireccion = (entity) => {
  const { Municipio, calle = "", numero = "", Reparto } = safeData(entity);
  return {
    address: {
      town: Municipio ? prepararMunicipio(Municipio) : null,
      street: calle,
      department: numero,
      zone: Reparto ? prepararReparto(Reparto).zone : "",
    },
  };
};

export const prepararMunicipio = (entity) => {
  const { codMcpio, nombreMcpio, codigoPostal, Provincium } = safeData(entity);
  return {
    id: codMcpio ?? null,
    town: nombreMcpio || "",
    postalCode: codigoPostal || "00000",
    province: Provincium ? prepararProvincia(Provincium) : null,
  };
};

export const prepararProvincia = (entity) => {
  const { codProvincia, nombreProv } = safeData(entity);
  return { id: codProvincia, province: nombreProv };
};

export const prepararReparto = (zone) => {
  const { nombreReparto, idReparto } = safeData(zone);
  return { zone: nombreReparto, id: idReparto };
};
