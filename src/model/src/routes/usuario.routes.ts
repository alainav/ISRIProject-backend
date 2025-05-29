import { Router } from "express";
import { UserService } from "../services/usuarioService.js";
import { UserController } from "../controllers/usuario.controllers.js";
import { verificarJWT } from "../middlewares/verificarJWT.js";

export const createUserRoutes = (): Router => {
  const router: Router = Router();

  const userService: UserService = new UserService();
  const userController: UserController = new UserController(userService);

  router.get("/listUser", verificarJWT, userController.listUsers);

  router.put("/updateUser");

  router.delete("/deleteUser");

  return router;
};
