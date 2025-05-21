import jwt from "jsonwebtoken";
import { PRIVATEKEY } from "../utils/utils.js";
import Usuario from "../API/models/db/Usuario.js";

/**
 *Devuelve un json web token que contiene en el payload el uid enviado
 * @param {*} uid El identificador que desea se almacene en el token
 * @returns Un Json Web Token con una duración de 30 minutos
 */
export const generarJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      PRIVATEKEY,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log("Error en generar token " + err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

/**
 * Verifica que el JWT (Json Web Token) sea válido y no halla sido alterado
 * @param {*} token Token enviado por el usuario
 * @param {*} model Modelo en el cual se desea se busque el payload del token
 * @returns false | null | JSON(Elemento encontrado en el `model` enviado)
 */
export const comprobarJWT = async (token, model) => {
  try {
    if (token === null) {
      return null;
    }

    const { uid: correo } = jwt.verify(token, PRIVATEKEY);

    const element = await model.findOne({ where: { correo } });

    if (element) {
      if (element.dataValues.estado) return element;
      else return false;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export default generarJWT;
