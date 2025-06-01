// src/controllers/usuario.controllers.ts
import { Request, Response } from "express";
import { UserService } from "../services/usuario.service.js";
import { IUserQueryRequest } from "../interfaces/IUserQueryRequest.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  // Cambia a arrow function para auto-binding
  listUsers = async (req: Request, res: Response) => {
    try {
      if (!req.userName) {
        res.status(401).json({
          success: false,
          message: "No se pudo identificar al usuario",
        });
      }

      const query: IUserQueryRequest = {
        userName: req.userName,
        actual_page: parseInt(req.query.page as string) || 1,
      };

      const result = await this.userService.listUsersService(query);
      res.json(result);
    } catch (error) {
      console.error("Error en listUsers:", error);
      res.status(500).json({
        success: false,
        message: "Error al listar usuarios",
      });
    }
  };

  deleteUsers = async (req: Request, res: Response) => {
    //const result = await this.userService.deleteUsersService(req);
  };
}
