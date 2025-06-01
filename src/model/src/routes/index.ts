import { Router } from "express";
import { createAuthRoutes } from "./deputy.routes.js";
import { createUserRoutes } from "./usuario.routes.js";
import { createListDeputiesRoutes } from "./list-deputies.routes.js";

export const createRoutes = () => {
  const router = Router();

  // Rutas públicas
  router.use("/deputy/lists", createListDeputiesRoutes());
  router.use("/deputy", createAuthRoutes());
  router.use("/user", createUserRoutes());

  return router;
};
