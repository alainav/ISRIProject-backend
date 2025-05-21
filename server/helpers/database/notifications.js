import { obtenerSocketsPorUsuario } from "../../controllers/controller.js";

export const notificarError = async (userId, error, message) => {
  const socket = obtenerSocketsPorUsuario(userId);
  if (!socket)
    return console.log("Notificación incorrecta: userId no encontrado");

  const errorMessage = error.message.includes("callback")
    ? "Es necesario establecer una función que espere la respuesta."
    : error.message || message;

  socket.socketActual.emit("notificar-mensaje", { message: errorMessage });
};
