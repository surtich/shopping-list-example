var commons = require('../../../lib/commons'),
mongoose = commons.mongoose,  
Schema = mongoose.Schema;  
  
  
var listProduct = new Schema({
   order: Number,
   idProduct: String,
   purchased:  Boolean
});

var ListProduct = mongoose.model('ListProduct', listProduct);  

var listSchema = new Schema({
    lastUpdated: Date,
    user: String,
    products: [ListProduct.Schema] 
});

listSchema.virtual('idCategory').get(function () {
  return this._id;
});

//Export the schema  
module.exports = mongoose.model('List', listSchema);  