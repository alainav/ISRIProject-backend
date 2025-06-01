import { SocketsPersonalizados } from "./controllers/general.controller.js";

export let online: number = 0;
export const usersRooms: Map<string, string[]> = new Map();
export const sockets: Map<string, SocketsPersonalizados> = new Map();

export function modifyOnlineUsers(operation: "inc" | "dec"): void {
  if (operation === "inc") online++;
  else if (operation === "dec" && online > 0) online--;
}
