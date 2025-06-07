import { IToken } from "./IToken.js";

export interface IRegisterUserRequest extends IToken {
  userName: string;
  email: string;
  first_name: string;
  second_name: string;
  first_surname: string;
  second_surname: string;
  role: number;
  roleName?: string;
  country: number;
  countryName?: string;
  commission: number | null;
  name?: {
    first_name: string;
    second_name: string;
    first_surname: string;
    second_surname: string;
  };
}
