import { Router } from "express";
import authValidators from "../middlewares/authMiddlewares.js";
import commissionMiddlewares from "../middlewares/commissionMiddlewares.js";
import { CommissionControllers } from "../controllers/commission.controller.js";
import { CommissionServices } from "../services/commission.service.js";

const controller = new CommissionControllers(new CommissionServices());

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
      commissionMiddlewares.verifyCommissionOperation,
    ],
    controller.updateController
  );

  router.delete(
    "/delete/:id",
    [
      authValidators.verifyAccessByToken,
      commissionMiddlewares.verifyCommissionOperation,
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
