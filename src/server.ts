import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import dotenv from "dotenv";
import generalController from "./server/controllers/generalController.js";
import { __dirname } from "./server/utils/utils.js";
import path from "path";

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.paths = {};
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      pingTimeout: 5000, // 5 segundos
      pingInterval: 10000, // 10 segundos
      maxHttpBufferSize: 1e8, // 100MB
      perMessageDeflate: {
        threshold: 1024,
        zlibDeflateOptions: {
          level: 3,
        },
      },
    });

    //Conectar a la base de datos
    this.conectarDB();

    //Middlewares -> Es cuando necesitamos alguna funcion dentro del server
    this.middlewares();

    //Rutas de mi servidor
    this.routes();

    //Sockets
    this.sockets();
  }

  async conectarDB() {
    //await dbConnection();
  }

  middlewares() {
    //Configura quien accede y quien no al servidor
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    // Servir archivos estáticos de React
    this.app.use(express.static("./public/client/build"));

    // Manejar rutas de React
    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "./public/client/build", "index.html"));
    });
  }

  routes() {
    //this.app.use(this.paths.registro, routerRegistro);
  }

  sockets() {
    this.io.on("connection", (socket) => {
      // Pasar tanto socket como io al controlador
      generalController(socket, this.io);

      // Manejar reconexiones
      socket.on("reconnect", (attemptNumber) => {
        console.log(`♻ Reconexión #${attemptNumber} de ${socket.id}`);
      });
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

export default Server;
