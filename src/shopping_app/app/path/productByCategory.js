var shoppingconf = require('../shoppingconf');

function handler(req, res){
 var category_id = req.params.category_id;
 console.log("GET /category/" + category_id);

 shoppingconf.getProducts(category_id, function(err, products){
		if(err){
			res.send(400, {err : 'category ' + category_id + ' not found'});
		} else {
			res.send(products);
		}
	});
 
}

module.exports = handler;

