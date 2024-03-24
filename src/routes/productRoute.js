const express = require('express')
const multer = require('multer')
const upload = multer()

const { productScanning } = require('../controllers/productController')

const router = express.Router()

router.post('/getProductByBarcode',upload.none(),productScanning)

module.exports = router