const History = require('../models/historyModel')
const Product = require('../models/productModel')

const HistoryController = {
  getHistory: async (req, res) => {
    try {
      const { userId } = req.params
      const historyBarcode = await History.find({
        userId: userId,
      })
      const products = await Promise.all(historyBarcode.map(async (history) => {
        const product = await Product.findOne({ barcode_number: history.barcode_number})
        const data = {
          historyId: history._id,
          userId: history.userId,
          barcode_number: history.barcode_number,
          productData: product,
          create_at: history.create_at
        }
        return data
      }))
      if (historyBarcode.length == 0) {
        return res.status(204).json({
          message: "No history data found for the given user.",
        })
      }
      return res.status(200).json({
        data: products,
      })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
  },
  postHistory: async (req, res) => {
    try {
      const { barcodeNumber, userId } = req.body
      if (barcodeNumber == null || userId == null){
        return res.status(400).json({
          message: "Barcode and userId mustn't be null"
        })
      }
      const newHistory = new History({
        userId: userId,
        barcode_number: barcodeNumber,
      })
      await newHistory.save()
      return res.status(201).json({
        message: "History created successfully",
      });
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: "Internal server error" })
    }
  },
  deleteHistory : async (req,res) => {
    try {
      const historyId = req.params.historyId
      if(!historyId) {
        return res.status(400).json({
          message: "History ID is required"
        })
      }
      const deletedHistory = await History.findByIdAndDelete(historyId)
      if(!deletedHistory) {
        return res.status(400).json({
          message: "History not found."
        })
      }
      return res.status(200).json({
        message: "History deleted successfully"
      })

    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: "Internal server error" })
    }
  }
};

module.exports = HistoryController