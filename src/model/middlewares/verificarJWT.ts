import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { globalEnv } from "../config/configEnv.js";

declare module "express" {
  interface Request {
    userName?: string;
  }
}

export const verificarJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.headers.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Acceso denegado. No se ha proporcionado el token.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token as string, globalEnv.KEY_JWT) as {
      userName: string;
    };
    // Adjuntar el nombre de usuario al request para usarlo después
    req.userName = decoded.userName;

    return next();
  } catch (error) {
    let message = "Token inválido";

    if (error instanceof jwt.TokenExpiredError) {
      message = "Token expirado";
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Token malformado";
    }

    res.status(403).json({
      success: false,
      message: `Error de autenticación: ${message}`,
    });
  }
};
