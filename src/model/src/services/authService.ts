import moment from "moment";
import { generateRandomNumberExtended } from "../../../server/helpers/estandarizadores.js";
import { getFechaCuba } from "../../../utils/utils.js";
import { ILoginRequest } from "../interfaces/ILoginRequest.js";
import { ILoginResponse } from "../interfaces/ILoginResponse.js";
import { IRegisterUserRequest } from "../interfaces/IRegisterUserRequest.js";
import { IRegistrerResponse } from "../interfaces/IRegistrerResponse.js";
import Comision from "../models/Comision.js";
import Pais from "../models/Pais.js";
import Representante from "../models/Representante.js";
import Rol from "../models/Rol.js";
import { createToken } from "../utils/generateJWT.js";
import { comparePassword, hashearPassword } from "../utils/hashearPassword.js";

export class AuthService {
  async registerService(
    requestData: IRegisterUserRequest
  ): Promise<IRegistrerResponse> {
    const codeAccess = generateRandomNumberExtended();

    try {
      // 1. Buscar entidades relacionadas
      const pais = await Pais.findOne({
        where: { id_pais: requestData.country },
      });
      if (!pais) throw new Error(`País ${requestData.country} no encontrado`);

      const rol = await Rol.findOne({ where: { id_rol: requestData.role } });
      if (!rol) throw new Error(`Rol con ID ${requestData.role} no encontrado`);

      let comision = null;
      if (
        requestData.commission !== null &&
        requestData.commission !== undefined
      ) {
        comision = await Comision.findOne({
          where: { id_comision: requestData.commission },
        });
        if (!comision)
          throw new Error(
            `Comision con ID ${requestData.commission} no encontrado`
          );
      }

      // 2. Crear fechas
      const f_registro = getFechaCuba();
      const f_expiracion = new Date(
        getFechaCuba().setFullYear(getFechaCuba().getFullYear() + 1)
      );

      console.log("CCAAS", comision?.dataValues?.id_comision);
      // 3. Crear y guardar representante
      const representante = await Representante.create({
        usuario: requestData.userName,
        correo: requestData.email,
        p_nombre: requestData.first_name,
        s_nombre: requestData.second_name || null,
        p_apellido: requestData.first_surname,
        s_apellido: requestData.second_surname,
        c_acceso: codeAccess,
        estado: true,
        f_registro: f_registro,
        f_expiracion: f_expiracion,
        id_rol: rol.dataValues.id_rol,
        id_pais: pais.dataValues.id_pais,
        id_comision: comision?.dataValues?.id_comision || null,
      });

      // 5. Retornar respuesta
      return {
        userName: representante.usuario,
        email: representante.correo,
        first_name: representante.p_nombre,
        second_name: representante.s_nombre || undefined,
        first_surname: representante.p_apellido,
        second_surname: representante.s_apellido,
        role: rol.dataValues.nombre,
        country: pais.dataValues.nombre,
        code_access: codeAccess,
        message: "Usuario registrado correctamente",
        success: true,
        status: true,
        date_register: f_registro,
        date_expired: f_expiracion,
      };
    } catch (error: any) {
      console.error("Error en servicio de registro:", error);

      throw error;
    }
  }

  async loginService(requestData: ILoginRequest): Promise<ILoginResponse> {
    try {
      const user = await Representante.findOne({
        where: { usuario: requestData.userName },
        include: Rol,
      });
      if (!user)
        throw new Error(`Usuario ${requestData.userName} no encontrado`);

      console.log("USUARIO", user);
      if (comparePassword(requestData.code_access, user.c_acceso)) {
        const token = createToken(requestData.userName);
        return {
          success: true,
          message: "Acceso Concedido",
          token,
          role: user.dataValues.id_rol.toString(),
        };
      } else {
        return {
          success: false,
          message: "Acceso Denegado",
          token: undefined,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
