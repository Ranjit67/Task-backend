import { model, Model, Schema } from "mongoose";
import CITY_TYPE from "../types/city";

const citySchema = new Schema<CITY_TYPE, Model<CITY_TYPE>>(
  {
    title: {
      type: String,
    },
    stateId: {
      type: Schema.Types.ObjectId,
      ref: "State",
    },
  },
  { timestamps: true }
);

const CityModel = model<CITY_TYPE, Model<CITY_TYPE>>("City", citySchema);
export default CityModel;
