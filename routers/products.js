const express = require('express');
const router = express.Router();
const response = require('../helper/response');
const Product = require('../models/products');

//Get all products
router.get('/', async (req, res) => {
    const productList = await Product.find();

    if (!productList) {
        res.status(500).json({ success: false });
    }

    res.send(response('Fetched product list successfully', productList));
});

module.exports = router;
