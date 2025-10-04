import { Request, Response } from "express";
import { AuthService } from "../services/deputy.service.js";
import { GeneralError } from "../models/estandar/GeneralError.js";

export class DeputyControllers extends GeneralError {
  constructor(private readonly authService: AuthService) {
    super();
  }

  loginController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.loginService(req.body);
      res.status(response.success ? 200 : 400).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  registerController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.registerService(req.body);
      res.status(response.success ? 201 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  updateController = async (req: Request, res: Response) => {
    try {
      req.body.email = req.params.email;
      const response = await this.authService.updateDeputyService(req.body);
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  permanentDeleteController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.deleteDeputyPermanentService(
        req.params.userName
      );
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  deleteController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.deleteDeputyService(
        req.params.userName
      );
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  reactivateController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.reactivateDeputyService(
        req.body.email
      );
      res.status(response.success ? 200 : 400).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  countryController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.getDeputyCountryService(
        req.body.actualUser.userName
      );
      res.status(response.success ? 200 : 400).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };
}
