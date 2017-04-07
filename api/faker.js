var router = require('express').Router();
var faker = require('faker');

//models
var Category = require('../app/models/category');
var Product = require('../app/models/product');

// fakerapi/xxxxx
router.get('/:catename', function (req, res) {
    Category.findOne({
        name: req.params.catename
    }, function (err, category) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i < 10; i++) {
                var product = new Product();
                product.category = category._id;
                product.name = faker.commerce.productName();
                product.price = faker.commerce.price();
                product.image = faker.image.image();
                product.save();
            }
            res.json({
                message: 'fake data created!'
            });
        }
    });
});

module.exports = router;