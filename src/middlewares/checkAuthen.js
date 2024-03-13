const User = require('../models/userModel')
const cookie = require('cookie')
const { verifyAccessToken } = require('../helpers/jwt')

const checkAuthentication = async (req,res,next) => {
    try {
        const token = req.headers.cookie
        const cookies = cookie.parse(token || '')
        const accessToken = cookies.accesstoken
        const decoded = verifyAccessToken(accessToken)
        if (!token) {
            return res.status(401).json({
                message: "Your token not found"
            })
        }

        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(401).json({
                message : "User not found"
            })
        }
        req.userData = user
        next()
    } catch (err){
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


module.exports = {
    checkAuthentication
}