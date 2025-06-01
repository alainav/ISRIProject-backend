import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations } from "../../utils/API.js";

export const create_edition = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "i/login", data, callback);

export const update_edition = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("PUT", "i/login", data, callback);

export const delete_edition = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("DELETE", "i/login", data, callback);

export const list_editions = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("GET", "i/login", data, callback);
