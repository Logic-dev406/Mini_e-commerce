const express = require('express');
const router = express.Router();
const response = require('../helper/response');
const Product = require('../models/products');
const Category = require('../models/categories');
const multer = require('multer');

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

//Create product
router.post('/', uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);

    if (!category) {
        return res.status(400).send(response('Invalid Category', {}, false));
    }

    const file = req.file;
    if (!file) {
        return res
            .status(400)
            .send(
                response('an image is required to create a product', {}, false)
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
});

module.exports = router;
