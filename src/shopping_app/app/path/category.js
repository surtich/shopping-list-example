var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("GET /category");

 shoppingconf.getAllCategories(function(categories){
		res.send(categories);
	});
 
}

module.exports = handler;

