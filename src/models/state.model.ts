import { model, Model, Schema } from "mongoose";
import STATE_TYPE from "../types/state";

const stateSchema = new Schema<STATE_TYPE, Model<STATE_TYPE>>(
  {
    title: {
      type: String,
    },
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country",
    },
  },
  { timestamps: true }
);

const StateModel = model<STATE_TYPE, Model<STATE_TYPE>>("State", stateSchema);
export default StateModel;
