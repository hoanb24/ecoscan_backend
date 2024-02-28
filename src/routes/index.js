const userRouter = require('../routes/userRoute')
const productRouter = require('../routes/productRoute')
const historyRouter = require('../routes/historyRoute')

function route(app) {
    app.use('/user',userRouter),
    app.use('/product',productRouter),
    app.use('/history',historyRouter)
}

module.exports = route