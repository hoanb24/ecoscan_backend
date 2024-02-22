const express = require('express')
const multer = require('multer')
const upload = multer()

const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/userController')

const router = express.Router()

router.post('/sign-up',upload.none(),registerUser)
router.post('/sign-in',upload.none(),loginUser)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', resetPassword)

module.exports = router