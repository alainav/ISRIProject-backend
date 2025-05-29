import { Router } from "express";
import { createAuthRoutes } from "./auth.routes.js";
import { createUserRoutes } from "./usuario.routes.js";

export const createRoutes = () => {
  const router = Router();

  // Rutas públicas
  router.use("/auth", createAuthRoutes());
  router.use("/user", createUserRoutes());

  return router;
};
