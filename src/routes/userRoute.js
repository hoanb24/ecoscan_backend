const express = require('express')
const multer = require('multer')
const upload = multer()

const { registerUser, loginUser, forgotPassword, resetPassword, editProfile } = require('../controllers/userController')

const router = express.Router()

router.post('/sign-up',upload.none(),registerUser)
router.post('/sign-in',upload.none(),loginUser)
router.post('/forgotPassword', forgotPassword)
router.put('/resetPassword', resetPassword)
router.put('/editProfile',editProfile)

module.exports = router