import { Request, Response } from "express";
import { ListDeputyService } from "../services/listDeputies.service.js";
import { GeneralError } from "../models/estandar/GeneralError.js";

export class ListDeputyController extends GeneralError {
  constructor(private readonly listdeputies: ListDeputyService) {
    super();
  }
  listAllDeputies = async (req: Request, res: Response) => {
    try {
      const { page } = req.body;
      const { roleName, userName } = req.body.actualUser;
      const response = await this.listdeputies.listAllDeputiesService(
        Number(page?.toString()),
        roleName,
        userName
      );

      const paginated = response.paginated.paginated;
      res.json({
        success: true,
        deputies: response.deputies,
        paginated,
      });
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  listOnlyDeputies = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;

      const response = await this.listdeputies.listOnlyDeputiesService(
        Number(page?.toString())
      );
      const paginated = response.paginated.paginated;
      res.json({
        success: true,
        deputies: response.deputies,
        paginated,
      });
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  listOnlyCommissionPresidents = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;

      const response =
        await this.listdeputies.listOnlyCommissionPresidentsService(
          Number(page?.toString())
        );
      const paginated = response.paginated.paginated;
      res.json({
        success: true,
        deputies: response.deputies,
        paginated,
      });
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  listOnlyCommissionSecretaries = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const response =
        await this.listdeputies.listOnlyCommissionSecretariesService(
          Number(page?.toString())
        );
      const paginated = response.paginated.paginated;
      res.json({
        success: true,
        deputies: response.deputies,
        paginated,
      });
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  listOnlyGeneralPresidents = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const response = await this.listdeputies.listOnlyGeneralPresidentsService(
        Number(page?.toString())
      );
      const paginated = response.paginated.paginated;
      res.json({
        success: true,
        deputies: response.deputies,
        paginated,
      });
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  listOnlyGeneralSecretaries = async (req: Request, res: Response) => {
    try {
      const { page } = req.query;
      const response =
        await this.listdeputies.listOnlyGeneralSecretariesService(
          Number(page?.toString())
        );
      const paginated = response.paginated.paginated;
      res.json({
        success: true,
        deputies: response.deputies,
        paginated,
      });
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };
}
