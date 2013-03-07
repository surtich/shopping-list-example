iris.resource(
 function(self){
  
  // GET /category/:category_id
		self.getProducts = function (category_id, success, error) {
			self.get("/category/" + category_id, function(products){
				success(products);
			}, error);
		};
		
 },
 iris.path.service.products);
