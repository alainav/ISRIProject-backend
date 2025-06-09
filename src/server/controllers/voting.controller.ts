import ControllerData from "../interfaces/ControllerData.js";
import CallbackFunction from "../interfaces/CallbackFunction.js";
import { CRUDOperations } from "../../utils/API.js";
import { sockets } from "../onlines.js";

export const create_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => CRUDOperations("POST", "voting/register", data, callback);

export const update_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { id } = data;
  CRUDOperations("PUT", `voting/update/${id}`, data, callback);
};

export const delete_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { id } = data;
  CRUDOperations("DELETE", `voting/delete/${id}`, data, callback);
};

export const list_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { page } = data;
  CRUDOperations(
    "PATCH",
    `voting/${page ? `?page=${page}` : ""}`,
    data,
    callback
  );
};

export const change_status_voting = (
  data: ControllerData,
  callback: CallbackFunction
) => {
  const { id } = data;
  CRUDOperations("PUT", `voting/change-status/${id}`, data, callback);
};

export const execute_vote = async (
  data: ControllerData,
  callback: CallbackFunction | null,
  flag?: any
) => {
  const { id } = data;

  let res = undefined;
  if (!flag) {
    res = await CRUDOperations(
      "PUT",
      `voting/execute-vote/${id}`,
      data,
      callback
    );
  }

  if (res || flag) {
    const socket = sockets.get(data.identity);

    let monitor = flag;
    //Comprueba que no ha sido enviado desde show_monitor
    if (!flag) {
      monitor = await show_monitor(data, null);
    }

    if (!monitor) {
      return;
    }

    if (!res) {
      res = monitor;
    }

    const country = await deputy_country(data, null);

    const rooms = socket?.socket.rooms;
    if (country) {
      if (!Array.of(rooms).includes(country.auxData.name)) {
        socket?.socket.join(country.auxData.name);
      }
    }

    for (let c of res.auxData) {
      socket?.io.to(c).emit("executed-votes", monitor);
    }
  }
};

export const show_monitor = async (
  data: ControllerData,
  callback: CallbackFunction | null
) => {
  const { id } = data;
  const list_monitor = await CRUDOperations(
    "PATCH",
    `voting/monitor/${id}`,
    data,
    callback
  );

  await execute_vote(data, callback, list_monitor);
  return list_monitor;
};

const deputy_country = async (
  data: ControllerData,
  callback: CallbackFunction | null
) => {
  const country = await CRUDOperations(
    "PATCH",
    `deputy/country`,
    data,
    callback
  );

  return country;
};
