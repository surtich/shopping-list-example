iris.resource(
 function(self){
  
  // GET /shoppings
  self.getByUser = function (success, error) {
   self.get("/shoppings", function(ret){
    success(ret);
   }, error);
			
  };
 },
 iris.path.service.shoppingLists);
