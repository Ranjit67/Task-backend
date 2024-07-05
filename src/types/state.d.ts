import { Document, ObjectId } from "mongoose";
export default interface STATE_TYPE extends Document {
  title: string;
  countryId: ObjectId;
}
