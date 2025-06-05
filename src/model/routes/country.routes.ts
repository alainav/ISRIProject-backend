import { Router } from "express";
import { CountryControllers } from "../controllers/country.controller.js";
import { CountryServices } from "../services/country.service.js";

const controller = new CountryControllers(new CountryServices());

export const createContriesRoutes = (): Router => {
  const router: Router = Router();

  router.patch("/", controller.listController);

  return router;
};
