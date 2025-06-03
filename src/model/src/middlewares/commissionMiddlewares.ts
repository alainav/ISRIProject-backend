import { NextFunction, Request, Response } from "express";
import Comision from "../models/Comision.js";
import Edicion from "../models/Edicion.js";
import { getFechaCuba } from "../../../utils/utils.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";

const verifyCommissionOperation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const comision = await Comision.findByPk(id);

  if (!comision) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. ID ${id} no encontrado en comisiones`
    );
    res.status(400).json(response);
    return;
  }

  const edition = await Edicion.findByPk(comision.id_edicion);

  if (!edition) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. ID ${comision.id_edicion} no encontrado en ediciones`
    );
    res.status(400).json(response);
    return;
  }

  if (getFechaCuba().getTime() > new Date(edition.f_fin).getTime()) {
    const response = new GeneralResponse(
      false,
      `Operación denegada. La comisión ${comision.nombre} no puede ser eliminada, la edición asociada culminó el ${edition.f_fin}`
    );
    res.status(400).json(response);
    return;
  }

  return next();
};

export default {
  verifyCommissionOperation,
};
