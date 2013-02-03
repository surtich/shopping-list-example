//App routes
module.exports = function(app){

    var Category = require('../models/category');

    //find all categories
    list = function(req, res){
        Category.find(function(err, category) {
            res.send(category);
        });
    };

    app.get('/category', list);
}