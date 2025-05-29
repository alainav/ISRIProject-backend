import Data from "../../utils/Data.js";
import { requestAPI } from "../../utils/API.js";

export const authenticate = async (data, callback) => {
  const { identity } = data;
  console.log(data);
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
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const create_deputy = async (data, callback) => {
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
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const update_deputy = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "PUT",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const delete_deputy = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "DELETE",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const list_all_deputies = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "GET",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const activate_deputy = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "PUT",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const get_list_deputies = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "GET",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const get_list_commissions_presidents = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "GET",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const get_list_commissions_secretaries = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "GET",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const get_list_general_presidents = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "GET",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};

export const get_list_general_secretaries = async (data, callback) => {
  const { identity } = data;
  try {
    const sendData = new Data(
      "i/login",
      "GET",
      "application/json",
      JSON.stringify(data),
      undefined,
      identity
    ).data;

    const response = await requestAPI(sendData);
    callback({ success: true, ...response }); // Enviar el token de vuelta al cliente
  } catch (error) {
    try {
      callback({ success: false, message: error.message });
    } catch (error) {
      console.error(error);
    } // Enviar el error al cliente
  }
};
