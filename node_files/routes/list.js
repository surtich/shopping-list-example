//App routes
module.exports = function(app){

    var List = require('../models/list');

    //find all categories
    lists = function(req, res){
        List.find().populate("idCategory","user").exec(
            function(err, shoppingLists) {
                /*console.log("_id =" + shoppingLists[0]._id);
                console.log("idCategory="+shoppingLists[0].idCategory);
                console.log("user="+shoppingLists[0].user);*/
                res.send(shoppingLists);
            }
            );
    };
    
    create = function(req, res) {
        var list = new List ({
            lastUpdated: new Date(), 
            user : req.user._json.email, 
            products: JSON.parse(req.body.products)
        });
        list.save();
        res.send(list);
    }
    
    update = function(req, res) {
        List.findOne({
            _id: req.params.idList
        }, function(error, list) {
            list.lastUpdated = new Date();
            list.products = JSON.parse(req.body.products)
            list.save();
            res.send(list);
            
        });
    }
    
    find = (function(req, res) {  
        List.findOne({
            _id: req.params.idList
        }, function(error, list) {  
            res.send(list);  
        });  
    });
    
    remove = (function(req, res) {  
        List.findOne({
            _id: req.params.idList
        }, function(error, list) {              
            list.remove();
            res.send(list);  
        })  
    });
    
    

    app.get('/list', lists);
    app.get('/list/:idList', find);
    app.delete('/list/:idList', remove);
    app.put('/list/:idList', update);
    app.post('/list', create);
}