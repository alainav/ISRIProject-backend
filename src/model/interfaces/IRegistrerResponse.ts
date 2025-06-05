import { IGeneralResponse } from "./IGeneralResponse.js";
import { IToken } from "./IToken.js";

export interface IRegistrerResponse extends IGeneralResponse, IToken {
  userName: string;
  email: string;
  first_name: string;
  second_name?: string;
  first_surname: string;
  second_surname: string;
  role: string;
  country: string;
  code_access: number;
  date_register: Date | null;
  date_expired: Date | null;
  status: "Activo" | "Inactivo";
}
