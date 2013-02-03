module.exports = function(app){

    var Product = require('../models/product');

    //find all categories
    list = function(req, res){
        Product.find(function(err, product) {
            res.send(product);
        });
    };

    app.get('/product', list);
}