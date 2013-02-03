var mongoose = require('mongoose'),  
Schema = mongoose.Schema;  
  
var categorySchema = new Schema({
    _id: String,
    nameCategory: String
});  

//Export the schema  
module.exports = mongoose.model('Category', categorySchema);  