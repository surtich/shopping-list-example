var shoppingconf = require('../shoppingconf');

function handler(req, res){
 var product_id = req.params.product_id;
 console.log("GET /product/" + product_id);

 shoppingconf.getProduct(product_id, function(err, product){
		if(err || !product){
			res.send(400, {err : 'product ' + product_id + ' not found'});
		} else {
			res.send(product);
		}
	});
 
}

module.exports = handler;

