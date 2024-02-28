const History = require('../models/historyModel')

const HistoryController = {
    getHistory : async (req,res) => {
        const userId = req.body.userId
        const historyBarcode= await History.find({
            userId: userId
        })
        if(historyBarcode == null) {
            return res.status(204).json({
                message: "Data history null"
            })
        }
        return res.status(200).json({
            data: historyBarcode
        })
    },
    postHistory : async (req,res) => {
        try {
            const barcodeNumber = req.body.barcodeNumber
        const userId = req.body.userId
        if(barcodeNumber && userId){
            return res.status().json({
                message:"None"
            })
        }
        const newHistory = new History({
            userId : userId,
            barcode_number: barcodeNumber
        })
        await newHistory.save();
        return res.status(200).json({
            message:"History created successfully"
        })
        } catch (err) {
            console.error(err)
            return res.status(500).json(err)
        }
    }
}

module.exports = HistoryController