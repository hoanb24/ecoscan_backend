const express = require('express')
const multer = require('multer')
const upload = multer()

const { getHistory, postHistory, deleteHistory } = require('../controllers/historyController')

const router = express.Router()

router.post('/getHistorybyId',upload.none(),getHistory)
router.post('/postHistory',upload.none(),postHistory)
router.post('/deletedHistory/:historyId',deleteHistory)

module.exports = router