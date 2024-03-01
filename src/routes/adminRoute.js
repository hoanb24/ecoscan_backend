const express = require('express')
const multer = require('multer')
const upload = multer()

const { addCategory, addSubCategory, getAllProduct, deleteProduct } = require('../controllers/adminController')

const router = express.Router()

router.post('/addCategory',upload.none(),addCategory)
router.post('/addSubCategory',upload.none(),addSubCategory)
router.get('/getAllProduct',getAllProduct)
router.delete('/deletedProduct/:productId',deleteProduct)

module.exports = router 