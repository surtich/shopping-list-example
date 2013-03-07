var commons = require('../../../lib/commons'),
mongoose = commons.mongoose,  
Schema = mongoose.Schema; 
  
var productSchema = new Schema({
    _id: String,
    nameProduct: String,
    category_id: String
});  
  
//Export the schema  
module.exports = mongoose.model('Product', productSchema);  