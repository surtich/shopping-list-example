module.exports = function(app){

    var Product = require('../models/product');

    //find all categories
    var list = function(req, res){
        Product.find(function(err, products) {
            res.send(products);
        });
    };

    app.get('/product', list);
};