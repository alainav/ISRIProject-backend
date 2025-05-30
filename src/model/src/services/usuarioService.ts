import { IUserListResponse } from "../interfaces/IUserListResponse.js";
import { IUserQueryRequest } from "../interfaces/IUserQueryRequest.js";
import Representante from "../models/Representante.js";
import { createToken } from "../utils/generateJWT.js";

export class UserService {
  async listUsersService(query: IUserQueryRequest): Promise<IUserListResponse> {
    try {
      // Parámetros de paginación
      const pagina = query.actual_page || 1;
      const limite = 10;
      const offset = (pagina - 1) * limite;

      // Obtener usuarios paginados
      const usuarios = await Representante.findAndCountAll({
        where: { estado: true },
        offset,
        limit: limite,
      });

      // Generar nuevo token con el nombre de usuario del request
      // (Asumiendo que tienes el userName disponible en query)
      const newToken = createToken(query.userName);

      return {
        users: usuarios.rows,
        paginated: {
          actual_page: pagina,
          total_pages: Math.ceil(usuarios.count / limite),
        },
        success: true,
        message: "Ok",
        token: newToken, // Token recién generado
      };
    } catch (error) {
      throw error;
    }
  }
}
