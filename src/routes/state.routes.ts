import { Router } from "express";
import StateController, {
  StateControllerValidation,
} from "../controllers/state.controller";

export default class StateRoutes {
  public router: Router;
  private stateController: StateController;
  public path = "state";

  constructor() {
    this.router = Router();
    this.stateController = new StateController();
    this.routes();
  }
  private routes() {
    this.router.get(
      "/",
      StateControllerValidation.getAll,
      this.stateController.getAll
    );
    this.router.post(
      "/create",
      StateControllerValidation.create,
      this.stateController.create
    );
    this.router.put(
      "/update/:_id",
      StateControllerValidation.updated,
      this.stateController.update
    );
    this.router.delete(
      "/delete/:_id",
      StateControllerValidation.updated,
      this.stateController.update
    );
  }
}
