import { NextFunction, Request, response, Response } from "express";
import Representante from "../models/Representante.js";
import Rol from "../models/Rol.js";
import Pais from "../models/Pais.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";
import { verifyToken } from "../utils/generateJWT.js";

const rolesInválidos = [
  "Representante",
  "Presidente de Comisión",
  "Secretario de Comisión",
];
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

const verifyIdRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.body;

  const rol = await Rol.findByPk(role);

  if (!rol) {
    res.status(400).json({
      message: `El rol asociado al ID ${role} no existe`,
      success: false,
    });
  } else {
    req.body.roleName = rol.dataValues.nombre;
    return next();
  }
};

const verifyIdCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { country } = req.body;

  const pais = await Pais.findByPk(country);

  if (!pais) {
    res.status(400).json({
      message: `El país asociado al ID ${country} no existe`,
      success: false,
    });
  } else {
    req.body.countryName = pais.dataValues.nombre;
    return next();
  }
};

const verifyIdDeputy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userName } = req.params;

  const representante = await Representante.findOne({
    where: { usuario: userName },
  });

  if (!representante) {
    const response = new GeneralResponse(
      false,
      `El representante asociado al usuario ${userName} no existe`
    );
    res.status(400).json(response.data);
  } else {
    req.body.deputyUserName = representante.usuario;
    req.body.email = representante.correo;
    return next();
  }
};

const verifyAccessByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, deputyUserName } = req.body;

  const { roleName, userName, success, message } = verifyToken(token);
  if (!success) {
    res.status(400).json({ success, message });
    return;
  }

  req.body.decodedToken = {
    userName,
    roleName,
  };

  if (deputyUserName && userName && roleName) {
    if (deputyUserName !== userName && rolesInválidos.includes(roleName)) {
      const response = new GeneralResponse(
        false,
        "Operación denegada. Privilegios Ínvalidos"
      );
      res.status(400).json(response);
      return;
    }
  } else if (
    roleName !== "Presidente General" &&
    roleName !== "Secretario General" &&
    roleName !== "Administrador"
  ) {
    const response = new GeneralResponse(
      false,
      "Operación denegada. Privilegios Ínvalidos"
    );
    res.status(400).json(response);
    return;
  }

  return next();
};

const verifyAccessByTokenAndContinue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, deputyUserName } = req.body;

  const { roleName, userName, success, message, email } = verifyToken(token);
  if (!success) {
    res.status(400).json({ success, message });
    return;
  }

  //Me da la información del usuario logueado
  req.body.actualUser = {
    roleName,
    userName,
    email,
  };
  return next();
};

const verifyDeputyByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  const { roleName, userName, success, message } = verifyToken(token);
  if (!success) {
    res.status(400).json({ success, message });
    return;
  }

  const deputy = await Representante.findOne({ where: { usuario: userName } });

  if (roleName !== "Representante") {
    const response = new GeneralResponse(
      false,
      "Operación denegada. Privilegios Inválidos"
    );
    res.status(400).json(response);
    return;
  }

  req.body.country = deputy?.id_pais;

  return next();
};

const comprobateIdRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.body;
  if (!role) {
    return next();
  }
  return verifyIdRole(req, res, next);
};

const comprobateIdCountry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { country } = req.body;
  if (!country) {
    return next();
  }
  return verifyIdCountry(req, res, next);
};

const comprobateIdDeputy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userName } = req.params;
  if (!userName) {
    const response = new GeneralResponse(
      false,
      "El usuario del representante es obligatorio"
    );
    res.status(404).json(response.data);
  }
  return verifyIdDeputy(req, res, next);
};

export default {
  verifyCorreoUnique,
  verifyUserName,
  verifyIdRole,
  verifyIdCountry,
  verifyIdDeputy,
  verifyAccessByToken,
  verifyDeputyByToken,
  verifyAccessByTokenAndContinue,
  comprobateIdRole,
  comprobateIdCountry,
  comprobateIdDeputy,
};
