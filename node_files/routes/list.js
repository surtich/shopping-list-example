//App routes
module.exports = function(app){
    
    var sanitize = require('validator').sanitize;

    var List = require('../models/list');

    //find all categories
    var lists = function(req, res){
        var user = req.user._json.email;
        List.find({
            user: user
        },
        function(err, shoppingLists) {
            /*console.log("_id =" + shoppingLists[0]._id);
                console.log("idCategory="+shoppingLists[0].idCategory);
                console.log("user="+shoppingLists[0].user);*/
            res.send(shoppingLists);
        }
        );
    };
    
    var create = function(req, res) {
        var list = new List ({
            lastUpdated: new Date(), 
            user : req.user._json.email, 
            products: JSON.parse(sanitize(req.body.products).xss())
        });
        list.save();
        res.send(list);
    };
    
    var update = function(req, res) {
        List.findOne({
            _id: sanitize(req.params.idList).xss()
        }, function(error, list) {
            if (list === null) {
                res.status(400).send("The shopping list does not exists");
            } else if (list.user === req.user._json.email) {
                list.lastUpdated = new Date();
                list.products = JSON.parse(sanitize(req.body.products).xss());
                list.save();
                res.send(list);
            } else {
                res.status(401).send("You are not the owner of this Shopping List");
            }
        });
    };
    
    var find = function(req, res) {  
        List.findOne({
            _id: req.params.idList
        }, function(error, list) {  
            if (list === null) {
                res.status(400).send("The shopping list does not exists");
            } else if (list.user === req.user._json.email) {
                res.send(list);
            } else {
                res.status(401).send("You are not the owner of this Shopping List");
            }
        });  
    };
    
    var remove = function(req, res) {  
        List.findOne({
            _id: sanitize(req.params.idList).xss()
        }, function(error, list) {              
            if (list === null) {
                res.status(400).send("The shopping list does not exists");
            } else if (list.user === req.user._json.email) {
                list.remove();
                res.send(list);  
            } else {
                res.status(401).send("You are not the owner of this Shopping List");
            }
            
        });  
    };

    app.get('/list', lists);
    app.get('/list/:idList', find);
    app["delete"]('/list/:idList', remove);
    app.put('/list/:idList', update);
    app.post('/list', create);
};