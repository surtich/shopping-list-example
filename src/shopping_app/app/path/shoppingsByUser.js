var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("GET /shoppings");

 shoppingconf.getShoppingsByUser(req.user.email, function(shoppings){
		res.send(shoppings);
	});
 
}

module.exports = handler;

