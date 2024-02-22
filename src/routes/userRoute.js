const express = require('express')

const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/userController')

const router = express.Router()

router.post('/sign-up',registerUser)
router.post('/sign-in',loginUser)
router.post("/forgotPassword", forgotPassword)
router.post("/resetPassword", resetPassword)

module.exports = router