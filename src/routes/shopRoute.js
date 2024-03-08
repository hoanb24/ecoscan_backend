const express = require('express')
const multer = require('multer')
const upload = multer()

const { getShopById } = require('../controllers/shopController')

const router = express.Router()

router.get('/getShopById',upload.none(),getShopById)

module.exports = router