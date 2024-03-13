const express = require('express')
const multer = require('multer')
const upload = multer()

const { registerUser, loginUser, loginWithGoogle, forgotPassword, resetPassword, editProfile, logout } = require('../controllers/userController')
const { checkAuthentication } = require('../middlewares/checkAuthen')

const router = express.Router()

router.post('/sign-up',upload.none(),registerUser)
router.post('/sign-in',upload.none(),loginUser)
router.post('/forgotPassword', forgotPassword)
router.put('/resetPassword', resetPassword)
router.put('/editProfile',editProfile)
router.post('/loginWithGoogle', upload.none(), loginWithGoogle)
router.post('/logout', checkAuthentication, logout)

module.exports = router