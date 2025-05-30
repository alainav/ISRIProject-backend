import jwt from "jsonwebtoken";
import { globalEnv } from "../config/configEnv.js";

export const createToken = (userName: string | undefined): string => {
  const secretKey = globalEnv.KEY_JWT;

  if (!secretKey) {
    throw new Error("No se encontro el valor de la clave del token");
  }

  const token: string = jwt.sign({ userName }, secretKey, { expiresIn: "30d" });

  return token;
};
