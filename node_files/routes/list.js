//App routes
module.exports = function(app){

    var List = require('../models/list');

    //find all categories
    lists = function(req, res){
        List.find(function(err, lists) {
            for (var i = 0; i< lists.length; i++) {
                
            }
            res.send(lists);
        });
    };
    
    list_create = function(req, res) {
        var list = new List ({
            lastUpdated: new Date()
            , user : req.user._json.email
            , products: req.body.products
        });
        
        console.log(JSON.stringify(list));
        
        list.save();
        res.send(list);
    }
    
    find = (function(req, res) {  
        List.findOne({_id: req.params.idList}, function(error, list) {  
            res.send(list);  
        })  
    });
    

    app.get('/list', lists);
    app.get('/list/:idList', find);
    app.post('/list', list_create);
}