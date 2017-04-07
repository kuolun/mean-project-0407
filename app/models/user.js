var mongoose = require('mongoose');
//#1 create schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
    //唯一
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    //基本資料(from FB)
    profile: {
        username: {
            type: String,
            default: ''
        },
        picture: {
            type: String,
            default: ''
        }
    },
    //傳輸資料
    data: {
        totalValue: {
            type: Number,
            default: 0,
            min: 0
        },
        //購物車array 每個item包含產品 數量 小計
        //reference到product id
        cart: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            },
            subtotal: {
                type: Number,
                default: 0,
                min: 0
            }
        }]
    }

});

//#2 create model
module.exports = mongoose.model('User', userSchema);