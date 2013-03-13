var shoppingconf = require('../shoppingconf');

function handler(req, res, next){
 var shopping_id = req.params.shopping_id;
 var email = req.user.email;
 shoppingconf.checkOwner(shopping_id, email, function(err, ret){
  if(err){
   res.send(400, {
    err : 'Error'
   });
  } else if (ret === true){
   next();
  } else {
   res.send(403, {
    err : 'You are not the owner of the shopping list'
   });
  }
 }); 
}

module.exports = handler;

