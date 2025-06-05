import { Router } from "express";
import { AuthService } from "../services/deputy.service.js";
import { DeputyControllers } from "../controllers/deputy.controller.js";
import authValidators from "../middlewares/authMiddlewares.js";

const controller = new DeputyControllers(new AuthService());

export const createAuthRoutes = (): Router => {
  const router: Router = Router();

  router.post("/login", controller.loginController);
  router.post(
    "/register",
    [
      authValidators.verifyCorreoUnique,
      authValidators.verifyUserName,
      authValidators.verifyIdRole,
      authValidators.verifyAccessByToken,
    ],
    controller.registerController
  );
  router.put(
    "/update/:userName",
    [
      authValidators.comprobateIdRole,
      authValidators.comprobateIdCountry,
      authValidators.comprobateIdDeputy,
      authValidators.verifyAccessByToken,
    ],
    controller.updateController
  );
  router.delete(
    "/delete/:userName",
    [authValidators.verifyAccessByToken, authValidators.comprobateIdDeputy],
    controller.deleteController
  );
  router.put(
    "/reactivate/:userName",
    [authValidators.comprobateIdDeputy, authValidators.verifyAccessByToken],
    controller.reactivateController
  );

  return router;
};
