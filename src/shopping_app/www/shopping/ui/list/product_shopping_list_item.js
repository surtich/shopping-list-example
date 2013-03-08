iris.ui(function(self) {	
 self.create = function() {
  self.tmplMode(self.APPEND);
  self.product = self.setting("product");                
  self.tmpl(iris.path.ui.product_shopping_list_item.html, self.product);
  if (self.product.purchased === true) {
   self.get("order").addClass("purchased");
   self.get("nameProduct").addClass("purchased");
   self.get("icon-shopping-cart").removeClass("icon-shopping-cart").addClass("icon-shopping-cart-remove");
  }
  
  self.get("remove").on("click", self.setting("removeProduct"));
  
  self.get("buy").on("click",
   function () {
    iris.resource(iris.path.service.shopping).shopping.purchaseShoppingProduct(self.product, !self.product.purchased, function() {});
   }
   );
    
  self.on(iris.evts.shopping.productPurchased, function(purchasedProduct) {
   if(purchasedProduct._id === self.product._id) {
    self.get("order").toggleClass("purchased", self.product.purchased);
    self.get("nameProduct").toggleClass("purchased", self.product.purchased);
    self.get("icon-shopping-cart").toggleClass("icon-shopping-cart-remove", self.product.purchased);
    self.get("icon-shopping-cart").toggleClass("icon-shopping-cart", !self.product.purchased);
   }
  });
  
 };
    
 self.destroy = function () {
  self.get("remove").off("click");
  self.get("buy").off("click");
 };
}, iris.path.ui.product_shopping_list_item.js);