import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import http, { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import dotenv from "dotenv";
import generalController from "./server/controllers/general.controller.js"; // Sin .js
import path from "path";
import { __dirname } from "./utils/utils.js";
import { createRoutes } from "./model/routes/index.js";
import { dbConnection } from "./model/config/databaseConection.js";

dotenv.config();
const clientBuildPath = path.join(__dirname, "../client/build");

class Server {
  app: Express;
  port: string | number;
  server: HttpServer;
  io: SocketServer;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      pingTimeout: 5000,
      pingInterval: 10000,
      maxHttpBufferSize: 1e8,
      perMessageDeflate: {
        threshold: 1024,
        zlibDeflateOptions: {
          level: 3,
        },
      },
    });

    this.conectarDB();
    this.middlewares();
    this.routes();
    this.sockets();
  }

  async conectarDB(): Promise<void> {
    await dbConnection();
  }

  middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(clientBuildPath));

    // Manejar rutas de React
    this.app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    });

    // Error handling middleware
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send("Error del servidor");
      }
    );
  }

  routes(): void {
    // this.app.use(this.paths.registro, routerRegistro);
    const routes = createRoutes();
    this.app.use("/api", routes);
  }

  sockets(): void {
    this.io.on("connection", (socket: Socket) => {
      generalController(socket, this.io);

      socket.on("reconnect", (attemptNumber: number) => {
        console.log(`♻ Reconexión #${attemptNumber} de ${socket.id}`);
      });
    });
  }

  listen(): void {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

export default Server;
