import { IGeneralResponse } from "./IGeneralResponse.js";

export interface ITokenStructure extends IGeneralResponse {
  userName: string;
  roleName?: string;
  role?: number;
}
