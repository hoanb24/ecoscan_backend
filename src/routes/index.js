const userRouter = require('../routes/userRoute')
const productRouter = require('../routes/productRoute')
const historyRouter = require('../routes/historyRoute')
const adminRouter = require('../routes/adminRoute')
const shopRouter = require('../routes/shopRoute')

function route(app) {
    app.use('/user',userRouter),
    app.use('/product',productRouter),
    app.use('/history',historyRouter),
    app.use('/admin',adminRouter),
    app.use('/shop',shopRouter)
}

module.exports = route