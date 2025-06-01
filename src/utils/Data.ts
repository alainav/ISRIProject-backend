import RequestAPIData from "../interfaces/RequestAPIData.js";
import { getSockets } from "../server/controllers/general.controller.js";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export default class Data implements RequestAPIData {
  address: string;
  method: HttpMethod;
  contentType: string;
  body: string;
  token?: string;
  identity: string;

  constructor(
    address: string,
    method: HttpMethod,
    contentType: string,
    body: string,
    token?: string,
    identity?: string
  ) {
    this.address = address;
    this.method = method;
    this.contentType = contentType;
    this.body = body;
    this.token = token;
    this.identity = identity || "null";
  }

  private checkIdentity(identity: string): string {
    if (identity && identity !== "null") {
      return identity;
    } else {
      throw new Error("El identity es de carácter Obligatorio");
    }
  }

  private checkAddress(address: string): string {
    if (address) {
      return address;
    } else {
      throw new Error("La dirección (address) es de carácter Obligatorio");
    }
  }

  private checkMethod(method: HttpMethod): HttpMethod {
    if (method) {
      return method;
    } else {
      throw new Error("El método (method) es de carácter Obligatorio");
    }
  }

  get data(): RequestAPIData {
    const identity = this.checkIdentity(this.identity);
    const address = this.checkAddress(this.address);
    const method = this.checkMethod(this.method);

    const socketObj = getSockets(identity);
    return {
      address,
      method,
      contentType: this.contentType,
      body: this.body,
      token: this.token,
      identity,
      socket: socketObj?.socket,
      io: socketObj?.io,
    };
  }
}
