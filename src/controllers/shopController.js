const Shop = require('../models/shopModel')
const Shop_Product = require('../models/shop_productsModel')
const Product = require('../models/productModel')

const shopController = {
    getShopById : async (req,res) => {
        try {
            const { shopId } = req.params 
            const existShop = Shop.findById(shopId)
            if(!existShop) {
                return res.status(400).json({
                    message: "Shop doesn't exist"
                })
            }
            return res.status(200).json({
                data: existShop
            })
        } catch (err) {
            console.error(err)
            return res.status(500).json({
                message : "Internal Sever Error"
            })
        }
    },
    getDataProductByShopId: async (req, res) => {
        try {
            const { shopId } = req.params;
            const shopProducts = await Shop_Product.find({ shopId: shopId });
            if (shopProducts.length === 0) {
                return res.status(400).json({ data: "Data Null" });
            }
            const productsInfo = shopProducts.map(product => {
                return {
                    productId: product.productId,
                    price: product.price
                }
            })
            const productIds = shopProducts.map(product => product.productId)
            const productsDetails = await Product.find({ _id: { $in: productIds } })
            const productsWithPrice = productsDetails.map((productDetail, index) => {
                const matchingProductInfo = productsInfo.find(info => info.productId.toString() === productDetail._id.toString())
                console.log("matchingProductInfo",matchingProductInfo);
                if (matchingProductInfo) {
                    return {
                        ...productDetail.toObject(),
                        price: matchingProductInfo.price
                    }
                } else {
                    return {
                        ...productDetail.toObject(),
                        price: null 
                    }
                }
            })            
            return res.status(200).json({ data: productsWithPrice });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
}

module.exports = shopController