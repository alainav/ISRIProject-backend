import { IGeneralResponse } from "./IGeneralResponse.js";

export interface ITokenStructure extends IGeneralResponse {
  userName: string;
  email: string;
  roleName?: string;
  role?: number;
}
