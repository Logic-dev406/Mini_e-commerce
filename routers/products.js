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

//Get product by id
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res
            .status(500)
            .send(
                response('Product with the given ID was not found', {}, false)
            );
    }

    res.status(200).send(response('Fetched product successfully', product));
});

module.exports = router;
