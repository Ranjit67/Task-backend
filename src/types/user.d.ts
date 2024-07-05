import { Document } from "mongoose";

export default interface USER_TYPE extends Document {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  state: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: Date;
}
