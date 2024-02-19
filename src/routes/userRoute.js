const express = require('express')

const { registerUser, loginUser } = require('../controllers/userController')

const router = express.Router()

router.post('/sign-up',registerUser);

router.post('/sign-in',loginUser);


module.exports = router