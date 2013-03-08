iris.ui(function(self) {	
 var product;
 self.create = function() {  
  self.tmplMode(self.APPEND);
  product = self.setting("product");
  self.tmpl(iris.path.ui.product_list_item.html, product);
  self.get("product").change(function (event) {
   if (this.checked) {
    iris.resource(iris.path.service.shopping).shopping.addShoppingProduct(product, function() {
    });
   } else {
    iris.resource(iris.path.service.shopping).shopping.removeShoppingProduct(product, function() {
    });
   } 
            
  });
  
  self.on(iris.evts.shopping.productAdded, function(productAdded) {
   if (productAdded._id === product._id) {
    self.get("product").prop('checked', true);
   }
  });
  
  self.on(iris.evts.shopping.productRemoved, function(productRemoved) {
   if (productRemoved._id === product._id) {
    self.get("product").prop('checked', false);
   }
  });
 };
    
}, iris.path.ui.product_list_item.js);