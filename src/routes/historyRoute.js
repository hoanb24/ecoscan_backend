const express = require('express')
const multer = require('multer')
const upload = multer()

const { getHistory, postHistory, deleteHistory } = require('../controllers/historyController')

const router = express.Router()

router.get('/getHistorybyId/:userId',getHistory)
router.post('/postHistory',upload.none(),postHistory)
router.delete('/deletedHistory/:historyId',deleteHistory)

module.exports = router