iris.ui(function(self) {	
    
 function _inflate(category) {
  if(category.products) {
   $.each(category.products,
    function(index, product) {
     self.ui("list_products", iris.path.ui.product_list_item.js, {
      "product": product
     });
    }
    );
  }
 }
    
 self.create = function() {
  self.tmplMode(self.APPEND);
  var category = self.setting("category");
  self.tmpl("/shopping/ui/products/category_list_item.html", category);
  self.get("category").click(
   function() {
    if (!category.products) {
     iris.resource(iris.path.service.products).getProducts(category._id, function(products) {
      category.products = products;
      _inflate(category);
     });   
    }
   }
   );
 };	
    
}, iris.path.ui.category_list_item.js);