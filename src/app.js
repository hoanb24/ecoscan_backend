const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const helmet = require('helmet')
const connect = require('./config/db/db')
const route = require('./routes/index')
dotenv.configDotenv()
const app = express()

connect()

app.use(
  cors({
    origin: `${process.env.CORS_ORIGIN}`,
    credentials: true,
  })
)
app.use(morgan())
app.use(express.json())
app.use(helmet())
app.use(express.urlencoded({extended:true, limit:'50mb'}))
route(app)
app.listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.PORT}`);
})

