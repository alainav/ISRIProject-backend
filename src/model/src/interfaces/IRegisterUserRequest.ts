export interface IRegisterUserRequest {
  userName: string;
  email: string;
  first_name: string;
  second_name: string;
  first_surname: string;
  second_surname: string;
  role: number;
  country: number;
  commission: number | null;
}
