import { Router } from "express";
import { SpecialControllers } from "../controllers/special.controller.js";
import { SpecialsServices } from "../services/specials.service.js";

const controller = new SpecialControllers(new SpecialsServices());

export const createSpecialsRoutes = (): Router => {
  const router: Router = Router();

  router.patch("/countries", controller.listController);
  router.patch("/roles", controller.roleController);

  return router;
};
