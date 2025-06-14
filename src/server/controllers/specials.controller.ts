import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations } from "../../utils/API.js";

export const get_countries = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  CRUDOperations("PATCH", `specials/countries`, data, callback);
};

export const get_roles = (data: ControllerData, callback: CallbackFunction) =>
  CRUDOperations("PATCH", "specials/roles", data, callback);
