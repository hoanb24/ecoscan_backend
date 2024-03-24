const Category = require('../models/categoryModel')
const SubCategory = require('../models/subCategoryModel')
const Product = require('../models/productModel')

const adminController = {
    addCategory : async (req,res) => {
        try {
            const { categoryName } = req.body
            if(categoryName == null) {
                return res.status(400).json({
                    message: "Please input data"
                })
            }
            const newCategory = await Category({
                categoryName: categoryName
            })
            await newCategory.save()
            return res.status(201).json({
                message:"Create a new category successfully"
            })
        } catch (err) {
            console.error(err)
            return res.status(500).json({
                message : "Internal server error"
            })
        }
    },
    addSubCategory : async (req,res) => {
        try {
            const { categoryId } = req.body
            const { subCategoryName } = req.body
            if(subCategoryName == null) {
                return res.status(400).json({
                    message: "Please input data"
                })
            }
            const category = await Category.findOne({
                _id : categoryId 
            })
            const newSubCategory = new SubCategory({
                categoryId: category._id,
                name: subCategoryName
            })
            await newSubCategory.save()
            return res.status(201).json({
                message: "Create a new SubCategory successfully"
            })

        } catch (err) {
            console.error(err)
            return res.status(500).json({
                message:"Internal Server Error"
            })
        }
    },
    getAllProduct : async (req,res) => {
        try {
            const dataProduct = await Product.find().sort({ subCategoryId: 1}).populate('subCategoryId','name')
            if(dataProduct == null){
                return res.status(204).json({
                    message: "Data not found"
                })
            }
            return res.status(200).json({
                data: dataProduct
            })
        } catch (err) {
            console.error(err)
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    },
    deleteProduct : async (req,res) => {
        try{
            const { productId } = req.params
            if(productId == null) {
                return res.status(204).json({
                    message: "Data not found"
                })
            }
            const deletedProduct = await Product.findByIdAndDelete(productId)
            return res.status(200).json({
                message : "Product deleted successfully"
            })
        } catch (err){
            console.error(err)
            return res.status(500).json({
                message:"Internal Server Error"
            })
        }
    },
    editProduct: async (req,res) => {
        try {
            const { productId, productName, ingredient, manufacturer, productImage, barcodeNumber } = req.body;
            const updateFields = {};
            if (productName) updateFields.productName = productName;
            if (ingredient) updateFields.ingredient = ingredient;
            if (manufacturer) updateFields.manufacturer = manufacturer;
            if (productImage) updateFields.productImage = productImage;
            if (barcodeNumber) updateFields.barcodeNumber = barcodeNumber;
            const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });
            if (!updatedProduct) {
                return res.status(404).json({ error: "Product does not exist" });
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = adminController