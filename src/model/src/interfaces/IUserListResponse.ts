import Representante from "../models/Representante.js";
import { IGeneralResponse } from "./IGeneralResponse.js";

export interface IUserListResponse extends IGeneralResponse {
  users: Representante[];
  paginated: {
    actual_page: number;
    total_pages: number;
  };
  token: string;
}
