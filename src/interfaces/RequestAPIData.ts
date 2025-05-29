import { Server, Socket } from "socket.io";

interface RequestAPIData {
  address: string;
  method: string;
  contentType: string;
  body: string;
  token?: string;
  identity: string;
  socket?: Socket;
  io?: Server;
}

export default RequestAPIData;
