import { Router } from "express";
import { AuthService } from "../services/authService.js";
import { AuthControllers } from "../controllers/auth.controllers.js";
import { registerValidator } from "../middlewares/authMiddlewares.js";

const authService = new AuthService();
const controller = new AuthControllers(authService);

export const createAuthRoutes = (): Router => {
  const router: Router = Router();

  router.post("/register", registerValidator, controller.registerController);
  router.post("/login", controller.loginController);

  return router;
};
