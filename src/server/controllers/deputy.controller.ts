import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations, requestAPI } from "../../utils/API.js";
import Data from "../../utils/Data.js";

export const authenticate = async (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "POST",
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

export const create_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "i/login", data, callback);

export const update_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PUT", "i/login", data, callback);

export const delete_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("DELETE", "i/login", data, callback);

export const list_all_deputies = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PATCH", "i/login", data, callback);

export const activate_deputy = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PUT", "i/login", data, callback);

export const get_list_deputies = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PATCH", "i/login", data, callback);

export const get_list_commissions_presidents = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PATCH", "i/login", data, callback);

export const get_list_commissions_secretaries = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PATCH", "i/login", data, callback);

export const get_list_general_presidents = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PATCH", "i/login", data, callback);

export const get_list_general_secretaries = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PATCH", "i/login", data, callback);
