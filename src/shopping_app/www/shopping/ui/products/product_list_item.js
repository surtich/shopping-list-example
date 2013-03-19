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
  self.get("product").prop('checked', iris.resource(iris.path.service.shopping).shopping.hasProduct(product._id));
  
  
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
  
  self.on(iris.evts.shopping.listCreated, function() {   
   
   self.get("product").prop('checked', false);
  });
  
  self.on(iris.evts.shopping.listLoaded, function() {   
   self.get("product").prop('checked', iris.resource(iris.path.service.shopping).shopping.hasProduct(product._id));
  });
  
 };
 
 self.awake = function() {
  iris.resource(iris.path.service.auth).getUser(function(user) {
   if (iris.resource(iris.path.service.shopping).shopping.email && iris.resource(iris.path.service.shopping).shopping.email !== user.email) {
    self.get("product").addClass("disabled").prop("disabled", true);   
   } else {
    self.get("product").removeClass("disabled").prop("disabled", false);   
   }
  });
 }
    
}, iris.path.ui.product_list_item.js);