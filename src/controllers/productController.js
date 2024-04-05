const Product = require("../models/productModel");
const Shop = require("../models/shopModel");
const Shop_Product = require("../models/shop_productsModel");
const ProductRecycle = require("../models/productRecycling");
const SubCategory = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");
const distance = require('fast-haversine')

const {
  calculateNutriScore,
  compareNutriScoreProducts,
} = require("./aiController");

const productController = {
  productScanning: async (req, res) => {
    try {
      const barcodeNumber = req.body.barcodeNumber;
      const existProduct = await Product.findOne({
        barcode_number: barcodeNumber,
      });

      existProduct.nutriScore = await calculateNutriScore(existProduct._id);

      const shopProducts = await Shop_Product.find({
        productId: existProduct._id,
      });

      const mergedProductData = Object.assign({}, existProduct.toObject(), {
        nutriScore: existProduct.nutriScore,
        shopsData: [],
      });

      for (const shopProduct of shopProducts) {
        const shopId = shopProduct.shopId;
        const shopData = await Shop.findById(shopId);
        const price = shopProduct.price.toFixed(3);
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
              const shopPrice = shopProduct.price.toFixed(3);
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
    try {
      const { subCategoryId } = req.params;
      const subCategoryData = await SubCategory.findById(subCategoryId);
      const categoryData = await Category.findOne(subCategoryData.categoryId);
      const productRecycle = await ProductRecycle.find({
        categoryId: categoryData._id
      });
      if (!productRecycle) {
        return res.status(400).json({
          message: "Product doesn't have Recycling",
        });
      }
      return res.status(200).json({
        data: productRecycle,
      });
    } catch (err) {
      console.error(err); 
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  getShopDataWithDistance : async (userLocation,shopProducts, mergedProductData) => {
    for (const shopProduct of shopProducts) {
        const shopId = shopProduct.shopId;
        const shopData = await Shop.findById(shopId);
        const price = (shopProduct.price).toFixed(3);

        const shopLocation = { lat: parseFloat(shopData.latitude), lon: parseFloat(shopData.longitude) }
        const distanceBetweenUserandProduct = Math.round(distance(userLocation, shopLocation)/ 100) / 10

        mergedProductData.shopsData.push({ 
            ...shopData.toObject(), 
            price,
            distanceBetweenUserandProduct 
        })
    }
  },
  compareTwoProducts: async (req, res) => {
    try {
      const userLatitude = parseFloat(req.body.userLatitude);
      const userLongitude = parseFloat(req.body.userLongitude);
      const userLocation = { lat: userLatitude, lon: userLongitude };
      const { product1, product2 } = req.body;
  
      const existProduct1 = await Product.findOne({ barcode_number: product1.barcode_number });
      existProduct1.nutriScore = await calculateNutriScore(existProduct1._id);
      const shopProducts1 = await Shop_Product.find({
        productId: existProduct1._id,
      });
      const mergedProductData1 = Object.assign({}, existProduct1.toObject(), {
        nutriScore: existProduct1.nutriScore,
        shopsData: [],
      });
  
      const existProduct2 = await Product.findOne({ barcode_number: product2.barcode_number });
      existProduct2.nutriScore = await calculateNutriScore(existProduct2._id);
      const shopProducts2 = await Shop_Product.find({
        productId: existProduct2._id,
      });
      const mergedProductData2 = Object.assign({}, existProduct2.toObject(), {
        nutriScore: existProduct2.nutriScore,
        shopsData: [],
      });

      const betterProduct = await compareNutriScoreProducts(product1.name,product1.nutritional_ingredients,product2.name,product2.nutritional_ingredients)
  
      await productController.getShopDataWithDistance(userLocation,shopProducts1, mergedProductData1)
  
      await productController.getShopDataWithDistance(userLocation,shopProducts2, mergedProductData2);
      
      console.log('====================================');
      console.log(mergedProductData1);
      console.log('====================================');

      console.log('====================================');
      console.log(mergedProductData2);
      console.log('====================================');

      return res.status(200).json({
          data: {
              product1: mergedProductData1,
              product2: mergedProductData2,
              betterProduct
          }
      });
    } catch(err) {
      console.error(err)
      return res.status(500).json({
        message:"Internal Server Error"
      })
    }
  },
};

module.exports = productController;
