const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoute = require('./routes/user.js')
const authRoute = require('./routes/auth.js')
const productRoute = require('./routes/product.js')
const cartRoute = require('./routes/cart.js')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('db connected')
}).catch((err) => {
    console.log(err)
})

app.use(express.json())
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)

app.listen(process.env.PORT || 5000, () => {
    console.log('server running')
})
