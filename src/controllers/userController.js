const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const helpers = require("../helpers/jwt")
const jwt = require("jsonwebtoken")
const validator = require('validator')
const  { isEmail } = require('validator')
const dotenv = require('dotenv')
dotenv.configDotenv();

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

      const isPasswordValid =/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,16}$/.test(newPassword);
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
      const token = crypto.randomBytes(20).toString('hex')
      const timestamp = Date.now() * 60 * 60 * 100
      await User.updateOne({
        email: req.body.email
      }, {
        resetPasswordToken: token,
        resetPasswordExpire: timestamp
      })
      const userEmail = req.body.email
      await sendResetPasswordEmail(userEmail,token)
      return res.status(200).json({
        message:"OTP sent"
      })
    } catch (err) {
        return res.status(500).json(err)
    }
  },
  resetPassword : async (req,res) => {
    try {
      const email = req.body.email
      const token = req.body.token
      const newPassword = req.body.newPassword
      const confirmPassword = req.body.confirmPassword
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: {
          $gt: Date.now()
        }
      })
      if(!user) {
        return res.status(400).json({
          message:"Invalid or expired token, please re-enter your email to receive a new Password reset link."
        })
      }
      if(newPassword !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords are not the same"
        })
      }
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(newPassword,salt)
      await User.updateOne({
        email:email
      }, {
        resetPasswordToken:null,
        resetPasswordExpire:null,
        password:hashed
      })
      return res.status(200).json({
        message:"Password reset successfully"
      })
    } catch (err){
        console.error(err)
        return res.status(400).json({
          message:"A server error has occurred"
        })
    }
  }
};

module.exports = userController;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.EMAIL_PASSWORD}`
  }
});
const sendResetPasswordEmail = async (recipientEmail, token) => {
  try {
      const mailOptions = {
          from: `${process.env.EMAIL}`,
          to: recipientEmail,
          subject: 'Reset Password',
          text: `Bạn đã yêu cầu đặt lại mật khẩu tài khoản của bạn.\n
              Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu:\n
              http://localhost:3000/resetpw/email=${recipientEmail}/tokenResetPW=${token}\n
              Liên kết này sẽ hết hạn sau 1 giờ.\n
              Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`,
      };
      const info = await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error(error);
      throw error;
  }
}


