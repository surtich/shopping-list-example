var commons = require('../../../lib/commons'),
mongoose = commons.mongoose,  
Schema = mongoose.Schema;  

var categorySchema = new Schema({
    _id: String,
    name: String
});  

//Export the schema  
module.exports = mongoose.model('Category', categorySchema);  