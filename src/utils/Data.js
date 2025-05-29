import { getSockets } from "../server/controllers/generalController.js";
//Clase que permite construir un objeto data en cualquier parte de la aplicación
//Siempre va ubicado en el try catch
export default class Data {
  /**
   * Permite construir un objeto que estandariza el envio de datos al API
   * @param {string} address Endpoint solicitado
   * @param {string} method Método que se va a utilizar en el API (GET, POST, ...)
   * @param {string} contentType Tipo de contenido
   * @param {string} body Datos que se envian al API
   * @param {string} token Token que posee el usuario para acceder a algun punto específico
   * @param {number} identity Identificador del usuario en la aplicación
   */
  constructor(address, method, contentType, body, token, identity) {
    this.address = address;
    this.method = method;
    this.contentType = contentType;
    this.body = body;
    this.token = token;
    this.identity = identity;
  }

  checkIdentity(identity) {
    if (identity && identity !== null && identity !== "null") {
      return identity;
    } else {
      throw new Error("El identity es de carácter Obligatorio");
    }
  }

  checkAddress(address) {
    if (address && address !== null && address !== "null") {
      return address;
    } else {
      throw new Error("La dirección (address) es de carácter Obligatorio");
    }
  }

  checkMethod(method) {
    if (method && method !== null && method !== "null") {
      return method;
    } else {
      throw new Error("El método (method) es de carácter Obligatorio");
    }
  }

  //Comprueba que la información obligatoria halla sido enviada y luego retorna en caso de error emite una excepción.
  get data() {
    this.checkIdentity(this.identity);
    this.checkAddress(this.address);
    this.checkMethod(this.method);

    const gettedSocket = this.identity ? getSockets(this.identity) : undefined;
    const socket = gettedSocket?.socket;
    const io = gettedSocket?.io;
    return {
      address: this.address,
      method: this.method,
      contentType: this.contentType,
      body: this.body,
      token: this.token,
      identity: this.identity,
      socket,
      io,
    };
  }
}
