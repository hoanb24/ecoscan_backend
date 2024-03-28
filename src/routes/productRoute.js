const express = require('express')
const multer = require('multer')
const upload = multer()

const { productScanning, productRecycle,compareTwoProducts } = require('../controllers/productController')

const router = express.Router()

router.post('/getProductByBarcode',upload.none(),productScanning)
router.get('/productRecycle/:subCategoryId',upload.none(),productRecycle)
router.get('/compareProducts',upload.none(),compareTwoProducts)

module.exports = router