import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations } from "../../utils/API.js";

export const create_commission = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "commission/register", data, callback);

export const update_commission = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { id } = data;
  CRUDOperations("PUT", `commission/update/${id}`, data, callback);
};
export const delete_commission = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { id } = data;
  CRUDOperations("DELETE", `commission/delete/${id}`, data, callback);
};

export const list_commissions = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;
  CRUDOperations(
    "PATCH",
    `commission${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};
