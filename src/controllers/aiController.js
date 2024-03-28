const Product = require("../models/productModel");
// const tf = require('@tensorflow/tfjs')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const beautify = require("js-beautify");

const aiController = {
  runAI: async (name, prompt) => {
    console.log("name", name);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      task: "nutri-score-analysis",
    });

    const result = await model.generateContent(`
        Dựa trên tên sản phẩm "${name}" và thông tin dinh dưỡng sau: ${prompt}, Nutri-Score của sản phẩm này là gì và điểm cho từng tiêu chí dinh dưỡng ra sao?
        `);

    const response = await result.response;
    const text = response.text();

    const nutriScore = text.match(/[A-E]/);

    if (nutriScore) {
      return nutriScore[0];
    } else {
      console.log("Không thể xác định Nutri Score.");
    }
  },
  calculateNutriScore: async (product, req, res) => {
    try {
      const productId = product;
      const existProduct = await Product.findById(productId);
      const nutritionalInfo = existProduct.nutritional_ingredients;
      const data = await aiController.runAI(existProduct.name, nutritionalInfo);
      return data;
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  parseNutriScoreResult: (result) => {
    const { nutriScore, nutriScoreLabel, reason, score } = result;
    return { nutriScore, nutriScoreLabel, reason, score };
  },
  compareNutriScoreProducts: async (product1name, product1nutritionalInfo,product2name,product2nutritionalInfo) => {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        task: "nutri-score-analysis-v2",
      });
        const product1Name = product1name
        const product1NutritionalInfo = product1nutritionalInfo
        const product2Name = product2name
        const product2NutritionalInfo = product2nutritionalInfo
  
      const result = await model.generateContent(`
        So sánh 2 sản phẩm là sản phẩm 1 ${product1Name} và sản phẩm 2 là ${product2Name} đưa ra sản phẩm nào tốt hơn và lý do  là gì dựa theo
        mức độ dinh dưỡng của sản phẩm 1 ${product1NutritionalInfo} và sản phẩm 2 là ${product2NutritionalInfo}
      `);
      const response = await result.response;
      const text = response.text();
      return text

    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = aiController;
