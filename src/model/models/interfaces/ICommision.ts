import { ICommissionElement } from "../../interfaces/ICommissionElements.js";
import { IGeneralResponse } from "../../interfaces/IGeneralResponse.js";

export interface ICommission extends IGeneralResponse {
  id_commission: number | undefined;
  name: string;
  countries: ICommissionElement[];
  edition: string;
  numOfCountries: number;
  votes?: number;
  president?: string;
  presidentUserName?: string;
  secretary?: string;
  secretaryUserName?: string;
}
