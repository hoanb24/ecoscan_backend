const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const helpers = require("../helpers/jwt");
const jwt = require("jsonwebtoken");

const userController = {
  registerUser: async (req, res) => {
    try {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
      const { username, email, newPassword, confirmPassword } = req.body;

      const isGmailAddressValid = gmailRegex.test(email);
      if (!isGmailAddressValid) {
        return res.status(400).json({ message: "Invalid Gmail address" });
      }

      const userExists = await User.findOne({ username });
      if (userExists) {
        return res
          .status(400)
          .json({ message: "Username is already registered" });
      }

      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already registered" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const isPasswordValid =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,16}$/.test(
          newPassword
        );
      if (!isPasswordValid) {
        return res.status(400).json({
          message:
            "Password must be 6-16 characters long and contain at least one uppercase letter, one digit, and one special character.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const newUser = new User({
        name: username,
        password: hashedPassword,
        email: email,
      });
      await newUser.save();

      return res.status(200).json({ message: "User created successfully" });
    } catch (err) {
      return res.status(500).json({ message: "An error occurred" });
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      console.log("data", user);
      if (user == null) {
        return res.status(404).json({
          message: "Account is not registered",
        });
      }
      if (!user) {
        return res.status(404).json({
          message: "Username is incorrect",
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json({
          message: "Password is incorrect",
        });
      }
      if (user && validPassword) {
        const accessToken = helpers.generateAccessToken(user);
        await res.cookie("accesstoken", accessToken, {
          secure: false,
          path: "/",
        });
        return res.status(200).json({
          message: "Login successfully",
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        return res.status(404).json({
          message: "Email not registered",
        });
      }
    } catch (err) {}
  },
  sendEmailForgotPassword: async (req, res) => {},
};

module.exports = userController;
