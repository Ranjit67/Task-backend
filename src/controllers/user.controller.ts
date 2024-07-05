import { NextFunction, Response } from "express";
import { body, param, query } from "express-validator";
import { NotFound } from "http-errors";
import { fieldValidateError, getData } from "../helper";
import { MIDDLEWARE_REQUEST_TYPE, USER_TYPE } from "../types";
import UserSchema from "../models/user.model";

class UserController {
  async create(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);
      const {
        firstName,
        lastName,
        dateOfBirth,
        email,
        country,
        city,
        state,
        gender,
      } = req.body;

      const userData = await UserSchema.create({
        firstName,
        lastName,
        email,
        country,
        city,
        state,
        gender,
        dateOfBirth: new Date(dateOfBirth),
      });
      res.json({
        message: "User created successfully.",
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

      if (searchTitle)
        arg["$or"] = [
          { name: { $regex: searchTitle, $options: "i" } },
          { email: { $regex: searchTitle, $options: "i" } },
          { phoneNumber: { $regex: searchTitle, $options: "i" } },
          { role: { $regex: searchTitle, $options: "i" } },
          { gender: { $regex: searchTitle, $options: "i" } },
        ];

      const dataGate = await getData<USER_TYPE, any>(
        UserSchema,
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

      const updateUserData = await UserSchema.findByIdAndUpdate(
        _id,
        {
          ...req.body,

          email: undefined,
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!updateUserData) throw new NotFound("User is not found.");
      res.json({
        success: {
          message: "User is updated successfully.",
          data: updateUserData,
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

      const userDelete = await UserSchema.findByIdAndDelete(_id);
      if (!userDelete) throw new NotFound("User not found.");

      res.json({
        success: {
          message: "User deleted successfully.",
          data: userDelete,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
export const UserControllerValidation = {
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
  create: [
    body("firstName").not().isEmpty().withMessage("firstName is require."),
    body("lastName").not().isEmpty().withMessage("lastName is require."),
    body("email").not().isEmpty().withMessage("email is require."),
    body("country").not().isEmpty().withMessage("country is require."),
    body("city").not().isEmpty().withMessage("city is require."),
    body("state").not().isEmpty().withMessage("state is require."),

    body("gender")
      .not()
      .isEmpty()
      .exists()
      .isIn(["MALE", "FEMALE"])
      .withMessage("gender must be MALE or FEMALE."),
  ],
};

export default UserController;
