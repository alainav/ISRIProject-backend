import Representante from "../models/Representante.js";
import { IGeneralResponse } from "./IGeneralResponse.js";
import { IPaginated } from "./IPaginated.js";

export interface IUserListResponse extends IGeneralResponse, IPaginated {
  users: Representante[];
  token: string;
}
