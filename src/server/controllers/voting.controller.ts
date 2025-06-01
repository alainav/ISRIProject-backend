import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations } from "../../utils/API.js";

export const create_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "i/login", data, callback);

export const update_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PUT", "i/login", data, callback);

export const delete_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("DELETE", "i/login", data, callback);

export const list_voting = (data: ControllerData, callback: CallbackFunction) =>
  CRUDOperations("GET", "i/login", data, callback);

export const change_status_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("GET", "i/login", data, callback);

export const execute_vote = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("GET", "i/login", data, callback);

export const show_monitor = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("GET", "i/login", data, callback);
