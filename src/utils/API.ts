import RequestAPIData from "../interfaces/RequestAPIData.js";
import { getSockets } from "../server/controllers/general.controller.js";
import CallbackFunction from "../server/interfaces/CallbackFunction.js";
import ControllerData from "../server/interfaces/ControllerData.js";
import Data from "./Data.js";

// Plantilla reutilizable para operaciones CRUD
export const CRUDOperations = async (
  method: "POST" | "PUT" | "DELETE" | "GET" | "PATCH",
  endpoint: string,
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      endpoint,
      method,
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    callback({ success: false, message });
  }
};

export const requestAPI = async (data: RequestAPIData) => {
  const { address, method, contentType, body, token, identity } = data;
  try {
    const socketObj = getSockets(identity);
    if (!socketObj) {
      throw new Error(`No socket found for identity: ${identity}`);
    }
    const host = socketObj.socket.handshake.headers.host;
    const response = await fetch(`http://${host}/api/v1/${address}`, {
      method,
      headers: {
        "Content-Type": contentType,
        ...(token && { usertoken: token }),
        identity,
      },
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en la solicitud");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Error desconocido en requestAPI");
  }
};
