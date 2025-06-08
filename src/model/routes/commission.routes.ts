import { Router } from "express";
import authValidators from "../middlewares/authMiddlewares.js";
import { CommissionControllers } from "../controllers/commission.controller.js";
import { CommissionServices } from "../services/commission.service.js";
import generalMiddlewares from "../middlewares/generalMiddlewares.js";

const controller = new CommissionControllers(new CommissionServices());

export const createCommissionsRoutes = (): Router => {
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
      generalMiddlewares.verifyCommissionOperation,
      generalMiddlewares.verifyEditionOperation,
    ],
    controller.updateController
  );

  router.delete(
    "/delete/:id",
    [
      authValidators.verifyAccessByToken,
      generalMiddlewares.verifyCommissionOperation,
      generalMiddlewares.verifyEditionOperation,
    ],
    controller.deleteController
  );

  router.patch(
    "/",
    [authValidators.verifyAccessByTokenAndContinue],
    controller.listController
  );

  return router;
};
