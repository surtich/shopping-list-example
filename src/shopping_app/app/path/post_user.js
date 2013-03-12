var shoppingconf = require('../shoppingconf');

function handler(req, res){
	console.log("POST /api/user");
debugger
	//Bad request
	if(!req.body.hasOwnProperty('email')){
		res.send(400);
	}

	var email = req.body.email;
	delete req.body.email;
	shoppingconf.getUserFromEmail(email, function(err, user){
		if(err || user === null) {
			//User does not exist we must create it
			shoppingconf.createUser(email, function(err, user){
				shoppingconf.setUserIdp(user.usr, req.body, function(err, ret){
					res.send(200, {uid : user.usr});
				});
			});
		} else {
			//User already exists must add the idp
			shoppingconf.setUserIdp(user.usr, req.body, function(err, ret){
				res.send(200, {uid : user.usr});
			});
		}
	});

}

module.exports = handler;

