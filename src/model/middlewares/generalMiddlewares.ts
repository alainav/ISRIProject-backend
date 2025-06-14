import { NextFunction, Request, Response } from "express";
import Comision from "../models/Comision.js";
import Edicion from "../models/Edicion.js";
import { getFechaCuba, getFechaCubaText } from "../../utils/utils.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";
import Votacion from "../models/Votacion.js";

const verifyCommissionOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { id } = req.params;
  const { idCommission } = req.body;

  id = idCommission ? idCommission : id;

  const comision = await Comision.findByPk(id);

  if (!comision) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. ID ${id} no encontrado en comisiones`
    );
    res.status(400).json(response);
    return;
  }

  req.body.idEdicion = comision.id_edicion;

  return next();
};

const verifyVotingOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    const response = new GeneralResponse(
      false,
      `Operación denegada. El identificador es obligatorio`
    );
    res.status(400).json(response);
    return;
  }

  const voting = await Votacion.findByPk(id);

  if (!voting) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. ID ${id} no encontrado en las votaciones`
    );
    res.status(400).json(response);
    return;
  }

  if (
    voting.fecha &&
    voting.fecha !== null &&
    voting.hora !== null &&
    voting.hora !== "null" &&
    voting.hora
  ) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. La votación ${
        voting.nombre
      } fue cerrada el ${new Date(voting.fecha).toLocaleDateString()} a las ${
        voting.hora
      }`
    );
    res.status(400).json(response);
    return;
  }

  req.body.idCommission = voting.id_comision;

  return next();
};

const verifyEditionOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { id } = req.params;
  const { idEdicion } = req.body;

  id = idEdicion ? idEdicion : id;
  const edition = await Edicion.findByPk(id);
  if (!edition) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. ID ${id} no encontrado en las ediciones`
    );
    res.status(400).json(response);
    return;
  }

  if (
    new Date(getFechaCubaText()).getTime() > new Date(edition.f_fin).getTime()
  ) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. Todas las operaciones de escritura sobre la edición ${
        edition.nombre
      } están limitadas, la edición culminó el ${new Date(
        edition.f_fin
      ).toLocaleDateString()}`
    );
    res.status(400).json(response);
    return;
  }

  return next();
};

export default {
  verifyCommissionOperation,
  verifyEditionOperation,
  verifyVotingOperation,
};
