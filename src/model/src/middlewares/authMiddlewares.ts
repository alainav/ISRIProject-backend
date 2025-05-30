import { NextFunction, Request, Response } from "express";
import Representante from "../models/Representante.js";

const verifyCorreoUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await Representante.findOne({
    where: { correo: req.body.email },
  });
  if (!user) return next();

  res.status(400).json({ message: "Este correo ya existe" });
};

const verifyUserName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await Representante.findOne({
    where: { usuario: req.body.userName },
  });
  if (!user) return next();

  res
    .status(400)
    .json({ message: "Este nombre de usuario ya existe. Cambielo" });
};

export const registerValidator = [verifyCorreoUnique, verifyUserName];
