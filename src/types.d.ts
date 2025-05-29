import { SocketsPersonalizados } from "./server/controllers/generalController.ts";

// types.d.ts
declare module "*.js" {
  const value: any;
  export default value;
}

declare module "onlines" {
  export const online: number;
  export const sockets: Map<string, SocketsPersonalizados>;
  export const usersRooms: Map<string, string[]>;
  export function modifyOnlineUsers(action: "inc" | "dec"): void;
}
