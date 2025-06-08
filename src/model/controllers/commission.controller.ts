import { Request, Response } from "express";
import { GeneralError } from "../models/estandar/GeneralError.js";
import { CommissionServices } from "../services/commission.service.js";

export class CommissionControllers extends GeneralError {
  constructor(private readonly commissionServices: CommissionServices) {
    super();
  }

  registerController = async (req: Request, res: Response) => {
    try {
      const response = await this.commissionServices.registerCommissionService(
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
      const response = await this.commissionServices.updateCommissionService(
        Number.parseInt(id),
        req.body
      );
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  deleteController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await this.commissionServices.deleteCommissionService(
        Number.parseInt(id)
      );
      res.status(response.success ? 200 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  listController = async (req: Request, res: Response) => {
    try {
      const { page = 1 } = req.query;
      const { email, roleName } = req.body.actualUser;
      const response = await this.commissionServices.listCommissionsService(
        Number(page?.toString()),
        email,
        roleName
      );
      res.json({ ...response, paginated: response.paginated.paginated });
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };
}
