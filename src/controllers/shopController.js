const Shop = require('../models/shopModel')

const shopController = {
    getShopById : async (req,res) => {
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
    }
}

module.exports = shopController