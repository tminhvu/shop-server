const { verifyTokenAndAuthorization } = require('./verifyToken')
const CryptoJS = require('crypto-js')
const User = require('../models/User')

const router = require('express').Router()

// Update
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
    }

    try {
        const updatedUSer = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedUSer)
    } catch (err) {
        res.status(500).json(err)
    }

})

module.exports = router
