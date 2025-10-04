import { Server, Socket } from "socket.io";
import {
  authenticate,
  create_deputy,
  update_deputy,
  delete_deputy,
  list_all_deputies,
  activate_deputy,
  get_list_deputies,
  get_list_commissions_presidents,
  get_list_commissions_secretaries,
  get_list_general_presidents,
  get_list_general_secretaries,
  delete_permanent_deputy,
} from "./deputy.controller.js";

import {
  create_edition,
  update_edition,
  delete_edition,
  list_editions,
  list_active_editions,
} from "./edition.controller.js";

import {
  create_commission,
  update_commission,
  delete_commission,
  list_commissions,
} from "./commission.controller.js";

import {
  create_voting,
  update_voting,
  delete_voting,
  list_voting,
  change_status_voting,
  execute_vote,
  show_monitor,
} from "./voting.controller.js";
import CustomSocket from "../interfaces/CustomSocket.js";
import ReassignIdentityData from "../interfaces/ReassignIdentityData.js";
import PingData from "../interfaces/PingData.js";

import { minutesToMiliseconds } from "../../utils/utils.js";
import { generateRandomNumberExtended } from "../helpers/estandarizadores.js";
import { modifyOnlineUsers, online, sockets, usersRooms } from "../onlines.js";
import { get_countries, get_roles } from "./specials.controller.js";

export class SocketsPersonalizados implements CustomSocket {
  socket: Socket;
  io: Server;
  identity: string;
  private disconnectTime: number | null = null;

  constructor(socket: Socket, io: Server, identity: string) {
    this.socket = socket;
    this.io = io;
    this.identity = identity;
  }

  setDisconnectTime(time: number) {
    this.disconnectTime = time;
  }

  get timeDisconnected(): number {
    return this.disconnectTime === null ? 0 : Date.now() - this.disconnectTime;
  }
}

let actualSocket: Socket;
let actualIO: Server;
// Tipar los manejadores de eventos
type EventHandler = (this: Socket, ...args: any[]) => void;
const EVENT_HANDLERS: Record<string, EventHandler> = {
  //Eventos asociados a los representantes
  authenticate,
  "create-deputy": create_deputy,
  "update-deputy": update_deputy,
  "delete-deputy": delete_deputy,
  "delete-permanent-deputy": delete_permanent_deputy,
  "activate-deputy": activate_deputy,
  "list-all-deputies": list_all_deputies,
  "get-list-deputies": get_list_deputies,
  "get-list-commissions-presidents": get_list_commissions_presidents,
  "get-list-commissions-secretaries": get_list_commissions_secretaries,
  "get-list-general-presidents": get_list_general_presidents,
  "get-list-general-secretaries": get_list_general_secretaries,

  //Peticiones asociadas a la creacion de una edicion
  "create-edition": create_edition,
  "update-edition": update_edition,
  "delete-edition": delete_edition,
  "list-editions": list_editions,
  "list-active-editions": list_active_editions,

  //Peticiones asociadas a la creación de comisiones
  "create-commission": create_commission,
  "update-commission": update_commission,
  "delete-commission": delete_commission,
  "list-commissions": list_commissions,

  //Peticiones asociadas a los votos
  "create-voting": create_voting,
  "update-voting": update_voting,
  "list-voting": list_voting,
  "delete-voting": delete_voting,
  "change-status-voting": change_status_voting,
  "execute-vote": execute_vote,
  "show-monitor": show_monitor,

  //Peticiones de apoyo o especiales
  "get-countries": get_countries,
  "get-roles": get_roles,
};

const sensibles: string[] = ["authenticate", "execute-vote"];

const generalController = (socket: Socket, io: Server): void => {
  let identity = assignIdentity(socket);

  modifyOnlineUsers("inc");
  console.log(`🟢 Nuevo usuario conectado: ${identity}`);

  // Sincronizar rooms
  const existingRooms = usersRooms.get(identity);
  if (existingRooms) {
    Array.from(socket.rooms)
      .filter((room) => room !== socket.id)
      .forEach((room) => socket.leave(room));

    existingRooms.forEach((room) => socket.join(room));
  }

  actualSocket = socket;
  actualIO = io;

  sockets.set(identity, new SocketsPersonalizados(socket, io, identity));
  io.emit("online-count", online);

  // Registrar eventos
  Object.entries(EVENT_HANDLERS).forEach(([eventName, handler]) => {
    socket.on(eventName, (...args: any[]) => {
      if (sensibles.includes(eventName)) {
        console.log(
          `🔒 Evento sensible [${eventName}] - Usuario: ${identity}${
            args[0]?.userName ? ` (${args[0].userName})` : ""
          }`
        );
      } else {
        console.log(
          `🎮 Evento [${eventName}] activado por usuario: ${identity}`
        );
      }

      try {
        handler.call(socket, ...args);
      } catch (error: any) {
        console.log(`Error en evento ${eventName}: ${error.message}`);
        socket.emit("error", `Error procesando ${eventName}`);
      }
    });
  });

  // Limpieza de sockets inactivos
  const inactivityInterval = setInterval(() => {
    sockets.forEach((socketObj, key) => {
      if (socketObj.timeDisconnected > 300000) {
        sockets.delete(key);
        usersRooms.delete(key);
        console.log(`⌛ Eliminado socket ${key} por inactividad`);
      }
    });
  }, minutesToMiliseconds(3));

  // Evento ping
  socket.on("ping", (rawData: string) => {
    let data: PingData;
    try {
      data = JSON.parse(rawData);
    } catch (e) {
      return socket.emit("error", "Formato inválido");
    }

    socket.emit(
      "pong",
      JSON.stringify({
        type: "pong",
        payload: "a".repeat(Math.floor(Math.random() * 10240)),
        latency: Date.now() - data.timestamp,
      })
    );
  });

  // Eventos especiales
  socket.on("reassign-identity", (newId: ReassignIdentityData) => {
    console.log(`🎮 [reassign-identity] por: ${identity}`);
    sockets.delete(identity);
    usersRooms.delete(identity);
    socket.handshake.query.identity = newId.identity;
    const newIdentity = assignIdentity(socket);
    sockets.set(
      newIdentity,
      new SocketsPersonalizados(socket, io, newIdentity)
    );
    console.log(`🔄 ${identity} → ${newIdentity}`);
    identity = newIdentity;
  });

  socket.on("my-identity", () => {
    socket.emit("your-identity", identity);
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
    if (rooms.length > 0) {
      usersRooms.set(identity, rooms);
    }
    sockets
      .get(identity)
      ?.setDisconnectTime(Number.parseInt(Date.now().toFixed(2)));
  });

  socket.on("disconnect", () => {
    modifyOnlineUsers("dec");
    io.emit("online-count", online);
    console.log(`🔴 Desconectado: ${identity}`);
    clearInterval(inactivityInterval);
  });

  socket.on("close", () => {
    sockets.get(identity)?.socket?.disconnect();
    sockets.delete(identity);
    usersRooms.delete(identity);
    clearInterval(inactivityInterval);
  });

  socket.on("online-count", () => {
    socket.emit("online-count", online);
  });
};

const assignIdentity = (socket: Socket): string => {
  if (!socket) return "null";

  let identity = Array.isArray(socket.handshake.query.identity)
    ? socket.handshake.query.identity[0]
    : socket.handshake.query.identity || "null";

  const address = socket.handshake.address;

  if (!identity || identity === "null") {
    let collisionCount = 0;
    do {
      identity = generateRandomNumberExtended().toString();
      collisionCount++;

      if (collisionCount > 500) {
        throw new Error("Demasiadas colisiones al generar identity");
      }
    } while (
      sockets.has(identity) &&
      sockets.get(identity)?.socket.handshake.address !== address
    );
  }

  socket.emit("your-identity", identity);
  return identity;
};

export const getSockets = (identity: string): CustomSocket | undefined => {
  let so = sockets.get(identity.toString());
  if (!so) {
    actualSocket.handshake.query.identity = identity;
    const newIdentity = assignIdentity(actualSocket);
    sockets.set(
      newIdentity,
      new SocketsPersonalizados(actualSocket, actualIO, newIdentity)
    );
    console.log(`🔄 ${identity} → ${newIdentity}`);
    identity = newIdentity;
    so = new SocketsPersonalizados(actualSocket, actualIO, newIdentity);
  }

  return so;
};

export default generalController;
