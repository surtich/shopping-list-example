var mongoose = require('mongoose'),  
Schema = mongoose.Schema;  
  
  
var listProduct = new Schema({
   _id: String,
   order: Number,
   idProduct: String,
   purchased:  Boolean
});

var ListProduct = mongoose.model('ListProduct', listProduct);  

var listSchema = new Schema({
    _id: String,
    lastUpdated: Date,
    user: String,
    products: [ListProduct.Schema] 
});  

//Export the schema  
module.exports = mongoose.model('List', listSchema);  