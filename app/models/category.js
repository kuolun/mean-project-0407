var mongoose = require('mongoose');

//create schema
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true
    }
});


//create model
module.exports = mongoose.model('Category', CategorySchema);