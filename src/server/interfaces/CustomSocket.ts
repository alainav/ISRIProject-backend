import { Server, Socket } from "socket.io";

interface CustomSocket {
  socket: Socket;
  io: Server;
  identity: string;
}

export default CustomSocket;
