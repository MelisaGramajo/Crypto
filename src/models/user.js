import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
  name: {
      type: String,
      required: true
  },
  lastname: {
      type: String,
      required: true
  },
  username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
  },
  password: {
      type: String,
      required: true
  },
  money: {
      type: String,
      required: true
  }
  },
  { timestamps: true }
);

export default model("User", userSchema);
