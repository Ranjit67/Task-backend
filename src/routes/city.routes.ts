import { Router } from "express";
import CityController, {
  CityControllerValidation,
} from "../controllers/city.controller";

export default class CityRoutes {
  public router: Router;
  private cityController: CityController;
  public path = "city";

  constructor() {
    this.router = Router();
    this.cityController = new CityController();
    this.routes();
  }
  private routes() {
    this.router.get(
      "/",
      CityControllerValidation.getAll,
      this.cityController.getAll
    );
    this.router.post(
      "/create",
      CityControllerValidation.create,
      this.cityController.create
    );
    this.router.put(
      "/update/:_id",
      CityControllerValidation.updated,
      this.cityController.update
    );
    this.router.delete(
      "/delete/:_id",
      CityControllerValidation.updated,
      this.cityController.update
    );
  }
}
