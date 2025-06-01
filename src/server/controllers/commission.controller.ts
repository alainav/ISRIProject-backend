import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations } from "../../utils/API.js";

export const create_commission = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "i/login", data, callback);

export const update_commission = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "i/login", data, callback);

export const delete_commission = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "i/login", data, callback);

export const list_commissions = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "i/login", data, callback);
