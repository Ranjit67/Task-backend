import { NextFunction, Response } from "express";
import { body, param, query } from "express-validator";
import { NotFound } from "http-errors";
import { fieldValidateError, getData } from "../helper";
import { MIDDLEWARE_REQUEST_TYPE } from "../types";
import StateModel from "../models/state.model";
import STATE_TYPE from "../types/state";

class StateController {
  async create(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);

      const stateData = await StateModel.create({
        ...req.body,
      });

      res.json({
        message: "State created successfully.",
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
      const { perPage, pageNo, countryId, id } = req.query;

      const arg: any = {};

      id && (arg["_id"] = id);
      countryId && (arg["countryId"] = countryId);

      const dataGate = await getData<STATE_TYPE, any>(
        StateModel,
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

      const updateStateData = await StateModel.findByIdAndUpdate(
        _id,
        {
          ...req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!updateStateData) throw new NotFound("State is not found.");
      res.json({
        success: {
          message: "State is updated successfully.",
          data: updateStateData,
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

      const stateDelete = await StateModel.findByIdAndDelete(_id);
      if (!stateDelete) throw new NotFound("State not found.");

      res.json({
        success: {
          message: "State deleted successfully.",
          data: stateDelete,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
export const StateControllerValidation = {
  getAll: [
    query("id")
      .optional()
      .exists()
      .isMongoId()
      .withMessage("id must be mongoose id."),
    query("countryId")
      .optional()
      .exists()
      .isMongoId()
      .withMessage("countryId must be mongoose id."),
  ],
  updated: [
    param("_id")
      .not()
      .isEmpty()
      .withMessage("_id is required.")
      .isMongoId()
      .withMessage("_id must be the mongoose id."),

    body("title").optional(),
    body("countryId")
      .optional()
      .isMongoId()
      .withMessage("countryId must be mongoes id"),
  ],
  create: [
    body("title").not().isEmpty().withMessage("title is require."),
    body("countryId")
      .not()
      .isEmpty()
      .withMessage("countryId is require.")
      .isMongoId()
      .withMessage("countryId must be mongoes id"),
  ],
};

export default StateController;
