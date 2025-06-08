import { Router } from "express";
import authValidators from "../middlewares/authMiddlewares.js";
import { EditionsController } from "../controllers/editions.controller.js";
import { EditionService } from "../services/editions.service.js";
import generalMiddlewares from "../middlewares/generalMiddlewares.js";

const controller = new EditionsController(new EditionService());

export const createEditionsRoutes = (): Router => {
  const router: Router = Router();

  router.post(
    "/register",
    [authValidators.verifyAccessByToken],
    controller.registerController
  );

  router.put(
    "/update/:id",
    [
      authValidators.verifyAccessByToken,
      generalMiddlewares.verifyEditionOperation,
    ],
    controller.updateController
  );

  router.delete(
    "/delete/:id",
    [
      authValidators.verifyAccessByToken,
      generalMiddlewares.verifyEditionOperation,
    ],
    controller.deleteController
  );

  router.patch(
    "/active",
    [authValidators.verifyAccessByTokenAndContinue],
    controller.listSpecialController
  );

  router.patch(
    "/",
    [authValidators.verifyAccessByTokenAndContinue],
    controller.listController
  );

  return router;
};
