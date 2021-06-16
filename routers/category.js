const express = require('express');
const response = require('../helper/response');
const router = express.Router();
const Category = require('../models/category');

//Get all categories
router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }

    res.send(response('Fetched category list successfully', categoryList));
});

//Get category by id
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return res
            .status(500)
            .send(
                response('Category with the given ID was not found', {}, false)
            );
    }

    res.status(200).send(response('Fetched category successfully', category));
});

//Create category
router.post('/', async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
        });
        category = await category.save();

        if (!category)
            return res
                .status(404)
                .send(response('The category can not be created', {}, false));

        res.send(response('Category created successfully', category));
    } catch (err) {
        console.log(err);
    }
});

//Update category by id
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (!category)
        return res
            .status(404)
            .send(response('The category can not be updated', {}, false));

    res.send(response('Category was successfully updated', category));
});

//Delete category by id
router.delete('/:id', async (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then((category) => {
            if (category) {
                return res
                    .status(200)
                    .send(
                        response('The category was successfully deleted', {})
                    );
            } else {
                return res
                    .status(404)
                    .send(response('Category not found', {}, false));
            }
        })
        .catch((error) => {
            return res.status(400).send(response(error.message, {}, false));
        });
});

module.exports = router;
