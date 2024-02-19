const userRouter = require('../routes/userRoute')

function route(app) {
    app.use('/user',userRouter)
}

module.exports = route