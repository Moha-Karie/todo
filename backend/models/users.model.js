import { Schema, model } from "mongoose";

const usersSchema = new Schema(
  {
    
    name: {
      type: String,
      required: [true, "Name is required!"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Password is required!"],
    },
  },
  {
    timestamps: true,
  }
);

const usersModel = model("users", usersSchema);


export default usersModel;