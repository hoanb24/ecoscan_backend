const express = require('express')
const multer = require('multer')
const upload = multer()

const { calculateNutriScore, compareNutriScoreProducts } = require('../controllers/aiController')

const router = express.Router()

router.get('/caculateNutri/:productId',upload.none(),calculateNutriScore)
router.get('/betterProduct',upload.none(),compareNutriScoreProducts)

module.exports = router 