iris.resource(
	function(self){
		var categories = null;
  
		// GET /categories
		self.getAll = function (success, error) {
			if(categories !== null){
				success(categories);
			} else {
				self.get("/category", function(ret){
					categories = ret;
					self.categories = categories;
					success(categories);
				}, error);
			}
		};
	},
iris.path.service.categories);
