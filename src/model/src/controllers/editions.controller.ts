import { Request, Response } from "express";
import { GeneralError } from "../models/estandar/GeneralError.js";
import { EditionService } from "../services/editions.service.js";

export class EditionsController extends GeneralError {
  constructor(private readonly editionService: EditionService) {
    super();
  }

  registerController = async (req: Request, res: Response) => {
    try {
      const response = await this.editionService.registerEditionService(
        req.body
      );
      res.status(response.success ? 201 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  /*updateController = async (req: Request, res: Response) => {
    try {
      req.body.email = req.params.email;
      const response = await this.authService.updateDeputyService(req.body);
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  deleteController = async (req: Request, res: Response) => {
    try {
      const response = await this.authService.deleteDeputyService(
        req.params.email
      );
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };*/
}
