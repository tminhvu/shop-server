const Product = require('../models/Product')
const { verifyTokenAdmin } = require('./verifyToken')
const router = require('express').Router()

// Create
router.post("/create", verifyTokenAdmin, async function(req, res) {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Update
router.put('/update/:id', verifyTokenAdmin, async function(req, res) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete
router.delete('/delete/:id', verifyTokenAdmin, async function(req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('product with id ' + req.params.id + ' deleted')
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get product
router.get('/:id', verifyTokenAdmin, async function(req, res) {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Get all products
router.get('/', verifyTokenAdmin, async function(req, res) {
    // We can use query
    // api/products?new=true
    const queryCategory = req.query.category
    const queryNew = req.query.new

    try {
        let products
        if (queryCategory && queryNew) {
            products = await Product.find({ categories: { $in: [queryCategory] } }).sort({ _id: -1 }).limit(5)
        } else if (queryNew) {
            products = await Product.find().sort({ _id: -1 }).limit(5)
        } else if (queryCategory) {
            products = await Product.find({ categories: { $in: [queryCategory] } })
        } else {
            products = await Product.find()
        }

        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
