const Product = require('../models/productModel')
const Shop = require('../models/shopModel')
const Shop_Product = require('../models/shop_productsModel')
const ProductRecycle = require('../models/productRecycling')
const SubCategory = require('../models/subCategoryModel')
const Category = require('../models/categoryModel')

const productController = {
  productScanning: async (req, res) => {
    try {
      const barcodeNumber = req.body.barcodeNumber;
      const existProduct = await Product.findOne({
        barcode_number: barcodeNumber,
      });
      const shopProduct = await Shop_Product.findOne({
        productId: existProduct._id,
      });
      const shopId = shopProduct.shopId
      const shopData = await Shop.findById(shopId);
      const mergedProductData = Object.assign({}, existProduct.toObject(), {
        shopData: shopData.toObject(),
      });
      const relatedProducts = await Product.find({
        subCategoryId: existProduct.subCategoryId,
        _id: { $ne: existProduct._id },
      });
      for (let i = 0; i < relatedProducts.length; i++) {
        const relatedProduct = relatedProducts[i]
        const relatedShopProduct = await Shop_Product.findOne({
            productId: relatedProduct._id,
        });
        const relatedShopId = relatedShopProduct.shopId
        const relatedShopData = await Shop.findById(relatedShopId);
        const mergedRelatedData = Object.assign({}, relatedProduct.toObject(), {
            shopData: relatedShopData.toObject(),
        })
        relatedProducts[i] = mergedRelatedData
    }
      if (existProduct == null) {
        return res.status(400).json({
          message: "Product doesn't exist",
        });
      }
      if (!existProduct) {
        return res.status(400).json({
          message: "BarcodeNumber is incorrect",
        });
      }
      return res.status(200).json({
        data: mergedProductData,
        relatedProduct: relatedProducts,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Can't scan your barcode! Let's move to a brighter place.",
      });
    }
  },
  productRecycle : async (req, res) => {
    const { subCategoryId } = req.params
    const subCategoryData = await SubCategory.findById(subCategoryId)
    const categoryData = await Category.findById(subCategoryData._id)
    const productRecycle = await ProductRecycle.findById(categoryData._id)
    if(!productRecycle) {
      return res.status(400).json({
        message: "Product doesn't have Recycling"
      })
    }
    return res.status(200).json({
      data: productRecycle
    })
  }
};

module.exports = productController
