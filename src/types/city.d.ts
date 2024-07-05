import { Document, ObjectId } from "mongoose";
export default interface CITY_TYPE extends Document {
  title: string;
  stateId: ObjectId;
}
