import jwt from "jsonwebtoken";
import { Model } from "sequelize";
import { PRIVATEKEY } from "../../utils/utils.js";

export const generarJWT = (uid = ""): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, PRIVATEKEY, { expiresIn: "2h" }, (err, token) => {
      if (err || !token) {
        console.error("Error en generar token", err);
        reject("No se pudo generar el token");
      } else {
        resolve(token);
      }
    });
  });
};

export const comprobarJWT = async <T extends Model<any, any>>(
  token: string | null,
  model: { new (): T } & typeof Model
): Promise<T | null | boolean> => {
  try {
    if (!token) return null;

    const decoded = jwt.verify(token, PRIVATEKEY) as { uid: string };
    const element = await model.findOne({ where: { correo: decoded.uid } });

    if (!element) return null;
    return element.dataValues.estado ? element : false;
  } catch (error) {
    return null;
  }
};

export default generarJWT;
