import { NextFunction, Response } from "express";
import { body, param, query } from "express-validator";
import { NotFound } from "http-errors";
import { fieldValidateError, getData } from "../helper";
import { MIDDLEWARE_REQUEST_TYPE } from "../types";
import CityModel from "../models/city.model";
import CITY_TYPE from "../types/city";

class CityController {
  async create(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);

      const cityData = await CityModel.create({
        ...req.body,
      });

      res.json({
        message: "City created successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
  async getAll(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);
      const {
        perPage,
        pageNo,

        stateId,
        id,
      } = req.query;

      const arg: any = {};

      id && (arg["_id"] = id);
      stateId && (arg["stateId"] = stateId);

      const dataGate = await getData<CITY_TYPE, any>(
        CityModel,
        arg,
        Number(perPage),
        Number(pageNo),
        "",
        "",
        { createdAt: -1 }
      );
      res.json({
        success: {
          data: dataGate,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async update(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);
      const { _id } = req.params;

      const updateCityData = await CityModel.findByIdAndUpdate(
        _id,
        {
          ...req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!updateCityData) throw new NotFound("City is not found.");
      res.json({
        success: {
          message: "City is updated successfully.",
          data: updateCityData,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { _id } = req.params;

      const cityDelete = await CityModel.findByIdAndDelete(_id);
      if (!cityDelete) throw new NotFound("City not found.");

      res.json({
        success: {
          message: "City deleted successfully.",
          data: cityDelete,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
export const CityControllerValidation = {
  getAll: [
    query("id")
      .optional()
      .exists()
      .isMongoId()
      .withMessage("id must be mongoose id."),
    query("stateId")
      .optional()
      .exists()
      .isMongoId()
      .withMessage("stateId must be mongoose id."),
  ],
  updated: [
    param("_id")
      .not()
      .isEmpty()
      .withMessage("_id is required.")
      .isMongoId()
      .withMessage("_id must be the mongoose id."),
    body("title")
      .optional()
      .isLength({ min: 3 })
      .withMessage("title must be 3 digit.")
      .isLength({ max: 150 })
      .withMessage("title must be 150 digit."),
  ],
  create: [
    body("title").not().isEmpty().withMessage("title is require."),
    body("stateId")
      .not()
      .isEmpty()
      .withMessage("stateId is require.")
      .isMongoId()
      .withMessage("stateId must be mongoes id."),
  ],
};

export default CityController;
