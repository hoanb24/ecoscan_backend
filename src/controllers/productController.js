const Product = require("../models/productModel")

const productController = {
    productScanning : async(req,res) => {
        try {
            const barcodeNumber = req.body.barcodeNumber
            const existProduct = await Product.findOne({
                barcode_number: barcodeNumber
            })
            const relatedProduct = await Product.find({
                subCategoryId : existProduct.subCategoryId,
                _id: { $ne: existProduct._id }
            })
            if (existProduct == null){
                return res.status(400).json({
                    message: "Product doesn't exist"
                })
            }
            if (!existProduct) {
                return res.status(400).json({
                    message: "BarcodeNumber is incorrect"
                })
            }
            return res.status(200).json({
                data : existProduct,
                relatedProduct: relatedProduct
            })
        } catch (err){
            console.error(err)
            return res.status(400).json({
                message: " Can't scan your barcode! Let's move to a brighter place. "
            })
        }
    }
}

module.exports = productController