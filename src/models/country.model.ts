import { model, Model, Schema } from "mongoose";
import COUNTRY_TYPE from "../types/country";

const countrySchema = new Schema<COUNTRY_TYPE, Model<COUNTRY_TYPE>>(
  {
    title: {
      type: String,
    },
  },
  { timestamps: true }
);

const CountryModel = model<COUNTRY_TYPE, Model<COUNTRY_TYPE>>(
  "Country",
  countrySchema
);
export default CountryModel;
