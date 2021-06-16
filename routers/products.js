const express = require('express');
const router = express.Router();
const response = require('../helper/response');
const Product = require('../models/products');
const Category = require('../models/categories');
const multer = require('multer');
const mongoose = require('mongoose');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

//Get all products
router.get('/', async (req, res) => {
    const productList = await Product.find();

    if (!productList) {
        res.status(500).json({ success: false });
    }

    res.send(response('Fetched product list successfully', productList));
});

//Get product by id
router.get('/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
        return res
            .status(500)
            .send(
                response('Product with the given slug was not found', {}, false)
            );
    }

    res.status(200).send(response('Fetched product successfully', product));
});

//Create product
router.post('/', uploadOptions.single('image'), async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);

        if (!category) {
            return res
                .status(400)
                .send(response('Invalid Category', {}, false));
        }

        const file = req.file;
        if (!file) {
            return res
                .status(400)
                .send(
                    response(
                        'an image is required to create a product',
                        {},
                        false
                    )
                );
        }

        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            image: `${basePath}${fileName}`,
            price: req.body.price,
            category: req.body.category,
            dateCreated: req.body.dateCreated,
        });

        product = await product.save();

        if (!product)
            return res
                .status(500)
                .send(response('The product can not be created', {}, false));

        return res.send(response('Product was created successfully ', product));
    } catch (err) {
        console.log(err);
    }
});

//Updated product by id
router.patch('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send(response('Invalid Product id', {}, false));
        }
        const category = await Category.findOne({ _id: req.body.category });
        if (!category) {
            return res
                .status(400)
                .send(response('Invalid Category', {}, false));
        }

        const update = req.body;
        const id = req.params.id;

        let product = await Product.findByIdAndUpdate(id, update, {
            new: true,
        });

        if (!product)
            return res
                .status(500)
                .send(response('The product can not be updated', {}, false));

        res.send(response('Product updated successfully', product));
    } catch (err) {
        console.log(err);
    }
});

//Update product image
router.put('/image/:id', uploadOptions.single('image'), async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send(response('Invalid Product id', {}, false));
        }

        console.log(req.file);
        const file = req.file;
        if (!file) {
            return res
                .status(400)
                .send(response('please input an image ', {}, false));
        }

        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        const update = { image: `${basePath}${fileName}` };
        const id = req.params.id;

        let productImage = await Product.findByIdAndUpdate(id, update, {
            new: true,
        });

        if (!productImage)
            return res
                .status(500)
                .send(
                    response('The product image can not be updated', {}, false)
                );

        res.send(response('Product image updated successfully', productImage));
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
