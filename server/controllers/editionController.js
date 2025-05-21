import Data from "../utils/Data.js";

export const create_edition = async (data, callback) => {
  const { identity, ...body } = data;
  try {
    const sendData = new Data(
      "i/login",
      "POST",
      "application/json",
      JSON.stringify(body),
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

export const update_edition = async (data, callback) => {
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

export const delete_edition = async (data, callback) => {
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

export const list_editions = async (data, callback) => {
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
