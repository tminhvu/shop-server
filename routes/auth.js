const User = require('../models/User.js')
const router = require('express').Router()
const cryptojs = require('crypto-js')
const jwt = require('jsonwebtoken')

// Register
// Post function take in an api endpoint, then callback a function
router.post("/register", async (req, res) => {
    // Create a user using the User Schema which is a mongoose model
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,

        // Encrypt password before saving to the database
        password: cryptojs.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
    })

    try {
        // Try to save new user to the database
        res.status(200).json(await newUser.save())
    } catch (err) {
        res.status(500).json(err)
    }
})

// Login
router.post("/login", async (req, res) => {
    try {

        // Get the user with username sent from request
        const user = await User.findOne({
            username: req.body.username
        })

        // If user does not exist, set respond to this and stop
        !user && res.status(401).json("wrong credential")

        // If user exist then decrypt the password from user
        const password_descrypted = cryptojs.AES.decrypt(user.password, process.env.PASSWORD_SECRET).toString(cryptojs.enc.Utf8)

        // If the password from user and password from request is not the same, sett respond to this and stop
        password_descrypted !== req.body.password && res.status(401).json("wrong credential")

        // Create json web token from id and isAdmin, so that user with matching id can edit there user and admin can do admin things
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_KEY, { expiresIn: "3d" })

        // remove password from user
        user.password = null

        // respond user with newly created web token
        res.status(200).json({...user._doc, accessToken})
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
