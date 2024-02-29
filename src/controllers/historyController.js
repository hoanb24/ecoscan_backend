const History = require("../models/historyModel");

const HistoryController = {
  getHistory: async (req, res) => {
    try {
      const { userId } = req.body
      const historyBarcode = await History.find({
        userId: userId,
      })
      if (historyBarcode.length == 0) {
        return res.status(204).json({
          message: "No history data found for the given user.",
        })
      }
      return res.status(200).json({
        data: historyBarcode,
      })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
  },
  postHistory: async (req, res) => {
    try {
      const { barcodeNumber, userId } = req.body
      const existingHistory = await History.findOne({
        barcode_number: barcodeNumber
      })
      if (existingHistory){
        return res.status(400).json({
          message: "Barcode already exists in history"
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