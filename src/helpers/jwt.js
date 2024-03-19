const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const generateAccessToken = (user) => {
    return token = jwt.sign({
        userId: user._id
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3d"
    });
}

const verifyAccessToken = (accessToken) => {
    try {
        token = accessToken
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return decoded
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            const decoded = jwt.decode(token)
            return {
                exp:decoded.exp,
                userId:decoded.userId
            }
        }
    }
} 

const generateRefreshToken = (user) => {
    return refreshToken = jwt.sign({
        userId: user._id
    },process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })
}

const verifyRefreshToken = (refreshToken) => {
    try {
        token = refreshToken
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        return decoded
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return {
                expired: true
            }
        }
        console.error(err)
    }
}

module.exports = {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}