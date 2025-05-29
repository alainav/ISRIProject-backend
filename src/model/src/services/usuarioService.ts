import { IUserListResponse } from "../interfaces/IUserListResponse.js";
import { IUserQueryRequest } from "../interfaces/IUserQueryRequest.js";
import { Representante } from "../models/Representante.js";
import { createToken } from "../utils/generateJWT.js";

export class UserService {
  async listUsersService(query: IUserQueryRequest): Promise<IUserListResponse> {
    console.log(query);
    try {
      // Parámetros de paginación
      const pagina = query.actual_page || 1;
      const limite = 10;
      const offset = (pagina - 1) * limite;

      // Obtener usuarios paginados
      const [usuarios, total] = await Representante.findAndCount({
        where: { estado: true },
        skip: offset,
        take: limite,
      });
      console.log(usuarios);

      // Generar nuevo token con el nombre de usuario del request
      // (Asumiendo que tienes el userName disponible en query)
      const newToken = createToken(query.userName || "defaultUser");

      return {
        users: usuarios,
        paginated: {
          actual_page: pagina,
          total_pages: Math.ceil(total / limite),
        },
        success: true,
        message: "Ok",
        token: newToken, // Token recién generado
      };
    } catch (error) {
      // Manejo mejorado del error
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
          users: [],
          paginated: {
            actual_page: 0,
            total_pages: 0,
          },
          token: "",
        };
      }
      return {
        success: false,
        message: "Error desconocido",
        users: [],
        paginated: {
          actual_page: 0,
          total_pages: 0,
        },
        token: "",
      };
    }
  }
  /*async deleteUsersService (req: Request ) {
    try {
      const user = await Representante.findOne({ where: { correo : req.body.id_deputy } });
  
      if (!user) throw new Error("Ese correo no esta registrado");
  
      user.estado = false;
  
      await user.save();

       const newToken = createToken(requestData.userName || "defaultUser")

      return {
        success:true,
        message:"Usuario eliminado correctamente",
        token: createToken(newToken)
      }
      
    } catch (error) {
      
    }

  }*/
  async updateUsersService() {}
}
