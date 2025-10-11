import { Router } from "express";
import authValidators from "../middlewares/authMiddlewares.js";
import generalMiddlewares from "../middlewares/generalMiddlewares.js";
import { VotingControllers } from "../controllers/voting.controller.js";
import { VotingService } from "../services/voting.service.js";

const controller = new VotingControllers(new VotingService());

export const createVotingRoutes = (): Router => {
  const router: Router = Router();

  router.post(
    "/register",
    [authValidators.verifyAccessByCommission],
    controller.registerController
  );

  router.put(
    "/update/:id",
    [
      authValidators.verifyAccessByCommission,
      generalMiddlewares.verifyVotingOperation,
    ],
    controller.updateController
  );

  router.delete(
    "/delete/:id",
    [
      authValidators.verifyAccessByCommission,
      //generalMiddlewares.verifyVotingOperation,
    ],
    controller.deleteController
  );

  router.put(
    "/change-status/:id",
    [
      authValidators.verifyAccessByCommission,
      generalMiddlewares.verifyVotingOperation,
    ],
    controller.changeStatusController
  );

  router.put(
    "/execute-vote/:id",
    [
      authValidators.verifyDeputyByToken,
      generalMiddlewares.verifyVotingOperation,
    ],
    controller.executeController
  );

  router.patch(
    "/",
    [authValidators.verifyAccessByTokenAndContinue],
    controller.listController
  );

  router.patch(
    "/monitor/:id",
    [authValidators.verifyAccessByTokenAndContinue],
    controller.showMonitorController
  );

  return router;
};
