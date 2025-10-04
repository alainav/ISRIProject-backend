import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations, requestAPI } from "../../utils/API.js";
import Data from "../../utils/Data.js";
import { sockets } from "../onlines.js";

export const authenticate = async (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "deputy/login",
      "POST",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response });

    //Unir al socket al pais
    const socket = sockets.get(identity)?.socket;

    socket?.join(response.country);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    callback({ success: false, message });
  }
};

export const create_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "deputy/register", data, callback);

export const update_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { userName } = data;
  CRUDOperations("PUT", `deputy/update/${userName}`, data, callback);
};

export const delete_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { userName } = data;
  CRUDOperations("DELETE", `deputy/delete/${userName}`, data, callback);
};

export const delete_permanent_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { userName } = data;
  CRUDOperations(
    "DELETE",
    `deputy/delete/permanent/${userName}`,
    data,
    callback
  );
};

export const activate_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { userName } = data;
  CRUDOperations("PUT", `deputy/reactivate/${userName}`, data, callback);
};

export const list_all_deputies = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;
  CRUDOperations(
    "PATCH",
    `deputy/lists${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};

export const get_list_deputies = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;
  CRUDOperations(
    "PATCH",
    `deputy/lists/deputies${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};

export const get_list_commissions_presidents = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;
  CRUDOperations(
    "PATCH",
    `deputy/lists/commission-presidents${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};

export const get_list_commissions_secretaries = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;
  CRUDOperations(
    "PATCH",
    `deputy/lists/commission-secretaries${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};

export const get_list_general_presidents = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;
  CRUDOperations(
    "PATCH",
    `deputy/lists/general-presidents${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};

export const get_list_general_secretaries = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;

  CRUDOperations(
    "PATCH",
    `deputy/lists/general-secretaries${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};
