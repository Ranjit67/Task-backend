import { Router } from "express";
import CountryController, {
  CountryControllerValidation,
} from "../controllers/country.controller";

export default class CountryRoutes {
  public router: Router;
  private countryController: CountryController;
  public path = "country";

  constructor() {
    this.router = Router();
    this.countryController = new CountryController();
    this.routes();
  }
  private routes() {

    this.router.get(
      "/",
      CountryControllerValidation.getAll,
      this.countryController.getAll
    );
    this.router.post(
      "/create",
      CountryControllerValidation.create,
      this.countryController.create
    );
    this.router.put(
      "/update/:_id",
      CountryControllerValidation.updated,
      this.countryController.update
    );
    this.router.delete(
      "/delete/:_id",
      CountryControllerValidation.updated,
      this.countryController.update
    );
  }
}

