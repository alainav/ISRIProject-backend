import { IGeneralResponse } from "../../interfaces/IGeneralResponse.js";
import { IPaginated } from "../../interfaces/IPaginated.js";

export interface IDeputy {
  userName: string;
  email: string;
  name: {
    first_name: string;
    second_name?: string | null;
    first_surname: string;
    second_surname: string;
  };
  role: {
    id: number;
    name?: string;
  };
  commission?: {
    id?: number;
    name?: string;
  };
  country: {
    id: number;
    name?: string;
  };
  code_access: number;
  date_register?: Date | null;
  date_expired?: Date | null;
  status: "Activo" | "Inactivo";
}
