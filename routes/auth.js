const User = require('../models/User.js')
const router = require('express').Router()
const cryptojs = require('crypto-js')
const jwt = require('jsonwebtoken')

// Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: cryptojs.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
    })

    try {
        res.status(200).json(await newUser.save())
    } catch (err) {
        res.status(500).json(err)
    }
})

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        })

        !user && res.status(401).json("wrong credential")

        const password_descrypted = cryptojs.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(cryptojs.enc.Utf8)

        password_descrypted !== req.body.password && res.status(401).json("wrong credential")

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_KEY, { expiresIn: "3d" })

        user.password = null

        res.status(200).json({...user._doc, accessToken})
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router
