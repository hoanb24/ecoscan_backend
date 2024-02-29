const express = require('express')
const multer = require('multer')
const upload = multer()

const { addCategory, addSubCategory } = require('../controllers/adminController')

const router = express.Router()

router.post('/addCategory',upload.none(),addCategory)
router.post('/addSubCategory',upload.none(),addSubCategory)

module.exports = router