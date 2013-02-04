module.exports = function(app){

    var Product = require('../models/product');

    //find all categories
    list = function(req, res){
        Product.find(function(err, products) {
            res.send(products);
        });
    };

    app.get('/product', list);
}