//App routes
module.exports = function(app){

    var Category = require('../models/category');

    //find all categories
    list = function(req, res){
        Category.find(function(err, categories) {
            res.send(categories);
        });
    };

    app.get('/category', list);
}