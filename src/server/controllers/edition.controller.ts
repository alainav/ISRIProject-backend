import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations } from "../../utils/API.js";

export const create_edition = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "editions/register", data, callback);

export const update_edition = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { id } = data;
  CRUDOperations("PUT", `editions/update/${id}`, data, callback);
};

export const delete_edition = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { id } = data;
  CRUDOperations("DELETE", `editions/delete/${id}`, data, callback);
};

export const list_editions = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;
  CRUDOperations(
    "PATCH",
    `editions${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};

export const list_active_editions = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  CRUDOperations("PATCH", `editions/active`, data, callback);
};
