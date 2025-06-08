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

  updateController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await this.editionService.updateEditionService(
        Number(id),
        req.body
      );
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  deleteController = async (req: Request, res: Response) => {
    try {
      const response = await this.editionService.deleteEditionService(
        Number(req.params.id)
      );
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  listController = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const response = await this.editionService.listEditionService(
        Number(page)
      );
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  listSpecialController = async (req: Request, res: Response) => {
    try {
      const response = await this.editionService.listEditionActiveService();
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };
}
