var shoppingconf = require('../shoppingconf');

function handler(req, res){
 console.log("POST /shopping");
 shoppingconf.createShoppingList(req.user.email, function(err, shoppingList){
  if(err){
   res.send(400, {
    err : 'Error when creating list'
   });
  } else {
   res.send(200, {
    shopping_id : shoppingList._id
    });
  }
 });
 
}

module.exports = handler;

