const express = require('express')
const multer = require('multer')
const upload = multer()

const { getShopById,getDataProductByShopId } = require('../controllers/shopController')

const router = express.Router()

router.get('/getShopById/:shopId',upload.none(),getShopById)
router.get('/getDataProductByShopId/:shopId',upload.none(),getDataProductByShopId)

module.exports = router