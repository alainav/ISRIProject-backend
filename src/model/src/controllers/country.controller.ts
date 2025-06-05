import { Request, Response } from "express";
import { GeneralError } from "../models/estandar/GeneralError.js";
import { CountryServices } from "../services/country.service.js";

export class CountryControllers extends GeneralError {
  constructor(private readonly countryServices: CountryServices) {
    super();
  }

  listController = async (req: Request, res: Response) => {
    try {
      const { page = 1 } = req.query;
      const response = await this.countryServices.listCountriesService(
        Number(page?.toString()),
        req
      );
      res.json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };
}
