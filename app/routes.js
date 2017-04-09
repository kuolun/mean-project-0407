var express = require('express');
var router = express.Router();

// Models
var Category = require('./models/category');
var Product = require('./models/product');
//取得user model
var User = require('./models/user');

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



/**
 * check user in DB
 */
router.get('/checkDBUser/:email', function (req, res, next) {
  User.findOne({
    email: req.params.email
  }, function (err, user) {
    if (err) return next(err);
    res.json({
      user: user
    });
  });
});

/**
 * add new user from Auth0
 */
router.post('/newUser', function (req, res, next) {
  console.log(typeof req.body);
  var profile = req.body;
  var newUser = new User();
  //profile是Auth0回傳的資訊
  newUser.clientID = profile.clientID;
  newUser.email = profile.email;
  newUser.profile.username = profile.name;
  newUser.profile.picture = profile.picture;
  //把新user存到DB
  newUser.save(function (err, user) {
    if (err) {
      console.log('save error');
      throw err;
    }
    console.log('new user created!');
    return res.json({
      savedUser: user
    });
  });
});

// 載入User資料
router.get('/user/:email', function (req, res, next) {
  User.findOne({
      email: req.params.email
    })
    //因為product的type為ObjectId所以要populate
    .populate('data.cart.product')
    .exec(function (err, user) {
      console.log('user in DB:', user);
      if (err) return next(err);
      res.json({
        loadedUser: user
      });
    });
});


// 更新購物車內容
router.put('/updateCart', function (req, res) {
  User.findOne({
    email: req.body.email
  }, function (err, foundUser) {
    foundUser.data.cart = req.body.newCart;
    foundUser.data.totalValue = req.body.newTotal;
    foundUser.save(function (err, savedUser) {
      if (err) return next(err);
      // 回傳save後的user
      return res.json({
        savedUser: savedUser
      });
    });
  });
});

// 移除購物車item
router.put('/remove', function (req, res, next) {
  User.findOne({
    email: req.body.email
  }, function (err, foundUser) {
    console.log('foundUser:', foundUser);
    console.log('body.updatedItem:', req.body.updatedItem);
    // 用傳入的updatedItem.cart把原本的cart換掉
    // 總金額也更新
    foundUser.data.cart = req.body.updatedItem.cart;
    foundUser.data.totalValue = req.body.updatedItem.totalValue;
    foundUser.save(function (err, savedUser) {
      console.log('save');
      if (err) return next(err);
      res.json(savedUser);
    });
  });
});






module.exports = router;
