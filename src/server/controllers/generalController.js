import { modifyOnlineUsers, online, sockets, usersRooms } from "../onlines.js";
import { generateRandomNumberExtended } from "../helpers/estandarizadores.js";
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
} from "./deputyController.js";

import {
  create_edition,
  update_edition,
  delete_edition,
  list_editions,
} from "./editionController.js";

import {
  create_commission,
  update_commission,
  delete_commission,
  list_commissions,
} from "./commissionController.js";

import {
  create_voting,
  update_voting,
  delete_voting,
  list_voting,
  change_status_voting,
  execute_vote,
  show_monitor,
} from "./votingController.js";
import { minutesToMiliseconds } from "../../utils/utils.js";

export class SocketsPersonalizados {
  constructor(socket, io, identity) {
    this.socket = socket;
    this.io = io;
    this.identity = identity;
    this.disconnectTime = null;
  }

  setDisconnectTime(time) {
    this.disconnectTime = time;
  }

  getTimeDisconnected() {
    return this.disconnectTime === null ? 0 : Date.now() - this.disconnectTime;
  }
}

/**
 * Relación de eventos con sus respectivas funciones
 */
const EVENT_HANDLERS = {
  //Eventos asociados a representantes y autenticación
  authenticate,
  "create-deputy": create_deputy,
  "update-deputy": update_deputy,
  "delete-deputy": delete_deputy,
  "list-all-deputies": list_all_deputies, //Muestra todos los representantes registrados sin importar el rol
  "activate-deputy": activate_deputy,
  "get-list-deputies": get_list_deputies,
  "get-list-commissions-presidents": get_list_commissions_presidents,
  "get-list-commissions-secretaries": get_list_commissions_secretaries,
  "get-list-general-presidents": get_list_general_presidents,
  "get-list-general-secretaries": get_list_general_secretaries,

  //Eventos asociados a ediciones
  "create-edition": create_edition,
  "update-edition": update_edition,
  "delete-edition": delete_edition,
  "list-editions": list_editions,

  //Eventos asociados a comisiones
  "create-commission": create_commission,
  "update-commission": update_commission,
  "delete-commission": delete_commission,
  "list-commissions": list_commissions,

  //Eventos asociados a las votaciones
  "create-voting": create_voting,
  "update-voting": update_voting,
  "list-voting": list_voting,
  "delete-voting": delete_voting,
  "change-status-voting": change_status_voting,
  "execute-vote": execute_vote,
  "show-monitor": show_monitor,
};

/**
 * Arreglo con el nombre de eventos considerados sensibles
 */
const sensibles = ["authenticate", "execute-vote"];

/**
 * Funcionalidad principal del controlador general
 * @param {*} socket Socket conectado
 * @param {*} io Referencia de todos los sockets conectados
 */
const generalController = (socket, io) => {
  let identity = assignIdentity(socket);

  modifyOnlineUsers("inc");
  console.log(`🟢 Nuevo usuario conectado: ${identity}`);

  // Sincronizar rooms en caso de que ya posea alguna previamente
  const existingRooms = usersRooms.get(identity);
  if (existingRooms) {
    socket.rooms.forEach((room) => socket.leave(room));
    existingRooms.forEach((room) => socket.join(room));
  }

  // Actualizar mapa de sockets
  sockets.set(identity, new SocketsPersonalizados(socket, io, identity));

  // Actualizar cantidad de usuarios en linea
  io.emit("online-count", online);

  // Asignar los eventos a los nombres correspondientes
  Object.entries(EVENT_HANDLERS).forEach(([eventName, handler]) => {
    socket.on(eventName, (...args) => {
      // Dentro del handler del evento
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

      // Ejecutar el evento original con contexto y argumentos
      try {
        handler.call(socket, ...args);
      } catch (error) {
        console.log(`Error en evento ${eventName}: ${error.message}`);
        socket.emit("error", `Error procesando ${eventName}`);
      }
    });
  });

  // ⚡ Eliminar sockets y disponibilizarlos (30 segundos)
  let inactivityTimeout = setInterval(() => {
    sockets.forEach((socketObj, key) => {
      if (socketObj.getTimeDisconnected() > 300000) {
        sockets.delete(key);
        usersRooms.delete(key);

        console.log(
          `⌛ Eliminado socket ${socket.id} y liberando ID (${key}) por inactividad`
        );
      }
    });
  }, minutesToMiliseconds(5));

  // Sección de eventos para probar el servidor socket.io
  socket.on("ping", (rawData) => {
    //clearTimeout(inactivityTimeout); // Limpiar el anterior
    let inactivityTimeout = setTimeout(() => {
      console.log(`⌛ Cerrando socket ${socket.id} por inactividad`);
      socket.disconnect(true);
    }, 15000);

    const start = Date.now();
    let data;

    try {
      data = JSON.parse(rawData); // Parsear datos entrantes
    } catch (e) {
      return socket.emit("error", "Formato inválido");
    }

    // Respuesta mejorada
    const respuesta = JSON.stringify({
      type: "pong",
      originalTimestamp: data.timestamp,
      serverTimestamp: Date.now(),
      latency: Date.now() - data.timestamp,
    });

    socket.emit(
      "pong",
      JSON.stringify({
        type: "pong",
        payload: "a".repeat(Math.floor(Math.random() * 10240)), // 0-10 KB
        latency: Date.now() - data.timestamp,
      })
    );
  });

  // Eventos especiales
  socket.on("reassign-identity", (newId) => {
    console.log(
      `🎮 Evento [reassign-identity] activado por usuario: ${identity}`
    );
    sockets.delete(identity);
    usersRooms.delete(identity);
    socket.handshake.query.identity = newId.identity;
    const newIdentity = assignIdentity(socket);
    sockets.set(
      newIdentity,
      new SocketsPersonalizados(socket, io, newIdentity)
    );
    console.log(`🔄 Cliente ${identity} cambió a ${newIdentity}`);
    identity = newIdentity;
  });

  socket.on("my-identity", () => {
    console.log(`🎮 Evento [my-identity] activado por usuario: ${identity}`);
    socket.emit("your-identity", identity);
  });

  socket.on("disconnecting", () => {
    if (!usersRooms.has(identity)) {
      // Actualizar directamente el Map usersRooms
      usersRooms.set(identity, Array.from(socket.rooms));
    }
    sockets.get(identity)?.setDisconnectTime(Date.now());
  });

  socket.on("disconnect", () => {
    //clearTimeout(inactivityTimeout);
    modifyOnlineUsers("dec");
    io.emit("online-count", online);
    console.log(`🔴 Cliente desconectado: ${identity}`);
  });

  socket.on("close", () => {
    console.log(`🎮 Evento [close] activado por usuario: ${identity}`);
    console.log(`🚪 Cliente ${identity} abandona el servicio`, identity);
    sockets.get(identity)?.socket?.disconnect();
    sockets.delete(identity);
    usersRooms.delete(identity);
  });

  socket.on("online-count", () => {
    socket.emit("online-count", online);
  });
};

/**
 * Función para asignar identity a Socket específico
 * @param {*} socket Socket actual conectado
 * @returns {number} Identificador asociado al socket enviado
 */
const assignIdentity = (socket) => {
  if (!socket) return "null";

  let identity = socket.handshake.query.identity;
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
      sockets.get(identity).socket.handshake.address !== address
    );
  }

  socket.emit("your-identity", identity);
  return identity;
};

/**
 * Permite obtener el socket asociado a una identificación específica
 * @param {number} identity Identificador del socket a buscar
 * @returns {SocketsPersonalizados} Devuelve el Socket y io asociados al identificador
 */
export const getSockets = (identity) => sockets.get(identity);

export default generalController;
