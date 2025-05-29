import { generateRandomNumber } from "../../../server/helpers/estandarizadores.js";
import { ILoginRequest } from "../interfaces/ILoginRequest.js";
import { ILoginResponse } from "../interfaces/ILoginResponse.js";
import { IRegisterUserRequest } from "../interfaces/IRegisterUserRequest.js";
import { IRegistrerResponse } from "../interfaces/IRegistrerResponse.js";
import { Pais } from "../models/Pais.js";
import { Representante } from "../models/Representante.js";
import { Rol } from "../models/Rol.js";
import { createToken } from "../utils/generateJWT.js";
import { generateKeyAccess } from "../utils/generateKeyAccess.js";
import { comparePassword, hashearPassword } from "../utils/hashearPassword.js";

export class AuthService {
  async registerService(
    requestData: IRegisterUserRequest
  ): Promise<IRegistrerResponse> {
    const codeAccess = generateRandomNumber();

    try {
      // 1. Buscar entidades relacionadas
      const pais = await Pais.findOne({ where: { id: requestData.country } });
      if (!pais) throw new Error(`País ${requestData.country} no encontrado`);

      const rol = await Rol.findOne({ where: { id: requestData.role } });
      if (!rol) throw new Error(`Rol con ID ${requestData.role} no encontrado`);

      // 2. Crear fechas
      const f_registro = new Date();
      const f_expiracion = new Date();
      f_expiracion.setFullYear(f_registro.getFullYear() + 1);

      // 3. Crear y guardar representante
      const representante = Representante.create({
        usuario: requestData.userName,
        correo: requestData.email,
        p_nombre: requestData.first_name,
        s_nombre: requestData.second_name || "",
        p_apellido: requestData.first_surname,
        s_apellido: requestData.second_surname || "",
        c_acceso: codeAccess,
        estado: true,
        f_registro: f_registro,
        f_expiracion: f_expiracion,
        rol: rol,
        pais: pais,
      });

      // 4. Guardar el representante
      await representante.save();

      // 5. Retornar respuesta
      return {
        userName: requestData.userName,
        email: requestData.email,
        first_name: requestData.first_name,
        second_name: requestData.second_name || "",
        first_surname: requestData.first_surname,
        second_surname: requestData.second_surname || "",
        role: requestData.role,
        country: requestData.country,
        code_access: codeAccess,
        message: "Usuario registrado correctamente",
        success: true,
        status: true,
        date_registre: f_registro,
        date_expired: f_expiracion,
      };
    } catch (error: unknown) {
      console.error("Error en registerService:", error);

      let errorMessage = "Error en el registro";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Stack trace:", error.stack);
      }

      return {
        userName: requestData.userName,
        email: requestData.email,
        first_name: requestData.first_name,
        second_name: requestData.second_name || "",
        first_surname: requestData.first_surname,
        second_surname: requestData.second_surname || "",
        role: requestData.role,
        country: requestData.country,
        code_access: codeAccess,
        message: errorMessage,
        success: false,
        status: false,
        date_registre: null,
        date_expired: null,
      };
    }
  }

  async loginService(requestData: ILoginRequest): Promise<ILoginResponse> {
    try {
      const user = await Representante.findOne({
        where: { usuario: requestData.userName },
        relations: ["rol"],
      });
      if (!user)
        throw new Error(`Usuario ${requestData.userName} no encontrado`);

      if (comparePassword(requestData.code_access, user.c_acceso)) {
        const token = createToken(requestData.userName);
        return {
          success: true,
          message: "Usuario logeado correctamente",
          token: token,
          role: user.rol.nombre,
        };
      }
      return {
        success: false,
        message: "Usuario o codigo de acceso invalido",
        token: undefined,
      };
    } catch (error) {
      throw new Error(`Error en el servidor: ${error}`);
    }
  }
}
