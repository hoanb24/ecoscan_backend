const userRouter = require('../routes/userRoute')
const productRouter = require('../routes/productRoute')

function route(app) {
    app.use('/user',userRouter),
    app.use('/product',productRouter)
}

module.exports = route