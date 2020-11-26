import { Schema, model } from "mongoose";

const userCryptoSchema = new Schema(
  {
  username: {
      type: String,
      required: true,
  },
  crypto: {
      type: String,
      required: true
  }
  },
  { timestamps: true }
);

export default model("UserCrypto", userCryptoSchema);