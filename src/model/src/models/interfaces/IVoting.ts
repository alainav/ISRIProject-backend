export interface IVoting {
  id_voting?: number;
  voting_name: string;
  description: string;
  result:
    | "No iniciada"
    | "Aprobada"
    | "Denegada"
    | "Sin Desición"
    | "En proceso";
  commission_name: string;
  in_favour?: number;
  against?: number;
  abstention?: number;
  state?: "Cerrada" | "Abierta";
}
