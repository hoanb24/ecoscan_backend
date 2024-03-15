const Product = require("../models/productModel");
const Shop = require("../models/shopModel");
const Shop_Product = require("../models/shop_productsModel");
const ProductRecycle = require("../models/productRecycling");
const SubCategory = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");

const productController = {
  productScanning: async (req, res) => {
    try {
      const barcodeNumber = req.body.barcodeNumber;
      const existProduct = await Product.findOne({
        barcode_number: barcodeNumber,
      });

      const shopProducts = await Shop_Product.find({
        productId: existProduct._id,
      });

      const mergedProductData = Object.assign({}, existProduct.toObject(), {
        shopsData: [],
      });

      for (const shopProduct of shopProducts) {
        const shopId = shopProduct.shopId;
        const shopData = await Shop.findById(shopId);
        const price = (shopProduct.price).toFixed(3);
        mergedProductData.shopsData.push({ ...shopData.toObject(), price });
      }

      const relatedProducts = await Product.find({
        subCategoryId: existProduct.subCategoryId,
        _id: { $ne: existProduct._id },
      });

      const relatedShopIds = await Shop_Product.find({
        productId: { $in: relatedProducts.map((product) => product._id) },
      }).distinct("shopId");

      const relatedShopsData = await Shop.find({
        _id: { $in: relatedShopIds },
      });

      const relatedProductsData = await Promise.all(
        relatedProducts.map(async (relatedProduct) => {
          const shopProducts = await Shop_Product.find({
            productId: relatedProduct._id,
          });
          const shopIds = shopProducts.map((shopProduct) => shopProduct.shopId);
      
          const shopsData = await Shop.find({ _id: { $in: shopIds } });
      
          const productPrices = await Promise.all(
            shopProducts.map(async (shopProduct) => {
              const shopPrice = (shopProduct.price).toFixed(3);
              return { shopId: shopProduct.shopId, price: shopPrice };
            })
          );
      
          const shopsDataObject = shopsData.map((shopData, index) => {
            return Object.assign({}, shopData.toObject(), {
              price: productPrices[index].price,
            });
          });
          
          shopsDataObject.sort((a, b) => a.price - b.price);
      
          return Object.assign({}, relatedProduct.toObject(), {
            shopsData: shopsDataObject,
          });
        })
      );
      

      const resolvedRelatedProductsData = await Promise.all(
        relatedProductsData
      );
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
        relatedProduct: resolvedRelatedProductsData,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Can't scan your barcode! Let's move to a brighter place.",
      });
    }
  },
  productRecycle: async (req, res) => {
    const { subCategoryId } = req.params;
    const subCategoryData = await SubCategory.findById(subCategoryId);
    const categoryData = await Category.findById(subCategoryData._id);
    const productRecycle = await ProductRecycle.findById(categoryData._id);
    if (!productRecycle) {
      return res.status(400).json({
        message: "Product doesn't have Recycling",
      });
    }
    return res.status(200).json({
      data: productRecycle,
    });
  },
};

module.exports = productController;
