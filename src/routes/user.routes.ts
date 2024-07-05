import { Router } from "express";
import UserController, {
  UserControllerValidation,
} from "../controllers/user.controller";

export default class UserRoutes {
  public router: Router;
  private userController: UserController;
  public path = "user";

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.routes();
  }
  private routes() {
    //  user get

    this.router.get(
      "/",
      UserControllerValidation.getAll,
      this.userController.getAll
    );
    this.router.post(
      "/create",
      UserControllerValidation.create,
      this.userController.create
    );
    this.router.put(
      "/update/:_id",
      UserControllerValidation.updated,
      this.userController.update
    );
    this.router.delete(
      "/delete/:_id",
      UserControllerValidation.updated,
      // new ProtectedMiddleware().protected,
      this.userController.update
    );
  }
}
