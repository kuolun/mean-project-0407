var mongoose = require('mongoose');
// create schema
var Schema = mongoose.Schema;

var productSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    name: String,
    price: Number,
    image: String
});

// create model
module.exports = mongoose.model('Product', productSchema);