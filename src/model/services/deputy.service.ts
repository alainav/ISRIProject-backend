import moment from "moment";
import {
  firstOfEachWordtoUpperCase,
  generateRandomNumberExtended,
} from "../../server/helpers/estandarizadores.js";
import { addYears, getFechaCuba } from "../../utils/utils.js";
import { ILoginRequest } from "../interfaces/ILoginRequest.js";
import { ILoginResponse } from "../interfaces/ILoginResponse.js";
import { IRegisterUserRequest } from "../interfaces/IRegisterUserRequest.js";
import { IRegistrerResponse } from "../interfaces/IRegistrerResponse.js";
import Comision from "../models/Comision.js";
import Pais from "../models/Pais.js";
import Representante from "../models/Representante.js";
import Rol from "../models/Rol.js";
import { createToken } from "../utils/generateJWT.js";
import { comparePassword } from "../utils/hashearPassword.js";
import { IGeneralResponse } from "../interfaces/IGeneralResponse.js";
import GeneralResponse from "../models/estandar/GeneralResponse.js";
import { ICountry } from "../interfaces/ICountry.js";

export class AuthService {
  async loginService(requestData: ILoginRequest): Promise<ILoginResponse> {
    try {
      const user = await Representante.findOne({
        where: { usuario: requestData.userName },
        include: Rol,
      });
      if (!user)
        throw new Error(`Usuario ${requestData.userName} no encontrado`);

      if (!requestData.code_access)
        throw new Error(`El código de acceso (code_access) es obligatorio`);
      if (comparePassword(requestData.code_access, user.c_acceso)) {
        const token = await createToken(
          requestData.userName,
          user.id_rol,
          user.correo
        );

        const role = await Rol.findByPk(user.id_rol);
        const country = await Pais.findByPk(user.id_pais);
        return {
          success: true,
          message: "Acceso Concedido",
          token,
          role: role?.nombre,
          country: country?.nombre,
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

  async registerService(
    requestData: IRegisterUserRequest
  ): Promise<IRegistrerResponse> {
    try {
      const codeAccess = generateRandomNumberExtended();

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
      const f_expiracion = addYears(getFechaCuba(), 1);

      // 3. Crear y guardar representante
      const representante = await Representante.create({
        usuario: requestData.userName,
        correo: requestData.email,
        p_nombre: firstOfEachWordtoUpperCase(requestData.first_name),
        s_nombre:
          requestData.second_name && requestData.second_name !== ""
            ? firstOfEachWordtoUpperCase(requestData.second_name)
            : null,
        p_apellido: firstOfEachWordtoUpperCase(requestData.first_surname),
        s_apellido: firstOfEachWordtoUpperCase(requestData.second_surname),
        c_acceso: codeAccess,
        estado: true,
        id_rol: rol.dataValues.id_rol,
        id_pais: pais.dataValues.id_pais,
        f_expiracion,
        f_registro,
      });

      const token = await createToken(
        requestData.userName,
        requestData.role,
        representante.correo
      );

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
        status: "Activo",
        date_register: representante.f_registro,
        date_expired: representante.f_expiracion,
        token,
      };
    } catch (error: any) {
      console.error("Error en servicio de registro:", error);

      throw error;
    }
  }

  async updateDeputyService(
    data: IRegisterUserRequest
  ): Promise<IRegistrerResponse> {
    try {
      let {
        userName,
        name,
        first_name,
        second_name,
        first_surname,
        second_surname,
        role,
        roleName,
        country,
        countryName,
      } = data;

      if (name) {
        (first_name = name.first_name ? name.first_name : first_name),
          (second_name =
            name.second_name || name.second_name === null
              ? name.second_name
              : second_name),
          (first_surname = name.first_surname
            ? name.first_surname
            : first_surname),
          (second_surname = name.second_surname
            ? name.second_surname
            : second_surname);
      }

      // 1. Buscar entidades relacionadas
      const representante = await Representante.findOne({
        where: {
          usuario: userName,
        },
      });

      if (!representante) {
        throw new Error(
          `El usuario ${userName} no se encuentra asociado a ningun representante`
        );
      }

      await representante.update({
        usuario: userName?.toLowerCase(),
        p_nombre: firstOfEachWordtoUpperCase(first_name),
        s_nombre: second_name
          ? firstOfEachWordtoUpperCase(second_name)
          : second_name,
        p_apellido: firstOfEachWordtoUpperCase(first_surname),
        s_apellido: firstOfEachWordtoUpperCase(second_surname),
        id_rol: role,
        id_pais: country,
      });

      const token = await createToken(
        representante.usuario,
        representante.id_rol,
        representante.correo
      );

      // 5. Retornar respuesta
      return {
        userName: representante.usuario,
        email: representante.correo,
        first_name: representante.p_nombre,
        second_name: representante.s_nombre || undefined,
        first_surname: representante.p_apellido,
        second_surname: representante.s_apellido,
        role: roleName || "Sin definir",
        country: countryName || "Sin definir",
        code_access: representante.c_acceso,
        message: "Usuario actualizado correctamente",
        success: true,
        status: representante.estado ? "Activo" : "Inactivo",
        date_register: representante.f_registro,
        date_expired: representante.f_expiracion,
        token,
      };
    } catch (error: any) {
      console.error("Error en servicio de registro:", error);

      throw error;
    }
  }

  async deleteDeputyPermanentService(
    userName: string
  ): Promise<IGeneralResponse> {
    try {
      // 1. Buscar entidades relacionadas
      const representante = await Representante.findOne({
        where: {
          usuario: userName,
        },
      });

      if (!representante) {
        throw new Error(
          `El usuario ${userName} no se encuentra asociado a ningun representante`
        );
      }

      await representante.destroy();

      const response = new GeneralResponse(
        true,
        `Representante ${representante.p_nombre} ${representante.p_apellido} eliminado de forma permanente`
      );
      // 5. Retornar respuesta
      return response.data;
    } catch (error: any) {
      console.error("Error en servicio de eliminación permanente:", error);

      throw error;
    }
  }

  async deleteDeputyService(userName: string): Promise<IGeneralResponse> {
    try {
      // 1. Buscar entidades relacionadas
      const representante = await Representante.findOne({
        where: {
          usuario: userName,
        },
      });

      if (!representante) {
        throw new Error(
          `El usuario ${userName} no se encuentra asociado a ningun representante`
        );
      }

      await representante.update({
        estado: false,
      });

      const response = new GeneralResponse(
        true,
        `Representante ${representante.p_nombre} ${representante.p_apellido} desactivado`
      );
      // 5. Retornar respuesta
      return response.data;
    } catch (error: any) {
      console.error("Error en servicio de eliminación:", error);

      throw error;
    }
  }

  async reactivateDeputyService(email: string): Promise<IGeneralResponse> {
    try {
      // 1. Buscar entidades relacionadas
      const representante = await Representante.findByPk(email);

      if (!representante) {
        throw new Error(
          `El correo ${email} no se encuentra asociado a ningun representante`
        );
      }

      const f_expiracion = addYears(getFechaCuba(), 1);
      await representante.update({
        estado: true,
        f_expiracion,
      });

      const response = new GeneralResponse(
        true,
        `Representante ${representante.p_nombre} ${
          representante.p_apellido
        } activado, expira el ${f_expiracion.toUTCString()}`
      );
      // 5. Retornar respuesta
      return response.data;
    } catch (error: any) {
      console.error("Error en servicio de reactivación:", error);

      throw error;
    }
  }

  async getDeputyCountryService(userName: string): Promise<IGeneralResponse> {
    try {
      // 1. Buscar entidades relacionadas
      const representante = await Representante.findOne({
        where: { usuario: userName },
      });

      if (!representante) {
        throw new Error(
          `El usuario ${userName} no se encuentra asociado a ningun representante`
        );
      }

      const country = await Pais.findByPk(representante.id_pais);

      const deputyCountry = {
        id: country?.id_pais,
        name: country?.nombre,
      };

      const response = new GeneralResponse(
        true,
        "Pais del usuario",
        undefined,
        deputyCountry
      );
      // 5. Retornar respuesta
      return response.data;
    } catch (error: any) {
      console.error("Error en servicio de reactivación:", error);

      throw error;
    }
  }
}
