import { NextFunction, Response } from "express";
import { body, param, query } from "express-validator";
import { NotFound } from "http-errors";
import { fieldValidateError, getData } from "../helper";
import { MIDDLEWARE_REQUEST_TYPE } from "../types";
import CountryModel from "../models/country.model";
import COUNTRY_TYPE from "../types/country";

class CountryController {
  async create(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);
      const countryData = await CountryModel.create({
        ...req.body,
      });

      res.json({
        message: "Country created successfully.",
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
        gender,
        searchTitle,

        userId,
      } = req.query;

      const arg: any = {};

      gender && (arg["gender"] = gender);

      userId && (arg["_id"] = userId);

      const dataGate = await getData<COUNTRY_TYPE, any>(
        CountryModel,
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

      const updateCountryData = await CountryModel.findByIdAndUpdate(
        _id,
        {
          ...req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!updateCountryData) throw new NotFound("Country is not found.");
      res.json({
        success: {
          message: "Country is updated successfully.",
          data: updateCountryData,
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

      const countryDelete = await CountryModel.findByIdAndDelete(_id);
      if (!countryDelete) throw new NotFound("Country not found.");

      res.json({
        success: {
          message: "Country deleted successfully.",
          data: countryDelete,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
export const CountryControllerValidation = {
  getAll: [
    query("gender")
      .optional()
      .exists()
      .isIn(["MALE", "FEMALE"])
      .withMessage("gender must be MALE or FEMALE."),
    query("userId")
      .optional()
      .exists()
      .isMongoId()
      .withMessage("userId must be mongoose id."),
  ],
  updated: [
    param("_id")
      .not()
      .isEmpty()
      .withMessage("_id is required.")
      .isMongoId()
      .withMessage("_id must be the mongoose id."),
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("name must be 3 digit.")
      .isLength({ max: 150 })
      .withMessage("name must be 150 digit."),

    body("gender")
      .optional()
      .exists()
      .isIn(["MALE", "FEMALE"])
      .withMessage("gender must be MALE or FEMALE."),
  ],
  create: [body("title").not().isEmpty().withMessage("title is require.")],
};

export default CountryController;
