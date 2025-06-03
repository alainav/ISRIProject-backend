import { Router } from "express";
import { createAuthRoutes } from "./deputy.routes.js";
import { createListDeputiesRoutes } from "./list-deputies.routes.js";
import { createCommissionsRoutes } from "./commission.routes.js";
import { createEditionsRoutes } from "./editions.routes.js";

export const createRoutes = () => {
  const router = Router();

  // Rutas públicas
  router.use("/deputy/lists", createListDeputiesRoutes());
  router.use("/deputy", createAuthRoutes());
  router.use("/commission", createCommissionsRoutes());
  router.use("/editions", createEditionsRoutes());

  return router;
};
