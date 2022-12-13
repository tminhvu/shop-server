const Order = require('../models/Order')
const router = require('express').Router()
const { verifyTokenAdmin, verifyTokenUserAndAdmin } = require('./verifyToken')

// Create
router.post("/create", verifyTokenAdmin, async function(req, res) {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update
router.put('/update/:userId', verifyTokenAdmin, async function(req, res) {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true })
        res.status(200).json(updatedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete
router.delete('/delete/:userId', verifyTokenAdmin, async function(req, res) {
    try {
        await Order.findByIdAndDelete(req.params.userId)
        res.status(200).json('order with id ' + req.params.userId + ' deleted')
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get orders
router.get('/:userId', verifyTokenUserAndAdmin, async function(req, res) {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get all order
router.get('/', verifyTokenAdmin, async function(req, res) {
    try {
        let products = await Order.find()
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get monthly income
router.get('/income', verifyTokenAdmin, async function(req, res) {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])
        res.status(200).json(income)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
