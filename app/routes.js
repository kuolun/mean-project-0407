var express = require('express');
var router = express.Router();

// Models
var Category = require('./models/category');
var Product = require('./models/product');

/**
 * 目錄相關的routes
 */
//addCategory
router.post('/addCategory', function (req, res) {
    var category = new Category();
    category.name = req.body.name;

    category.save(function (err, category) {
        if (err) {
            return console.log(err);

        } else {
            res.json({
                category: category
            });
        }
    });
});

//get all categories
router.get('/categories', function (req, res) {
    Category.find({}, function (err, categories) {
        if (err) {
            res.status(500).json({
                error: err.toString()
            });
        } else {
            res.json({
                categories: categories
            });
        }
    });
});

// get category with id
router.get('/category/:id', function (req, res) {
    Category.findById({
        _id: req.params.id
    }, function (err, category) {
        if (err) {
            return res.status(500)
                .json({
                    error: err.toString()
                });
        }

        if (!category) {
            return res.status(404)
                .json({
                    error: 'Not found'
                });
        }

        res.json({
            category: category
        });

    })
});


/**
 * Products related routes
 */

//get products with category id
router.get('/products/:cateid', function (req, res) {
    Product.find({
            category: req.params.cateid
        })
        .populate('category')
        .exec(function (err, products) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    products: products
                });
            }
        });
});

//get all products
router.get('/products', function (req, res) {
    Product.find({})
        .populate('category')
        // .select('-name -price')
        .exec(function (err, products) {
            if (err) {
                res.status(500).
                json({
                    error: err.toString()
                });
            } else {
                res.json({
                    products: products
                })
            }
        });
});


//get product with id
router.get('/product/:id', (req, res) => {
    Product.findById({
        _id: req.params.id
    }, (err, product) => {
        if (err)
            console.log(err);
        res.json({
            product: product
        });
    });
});







module.exports = router;