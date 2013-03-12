var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("GET /list");

 shoppingconf.getShoppings(function(shoppings){
		res.send(shoppings);
	});
 
}

module.exports = handler;

