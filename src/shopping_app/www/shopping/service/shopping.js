iris.resource(
 function(self){
  var shopping = null;
  
  // POST /shopping
  self.getCurrentShopping = function (success, error) {
   if(shopping !== null){
    success(shopping);
   } else {
    self.post("/shopping", {}, function(ret){
     shopping = {};
     shopping._id = ret.shopping_id;
     success(shopping);
    }, error);
   }
  };
  
  // POST /shopping/add/:shopping_id/product/:product_id
  self.addShoppingProduct = function (product_id, success, error) {
   self.getCurrentShopping(function() {
    self.post("/shopping/add/" + shopping._id + "/product/" + product_id, {}, function(ret){
     success();
    }, error); 
   }, error);
  };
  
  // DELETE /shopping/remove/:shopping_id/product/:product_id
  self.removeShoppingProduct = function (product_id, success, error) {
   self.getCurrentShopping(function() {
    self.del("/shopping/remove/" + shopping._id + "/product/" + product_id, {}, function(ret){
     success();
    }, error); 
   }, error);
  };
  
 },
 iris.path.service.shopping);
