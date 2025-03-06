import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import jwtManager from "../../../managers/jwtManager.js";
const register = async (req, res) => {
  // Importing the model
  const userModel = mongoose.model("users");

  // destructuring
  const { name, email, password, confirm_password } = req.body;

  // Validations...........
  if (!name) throw "Name is required!";
  if (!email) throw " Email is required!";
  if (!password) throw "Password is required!";
  if (password.length < 6) throw "Password must be at least 6 charecter long!";
  if (!confirm_password) throw "Confirm_password is required";
  if (password !== confirm_password)
    throw "Password and confirm password must be matched";

  const hashedPassword = await bcrypt.hash(password, 12);

  // getting duplicate
  const getDuplicateEmail = await userModel.findOne({
    email: email,
  });

  if (getDuplicateEmail) throw "This email already exists";

  const createdUser = await userModel.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  // jwt manager
  const accessToken = jwtManager(createdUser)

  // success part
  res.status(201).json({
    status: "success",
    message: "User registered successfully!",
    accessToken: accessToken,
  });
};

export default register;
