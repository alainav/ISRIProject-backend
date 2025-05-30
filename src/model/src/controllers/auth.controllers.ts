import { Request, Response } from "express";
import { AuthService } from "../services/authService.js";

export class AuthControllers {
  constructor(private readonly authService: AuthService) {}

  registerController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.registerService(req.body);
      res.status(response.success ? 201 : 500).json(response);
    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  };

  loginController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.loginService(req.body);
      res.status(response.success ? 200 : 400).json(response);
    } catch (error: any) {
      console.log("Error bueno", error.message);
      res.status(500).json({ error: error.message });
    }
  };
}
