echo "Script started"
touch ./src/controllers/$1.controller.ts
touch ./src/models/$1.model.ts
touch ./src/routes/$1.routes.ts
touch ./src/types/$1.d.ts
echo $1 "File created Successfully."
# chmod +x scripts/create.sh




# Check if an argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <TypeName>"
  exit 1
fi

# Get the type name from the first argument
TYPE_NAME=$(echo "$1" | tr '[:lower:]' '[:upper:]')
TYPE=$1

# Create the directory if it doesn't exist
mkdir -p src/types

# Write the TypeScript declaration to the file
cat <<EOL > src/types/$TYPE.d.ts
import { Document, ObjectId } from 'mongoose';
export default interface ${TYPE_NAME}_TYPE extends Document {
}
EOL

# Check ROUTE
if [ -z "$1" ]; then
  echo "Usage: $0 <TypeName>"
  exit 1
fi

# Get the type name from the first argument
TYPE_NAME=$(echo "$1" | tr '[:lower:]' '[:upper:]')
FIRST_TYPE_NAME=$(echo "$1" | sed 's/.*/\L&/; s/[a-z]/\u&/')
TYPE=$1

# Create the directory if it doesn't exist
mkdir -p src/routs

# Write the TypeScript declaration to the file
cat <<EOL > src/routes/$TYPE.routes.ts
import { Router } from "express";
import ${FIRST_TYPE_NAME}Controller, {
  ${FIRST_TYPE_NAME}ControllerValidation,
} from "../controllers/${TYPE}.controller";

export default class ${FIRST_TYPE_NAME}Routes {
  public router: Router;
  private ${TYPE}Controller: ${FIRST_TYPE_NAME}Controller;
  public path = "${TYPE}";

  constructor() {
    this.router = Router();
    this.${TYPE}Controller = new ${FIRST_TYPE_NAME}Controller();
    this.routes();
  }
  private routes() {

    this.router.get(
      "/",
      ${FIRST_TYPE_NAME}ControllerValidation.getAll,
      this.${TYPE}Controller.getAll
    );
    this.router.post(
      "/create",
      ${FIRST_TYPE_NAME}ControllerValidation.create,
      this.${TYPE}Controller.create
    );
    this.router.put(
      "/update/:_id",
      ${FIRST_TYPE_NAME}ControllerValidation.updated,
      this.${TYPE}Controller.update
    );
    this.router.delete(
      "/delete/:_id",
      ${FIRST_TYPE_NAME}ControllerValidation.updated,
      this.${TYPE}Controller.update
    );
  }
}

EOL

# Check MODEL
if [ -z "$1" ]; then
  echo "Usage: $0 <TypeName>"
  exit 1
fi

# Get the type name from the first argument
TYPE_NAME=$(echo "$1" | tr '[:lower:]' '[:upper:]')
FIRST_TYPE_NAME=$(echo "$1" | sed 's/.*/\L&/; s/[a-z]/\u&/')
TYPE=$1

# Create the directory if it doesn't exist
mkdir -p src/models

# Write the TypeScript declaration to the file
cat <<EOL > src/models/$TYPE.model.ts
import { model, Model, Schema } from "mongoose";
import ${TYPE_NAME}_TYPE from "../types/${TYPE}";

const ${TYPE}Schema = new Schema<${TYPE_NAME}_TYPE, Model<${TYPE_NAME}_TYPE>>(
  {
   
  },
  { timestamps: true }
);

const ${FIRST_TYPE_NAME}Model = model<${TYPE_NAME}_TYPE, Model<${TYPE_NAME}_TYPE>>("${FIRST_TYPE_NAME}", ${TYPE}Schema);
export default ${FIRST_TYPE_NAME}Model;

EOL

# Check CONTROLL
if [ -z "$1" ]; then
  echo "Usage: $0 <TypeName>"
  exit 1
fi

# Get the type name from the first argument
TYPE_NAME=$(echo "$1" | tr '[:lower:]' '[:upper:]')
FIRST_TYPE_NAME=$(echo "$1" | sed 's/.*/\L&/; s/[a-z]/\u&/')
TYPE=$1

# Create the directory if it doesn't exist
mkdir -p src/controllers

# Write the TypeScript declaration to the file
cat <<EOL > src/controllers/$TYPE.controller.ts
import { NextFunction, Response } from "express";
import { body, param, query } from "express-validator";
import { NotFound } from "http-errors";
import { fieldValidateError, getData } from "../helper";
import { MIDDLEWARE_REQUEST_TYPE } from "../types";
import ${FIRST_TYPE_NAME}Model from "../models/${TYPE}.model";
import ${TYPE_NAME}_TYPE from "../types/state";

class ${FIRST_TYPE_NAME}Controller {
  async create(
    req: MIDDLEWARE_REQUEST_TYPE,
    res: Response,
    next: NextFunction
  ) {
    try {
      fieldValidateError(req);
      const ${TYPE}Data = await ${FIRST_TYPE_NAME}Model.create({
        ...req.body
      });
      
     
      res.json({
        message: "${FIRST_TYPE_NAME} created successfully.",
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

     

      const dataGate = await getData<${TYPE_NAME}_TYPE, any>(
        ${FIRST_TYPE_NAME}Model,
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

      const update${FIRST_TYPE_NAME}Data = await ${FIRST_TYPE_NAME}Model.findByIdAndUpdate(
        _id,
        {
          ...req.body,

         
        },
        {
          runValidators: true,
          new: true,
        }
      );
      if (!update${FIRST_TYPE_NAME}Data) throw new NotFound("${FIRST_TYPE_NAME} is not found.");
      res.json({
        success: {
          message: "${FIRST_TYPE_NAME} is updated successfully.",
          data: update${FIRST_TYPE_NAME}Data,
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

      const ${TYPE}Delete = await ${FIRST_TYPE_NAME}Model.findByIdAndDelete(_id);
      if (!${TYPE}Delete) throw new NotFound("${FIRST_TYPE_NAME} not found.");

      res.json({
        success: {
          message: "${FIRST_TYPE_NAME} deleted successfully.",
          data: ${TYPE}Delete,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
export const ${FIRST_TYPE_NAME}ControllerValidation = {
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

export default ${FIRST_TYPE_NAME}Controller;


EOL

echo "TypeScript declaration file for ${TYPE_NAME} created at src/models/$TYPE.model.ts"
