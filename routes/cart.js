const router = require('express').Router()
const Cart = require('../models/Cart')
const { verifyTokenUserAndAdmin, verifyTokenAdmin } = require('../routes/verifyToken')

// Create
router.post("/create", verifyTokenUserAndAdmin, async function(req, res) {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update
router.put('/update/:userId', verifyTokenUserAndAdmin, async function(req, res) {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true })
        res.status(200).json(updatedCart)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete
router.delete('/delete/:userId', verifyTokenUserAndAdmin, async function(req, res) {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json('cart belongs to user with id ' + req.params.userId + ' deleted')
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get cart
router.get('/:userId', verifyTokenUserAndAdmin, async function(req, res) {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
        res.status(200).json(cart)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get all carts
router.get('/', verifyTokenAdmin, async function(req, res) {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
