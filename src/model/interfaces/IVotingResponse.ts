import { IGeneralResponse } from "./IGeneralResponse.js";

export interface IVotingResponse extends IGeneralResponse {
  id_voting?: number;
  voting_name: string;
  description: string;
  result: "Programada" | "Aprobada" | "Denegada" | "Sin Desición" | "Activa";
  commission_name: string;
  in_favour?: number;
  against?: number;
  abstention?: number;
  state?: "Cerrada" | "Abierta";
}
