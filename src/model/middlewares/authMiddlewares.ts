import { NextFunction, Request, response, Response } from "express";
import Representante from "../models/Representante.js";
import Rol from "../models/Rol.js";
import Pais from "../models/Pais.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";
import { verifyToken } from "../utils/generateJWT.js";

const rolesInvalidos = ["Representante", "Miembro Observador"];
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

  if (!role) {
    res.status(400).json({
      message: `ID del Rol (role) es obligatorio`,
      success: false,
    });
    return;
  }

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

  if (!roleName) {
    const response = new GeneralResponse(
      false,
      "Operación denegada. Rol no encontrado"
    );
    res.status(400).json(response);
    return;
  }

  if (rolesInvalidos.includes(roleName)) {
    const response = new GeneralResponse(
      false,
      "Operación denegada. Privilegios Inválidos"
    );
    res.status(400).json(response);
    return;
  } else if (deputyUserName && userName && roleName) {
    if (deputyUserName !== userName && rolesInvalidos.includes(roleName)) {
      const response = new GeneralResponse(
        false,
        "Operación denegada. Privilegios Inválidos"
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
      "Operación denegada. Privilegios Inválidos"
    );
    res.status(400).json(response);
    return;
  }

  const { data } = req.body;
  req.body.data = limpiarEspacios(data);

  return next();
};

const verifyAccessByCommission = async (
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

  if (!roleName) {
    res.status(400).json({ success, message });
    return;
  }

  if (deputyUserName && userName && roleName) {
    if (rolesInvalidos.includes(roleName)) {
      const response = new GeneralResponse(
        false,
        "Operación denegada. Privilegios Inválidos"
      );
      res.status(400).json(response);
      return;
    }
  } else if (rolesInvalidos.includes(roleName)) {
    const response = new GeneralResponse(
      false,
      "Operación denegada. Privilegios Inválidos"
    );
    res.status(400).json(response);
    return;
  }

  const { data } = req.body;
  req.body.data = limpiarEspacios(data);

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

  const { data } = req.body;
  req.body.data = limpiarEspacios(data);

  //Me da la información del usuario logueado
  req.body.actualUser = {
    roleName,
    userName,
    email,
  };

  return next();
};

const limpiarEspacios = (data: any) => {
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (typeof data[key] === "string") {
        data[key] = data[key].trim();
      }
    }
  }

  return data;
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

  if (roleName !== "Representante" && roleName !== "Miembro Observador") {
    const response = new GeneralResponse(
      false,
      "Operación denegada. Privilegios Inválidos"
    );
    res.status(400).json(response);
    return;
  }

  const deputy = await Representante.findOne({ where: { usuario: userName } });

  req.body.country = deputy?.id_pais;

  const { data } = req.body;
  req.body.data = limpiarEspacios(data);

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
  verifyAccessByCommission,
  verifyAccessByTokenAndContinue,
  comprobateIdRole,
  comprobateIdCountry,
  comprobateIdDeputy,
};
