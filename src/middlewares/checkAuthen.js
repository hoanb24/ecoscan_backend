const User = require('../models/userModel')
const cookie = require('cookie')
const verifyAccessToken = require('../helpers/jwt')

const checkAuthentication = async (req,res,next) => {
    try {
        const token = req.headers.cookie
        const cookies = cookie.parse(token || '')
        const accessToken = cookies.accessToken
        const decoded = verifyAccessToken(accessToken)
        if (!token) {
            return res.status(401).send("Your token not fond")
        }

        const user = await User.findById(decoded.userId)
        if (!user) {
            return res.status(401).send('User not found')
        }
        req.userData = user
        console.log("Token Valid");
        next()
    } catch (err){
        console.log(err)
        return res.status(500).send("Internal Server Error")
    }
}


module.exports = {
    checkAuthentication
}