import { Router } from "express";
import { createAuthRoutes } from "./deputy.routes.js";
import { createListDeputiesRoutes } from "./list-deputies.routes.js";
import { createCommissionsRoutes } from "./commission.routes.js";
import { createEditionsRoutes } from "./editions.routes.js";
import { createVotingRoutes } from "./voting.routes.js";
import { createSpecialsRoutes } from "./specials.routes.js";

export const createRoutes = () => {
  const router = Router();

  // Rutas públicas
  router.use("/deputy/lists", createListDeputiesRoutes());
  router.use("/deputy", createAuthRoutes());
  router.use("/commission", createCommissionsRoutes());
  router.use("/editions", createEditionsRoutes());
  router.use("/voting", createVotingRoutes());
  router.use("/specials", createSpecialsRoutes());

  return router;
};
