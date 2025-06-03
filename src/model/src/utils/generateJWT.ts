import jwt from "jsonwebtoken";
import { globalEnv } from "../config/configEnv.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";
import Rol from "../models/Rol.js";
import { ITokenStructure } from "../interfaces/ITokenStructure.js";

const secretKey = globalEnv.KEY_JWT;
export const createToken = async (
  userName: string | undefined,
  role: number | undefined,
  email: string
): Promise<string> => {
  if (!secretKey) {
    throw new Error("No se encontro el valor de la clave del token");
  }

  let payload;

  if (role) {
    const rol = await Rol.findByPk(role);
    const roleName: string | undefined = rol?.dataValues.nombre;

    payload = { userName, roleName, role, email };
  } else {
    payload = { userName, email };
  }

  const token: string = jwt.sign(payload, secretKey, {
    expiresIn: "12h",
  });

  return token;
};

export const verifyToken = (token: string): ITokenStructure => {
  let response;
  try {
    if (token === null || token === undefined) {
      response = new GeneralResponse(false, "El token es obligatorio");
      return { ...response.data, userName: "", email: "" };
    }

    if (!secretKey) {
      throw new Error("No se encontro el valor de la clave del token");
    }

    let payload = JSON.parse(JSON.stringify(jwt.verify(token, secretKey)));
    return {
      success: true,
      role: payload.role,
      roleName: payload.roleName,
      userName: payload.userName,
      email: payload.email,
    };
  } catch (error: any) {
    response = new GeneralResponse(false, error.message, error);
    return { ...response.data, userName: "", email: "" };
  }
};
