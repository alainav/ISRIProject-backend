import { Response } from "express";
import GeneralResponse from "./GeneralResponse.js";

export class GeneralError {
  protected generalError(res: Response, message?: string, error?: Error) {
    const response = new GeneralResponse(false, message, error);
    res.status(500).json(response.data);
  }
}
