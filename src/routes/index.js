const userRouter = require('../routes/userRoute')
const productRouter = require('../routes/productRoute')
const historyRouter = require('../routes/historyRoute')
const adminRouter = require('../routes/adminRoute')

function route(app) {
    app.use('/user',userRouter),
    app.use('/product',productRouter),
    app.use('/history',historyRouter),
    app.use('/admin',adminRouter)
}

module.exports = route