import { Request, Response } from "express";
import { GeneralError } from "../models/estandar/GeneralError.js";
import { CommissionServices } from "../services/commission.service.js";
import { VotingService } from "../services/voting.service.js";

export class VotingControllers extends GeneralError {
  constructor(private readonly votingService: VotingService) {
    super();
  }

  registerController = async (req: Request, res: Response) => {
    try {
      const response = await this.votingService.registerVotingService(req.body);
      res.status(response.success ? 201 : 500).json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  updateController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await this.votingService.updateVotingService(
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

      const response = await this.votingService.deleteVotingService(
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
      const { email } = req.body.actualUser;
      const response = await this.votingService.listVotingsService(
        Number(page?.toString()),
        email
      );
      res.json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  executeController = async (req: Request, res: Response) => {
    try {
      const { country, vote } = req.body;
      const { id } = req.params;

      const response = await this.votingService.executeVoteService(
        Number(id),
        Number(country),
        Number(vote)
      );
      res.json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  showMonitorController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await this.votingService.showMonitorService(Number(id));
      res.json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };

  changeStatusController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await this.votingService.changeStatusVotingService(
        Number(id)
      );
      res.json(response);
    } catch (error: any) {
      this.generalError(res, error.message);
    }
  };
}
