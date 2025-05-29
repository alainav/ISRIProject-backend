import { IGeneralResponse } from "./IGeneralResponse.js";

export interface IRegistrerResponse extends IGeneralResponse {
  userName: string;
  email: string;
  first_name: string;
  second_name?: string;
  first_surname: string;
  second_surname: string;
  role: number;
  country: number;
  code_access: number;
  date_registre: Date | null;
  date_expired: Date | null;
  status: boolean;
}
