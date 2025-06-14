import { Request, Response } from "express";
import { GeneralError } from "../models/estandar/GeneralError.js";
import { SpecialsServices } from "../services/specials.service.js";

export class SpecialControllers extends GeneralError {
  constructor(private readonly specialServices: SpecialsServices) {
    super();
  }

  listController = async (req: Request, res: Response) => {
    try {
      const { page } = req.body;
      const response = await this.specialServices.listCountriesService(
        Number(page?.toString()),
        req
      );
      res.json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  roleController = async (req: Request, res: Response) => {
    try {
      const { page = 1 } = req.query;
      const response = await this.specialServices.listRolesService(
        Number(page?.toString()),
        req
      );
      res.json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };
}
