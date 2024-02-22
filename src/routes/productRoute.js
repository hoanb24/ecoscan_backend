const express = require('express')

const { productScanning } = require('../controllers/productController')

const router = express.Router()

router.get('/getProductByBarcode',productScanning)

module.exports = router