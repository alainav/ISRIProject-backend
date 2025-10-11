export interface IVoting {
  id_voting?: number;
  voting_name: string;
  description: string;
  result: "Programada" | "Aprobada" | "Denegada" | "Sin Decisión" | "Activa";
  commission_name: string;
  in_favour?: number;
  against?: number;
  abstention?: number;
  totalVotes: number;
  totalParticipants: number;
  state?: "Cerrada" | "Abierta";
  date?: Date | string;
  hour?: string;
}
