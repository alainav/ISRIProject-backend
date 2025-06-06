import { IGeneralResponse } from "./IGeneralResponse.js";

export interface ILoginResponse extends IGeneralResponse {
  token: string | undefined;
  role?: string;
  country?: string;
}
