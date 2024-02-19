const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const helpers = require('../helpers/jwt')
const jwt = require('jsonwebtoken')

const userController = {

    // // requestRefreshToken
    // requestRefreshToken: async (req, res) => {
    //     // TAKE REFRESH TOKEN TỪ USER.
    //     const refreshToken = req.cookies.refreshtoken;
    //     console.log(refreshToken);
    //     if (!refreshToken) return res.status(401).json("You are not authenticated")

    //     // const userToken = User.findOne({id: req.})
    //     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    //         if (err) console.log(err);
    //         // Create new RefreshToken, refresh access_token
    //         const userDb = await User.findById(user.userId);
    //         if (!userDb) {
    //             return res.status(401).json("User not found");
    //         }
    //         const newAccessToken = helpers.generateAccessToken(userDb)
    //         const newRefreshToken = helpers.generateRefreshToken(userDb);

    //         const updateRefreshToken = await User.findOneAndUpdate({
    //             _id: user.userId
    //         }, {
    //             $set: {
    //                 refresh_token: newRefreshToken
    //             }
    //         }, {
    //             new: true
    //         });
    //         res.cookie("refreshtoken", newRefreshToken, {
    //             httpOnly: true,
    //             secure: false,
    //             path: "/",
    //             sameSite: "strict"
    //         });
    //         res.cookie('accesstoken', newAccessToken, {
    //             secure: false,
    //             path: "/",
    //             sameSite: "strict"
    //         })

    //         res.status(200).json({
    //             accessToken: newAccessToken
    //         });
    //     })
    // },

    // //REGISTER
    // registerUserSendEmail: async (req, res) => {
    //     try {
    //         const existingUsername = await User.findOne({
    //             username: req.body.username
    //         });
    //         if (existingUsername) {
    //             return res.status(400).json({
    //                 message: 'Username is already registered'
    //             });
    //         }
    //         const existingUserEmail = await User.findOne({
    //             email: req.body.email
    //         });
    //         if (existingUserEmail) {
    //             return res.status(400).json({
    //                 message: 'email is already registered'
    //             });
    //         }

    //         const token = crypto.randomBytes(20).toString('hex');
    //         userEmail = await req.body.email
    //         userName = await req.body.username
    //         await sendCreatePasswordEmail(userEmail, userName, token);
    //         return res.status(200).json({
    //             message: "successfully"
    //         })
    //     } catch (err) {
    //         return res.status(500).json(err);
    //     }
    // },

    registerUser: async (req, res) => {
        try {
          const { username, email, newPassword, confirmPassword } = req.body;
      
          const queries = [
            { key: 'username', value: username, message: 'Username is already registered' },
            { key: 'email', value: email, message: 'Email is already registered' }
          ];
      
          for (const query of queries) {
            const existingUser = await User.findOne({ [query.key]: query.value });
            if (existingUser) {
              return res.status(400).json({ message: query.message });
            }
          }
      
          if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords are not the same' });
          }
      
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
      
          const newUser = new User({
            name: username,
            password: hashedPassword,
            email: email,
          });
      
          await newUser.save();
      
          return res.status(200).json({ message: 'Successfully create a user' });
        } catch (err) {
          return res.status(500).json(err);
        }
      },



    //LOGIN 
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email
            });
            if (user == null) {
                return res.status(404).json({
                    message: "Account is not registered"
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: "Username is incorrect"
                });
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);

            if (!validPassword) {
                return res.status(404).json({
                    message: "Password is incorrect"
                });
            }
            if (user && validPassword) {
                // const accessToken = helpers.generateAccessToken(user);
                // const refreshToken = helpers.generateRefreshToken(user);

                // // Sử dụng findOneAndUpdate để cập nhật trường refresh_token
                // const updatedUser = await User.findOneAndUpdate({
                //     username: req.body.username
                // }, {
                //     refresh_token: refreshToken
                // }, {
                //     new: true
                // });

                // await res.cookie("refreshtoken", refreshToken, {
                //     httpOnly: true,
                //     secure: false,
                //     path: '/'
                // });
                // await res.cookie("accesstoken", accessToken, {
                //     secure: false,
                //     path: '/'
                // });
                // const {
                //     password,
                //     refresh_token,
                //     ...others
                // } = user._doc;
                return res.status(200).json({
                    // ...others
                    message: "Login successfully"
                });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    // //LOGOUT 
    // logoutUser: (req, res) => {
    //     try {
    //         res.clearCookie('accesstoken');
    //         res.clearCookie('refreshtoken');
    //         res.status(200).json({
    //             message: 'Logout successful'
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             message: 'Internal Server Error'
    //         });
    //     }
    // },
    // // ForgotPassword
    // forgotPassword: async (req, res) => {
    //     try {
    //         const user = await User.findOne({
    //             email: req.body.email
    //         });
    //         if (!user) {
    //             return res.status(404).json({
    //                 message: "Email is not registered"
    //             })
    //         }
    //         // Tạo token ngẫu nhiên
    //         const token = crypto.randomBytes(20).toString('hex');

    //         // Sử dụng updateOne để cập nhật dữ liệu dựa trên điều kiện email
    //         const timestamp = Date.now() + 60 * 60 * 1000;
    //         await User.updateOne({
    //             email: req.body.email
    //         }, {
    //             resetPasswordToken: token,
    //             resetPasswordExpires: timestamp

    //         });
    //         const userEmail = req.body.email;

    //         await sendResetPasswordEmail(userEmail, token);
    //         return res.status(200).json({
    //             message: 'Email sent for password reset'
    //         });
    //     } catch (err) {
    //         return res.status(500).json(err);
    //     }
    // },

    // //resetPassword
    // resetPassword: async (req, res) => {
    //     try {
    //         const email = req.body.email
    //         const token = req.body.token;
    //         const newPassword = req.body.newPassword;
    //         const confirmPassword = req.body.confirmPassword;
    //         // Tìm người dùng với token cụ thể và token chưa hết hạn
    //         const user = await User.findOne({
    //             resetPasswordToken: token,
    //             resetPasswordExpires: {
    //                 $gt: Date.now()
    //             },
    //         });

    //         if (!user) {
    //             return res.status(400).json({
    //                 message: 'Invalid or expired token, please re-enter your email to receive a new Password reset link.'
    //             });
    //         }

    //         if (newPassword != confirmPassword) {
    //             return res.status(400).json({
    //                 message: "Passwords are not the same"
    //             })
    //         }
    //         // Đặt lại mật khẩu cho người dùng
    //         const salt = await bcrypt.genSalt(10)
    //         const hashed = await bcrypt.hash(req.body.newPassword, salt);
    //         await User.updateOne({
    //             email: req.body.email
    //         }, {
    //             resetPasswordToken: null,
    //             resetPasswordExpires: null,
    //             password: hashed
    //         });
    //         return res.status(200).json({
    //             message: 'Password reset successfully'
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         return res.status(500).json({
    //             message: 'A server error has occurred'
    //         });
    //     }
    // },

}

module.exports = userController;

