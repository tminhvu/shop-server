const { verifyTokenUserAndAdmin, verifyTokenAdmin } = require('./verifyToken')
const CryptoJS = require('crypto-js')
const User = require('../models/User')

const router = require('express').Router()

// Update
router.put('/update/:id', verifyTokenUserAndAdmin, async (req, res) => {
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

// Delete
router.delete("/delete/:id", verifyTokenUserAndAdmin, async function(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user ' + req.params.id + ' deleted')
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get
router.get("/get/:id", verifyTokenAdmin, async function(req, res) {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get all users
router.get("/", verifyTokenAdmin, async function(req, res) {
    // We can use query
    // api/users?new=true
    const query = req.query.new

    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get users stat
router.get('/stats', verifyTokenAdmin, async function(_, res) {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: lastYear
                    }
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
