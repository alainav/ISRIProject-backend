import { IGeneralResponse } from "./IGeneralResponse.js";

export interface IEditionsResponse extends IGeneralResponse {
  id_edition?: number;
  name: string;
  initial_date: Date;
  end_date: Date;
  duration: number;
  president: string;
  presidentUserName?: string;
  secretary: string;
  secretaryUserName?: string;
  cubaDate?: string;
}
