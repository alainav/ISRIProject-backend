import { getSockets } from "../controllers/generalController.js";

export const requestAPI = async (data) => {
  const { address, method, contentType, body, token } = data;
  let userId = String(data.userId);
  try {
    const response = await fetch(
      `http://${
        getSockets(userId).socket.handshake.headers.host
      }/api/v1/${address}`,
      {
        method, // Asegúrate de usar el método POST
        headers: {
          "Content-Type": contentType, // Especifica el tipo de contenido
          usertoken: token ? token : undefined,
          userId,
        },
        body,
      }
    );

    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const json = await response.json(); // Parsear el JSON de la respuesta
    return json; // Retorna el cuerpo de respuesta para su uso posterior
  } catch (error) {
    throw error; // Propaga el error para que pueda ser manejado en otro lugar
  }
};
