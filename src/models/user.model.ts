import { model, Model, Schema } from "mongoose";
import { USER_TYPE } from "../types";

const userSchema = new Schema<USER_TYPE, Model<USER_TYPE>>(
  {
    firstName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      unique: true,
      type: String,
      index: true,
    },

    country: {
      type: String,
    },
    city: {
      type: String,
    },

    state: {
      type: String,
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE"],
        message: "Gender value should be one of MALE, FEMALE.",
      },
    },
    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserSchema = model<USER_TYPE, Model<USER_TYPE>>("User", userSchema);
UserSchema.syncIndexes();
export default UserSchema;
