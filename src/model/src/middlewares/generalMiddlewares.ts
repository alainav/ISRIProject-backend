import { NextFunction, Request, Response } from "express";
import Comision from "../models/Comision.js";
import Edicion from "../models/Edicion.js";
import { getFechaCuba } from "../../../utils/utils.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";
import Votacion from "../models/Votacion.js";

let flag = true;
const verifyCommissionOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { id } = req.params;
  const { auxId } = req.body;

  id = auxId ? auxId : id;

  const comision = await Comision.findByPk(id);

  if (!comision) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. ID ${id} no encontrado en comisiones`
    );
    res.status(400).json(response);
    flag = false;
    return;
  }

  req.body.auxId = comision.id_edicion;

  await verifyEditionOperation(req, res, next);

  req.body.auxId = undefined;

  if (!flag && !auxId) {
    flag = true;
    return;
  }

  if (auxId) {
    return;
  }

  return next();
};

const verifyVotingOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
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

  req.body.auxId = voting.id_comision;

  await verifyCommissionOperation(req, res, next);

  req.body.auxId = undefined;

  if (!flag) {
    flag = true;
    return;
  }

  return next();
};

const verifyEditionOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { id } = req.params;
  const { auxId } = req.body;

  id = auxId ? auxId : id;
  const edition = await Edicion.findByPk(id);
  if (!edition) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. ID ${id} no encontrado en las ediciones`
    );
    res.status(400).json(response);
    flag = false;
    return;
  }

  if (getFechaCuba().getTime() > new Date(edition.f_fin).getTime()) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. Todas las operaciones de escritura sobre la edición ${
        edition.nombre
      } están limitadas, la edición culminó el ${new Date(
        edition.f_fin
      ).toLocaleDateString()}`
    );
    res.status(400).json(response);
    flag = false;
    return;
  }

  if (auxId) {
    return;
  }

  return next();
};

export default {
  verifyCommissionOperation,
  verifyEditionOperation,
  verifyVotingOperation,
};
