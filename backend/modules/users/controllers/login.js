import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwtManager from "../../../managers/jwtManager.js";

const login = async (req, res) => {
  // importing users model
  const usersModel = mongoose.model("users");

  //Destructuring data
  const { email, password } = req.body;

  //checcking if the user exists
  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) throw "This email does not exist in the system";

  // compare functionality
  const comparePassword = await bcrypt.compare(password, getUser.password);

  if (!comparePassword) throw "Email and passwrod do not match!";

  // jwt manager
const accessToken = jwtManager(getUser)

  // success response
  res.status(200).json({
    status: "Sucess",
    message: "User login sucessfully",
    accessToken: accessToken,
  });
};

export default login;
