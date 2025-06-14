import { Router } from "express";
import { ListDeputyController } from "../controllers/list-deputies.controller.js";
import { ListDeputyService } from "../services/listDeputies.service.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const controller = new ListDeputyController(new ListDeputyService());

export const createListDeputiesRoutes = (): Router => {
  const router: Router = Router();

  router.patch(
    "/",
    authMiddlewares.verifyAccessByTokenAndContinue,
    controller.listAllDeputies
  );
  router.patch("/deputies", controller.listOnlyDeputies);
  router.patch(
    "/commission-presidents",
    controller.listOnlyCommissionPresidents
  );
  router.patch(
    "/commission-secretaries",
    controller.listOnlyCommissionSecretaries
  );
  router.patch("/general-presidents", controller.listOnlyGeneralPresidents);
  router.patch("/general-secretaries", controller.listOnlyGeneralSecretaries);

  return router;
};
