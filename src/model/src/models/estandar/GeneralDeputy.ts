import { IDeputy } from "../interfaces/IDeputy.js";

export class GeneralDeputy implements IDeputy {
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
  country: {
    id: number;
    name?: string;
  };
  code_access: number;
  date_register?: Date | null;
  date_expired?: Date | null;
  status: "Activo" | "Inactivo";

  constructor(
    userName: string,
    email: string,
    name: {
      first_name: string;
      second_name?: string | null;
      first_surname: string;
      second_surname: string;
    },
    role: {
      id: number;
      name?: string;
    },
    country: {
      id: number;
      name?: string;
    },
    code_access: number,
    status: "Activo" | "Inactivo",
    date_register?: Date | null,
    date_expired?: Date | null
  ) {
    this.userName = userName;
    this.email = email;
    this.name = name;
    this.role = role;
    this.country = country;
    this.code_access = code_access;
    this.status = status;
    this.date_register = date_register;
    this.date_expired = date_expired;
  }

  get data(): IDeputy {
    return {
      userName: this.userName,
      email: this.email,
      name: this.name,
      role: this.role,
      country: this.country,
      code_access: this.code_access,
      status: this.status,
      date_register: this.date_register,
      date_expired: this.date_expired,
    };
  }
}
