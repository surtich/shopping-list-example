iris.resource(
 function(self) {
  self.shopping = new ShoppingList();
  
  // POST /shopping
  self.getCurrentShopping = function (success, error) {
   if(self.shopping._id){
    success(self.shopping);
   } else {
    self.post("/shopping", {}, function(ret){
     self.shopping._id = ret.shopping_id;
     success(self.shopping);
    }, error);
   }
  };
  
  // POST /shopping/add/:shopping_id/product/:product_id
  function addShoppingProduct(product, success, error) {
   var shoppingProduct = $.extend({}, product);
   self.getCurrentShopping(function(shopping) {
    self.post("/shopping/add/" + shopping._id + "/product/" + shoppingProduct._id, {}, function(ret){
     shoppingProduct.order = ret.order;
     shoppingProduct.purchased = false;
     success(shoppingProduct);
    }, error); 
   }, error);
  };
  
  // DELETE /shopping/remove/:shopping_id/product/:product_id
  function removeShoppingProduct(product, success, error) {
   self.getCurrentShopping(function(shopping) {
    self.del("/shopping/remove/" + shopping._id + "/product/" + product._id, function(ret){
     success();
    }, error); 
   }, error);
  };
  
  // DELETE /shopping/remove/:shopping_id
  function removeAllShoppingProducts(success, error) {
   self.getCurrentShopping(function(shopping) {
    self.del("/shopping/remove/" + shopping._id, function(ret){
     success();
    }, error); 
   }, error);
  };
  
  // DELETE /shopping/remove/:shopping_id
  function removePurchasedProducts(success, error) {
   self.getCurrentShopping(function(shopping) {
    self.del("/shopping/remove/purchased/" + shopping._id, function(ret){
     success();
    }, error); 
   }, error);
  };
  
  // PUT /shopping/pruchase/:shopping_id/product/:product_id/purchased/:purchased
  function purchaseShoppingProduct(product, purchase, success, error) {
   self.getCurrentShopping(function(shopping) {
    self.put("/shopping/purchase/" + shopping._id + "/product/" + product._id + "/purchased/" + purchase, {}, function(ret){
     success();
    }, error); 
   }, error);
  };
  
  // PUT /shopping/purchase/:shopping_id/purchased/:purchased
  function purchaseAllShoppingProducts(purchase, success, error) {
   self.getCurrentShopping(function(shopping) {
    self.put("/shopping/purchase/" + shopping._id + "/purchased/" + purchase, {}, function(ret){
     success();
    }, error); 
   }, error);
  };
  
  // PUT /shopping/purchase/:shopping_id/purchased/invert
  function invertPurchaseAllShoppingProducts(success, error) {
   self.getCurrentShopping(function(shopping) {
    self.put("/shopping/purchase/" + shopping._id + "/purchased/invert", {}, function(ret){
     success();
    }, error); 
   }, error);
  };
  
  
  function ShoppingList(_id) {
   var that = this;
   that._id = _id;
   that.products = [];
   
   function _hasProducts(purchased) {
    var found = false;
    var i = 0;
    while ( !found && i < that.products.length ) {
     if (that.products[i].purchased === purchased) {
      found = true;
     } else {
      i++;
     }
    }
    return found;
   }
   
   function _addProduct(product, success, error) {
    addShoppingProduct(product, function(shoppingProduct) {
     that.products.push(shoppingProduct);
     iris.notify(iris.evts.shopping.productAdded, shoppingProduct);
     success();
    });
   }
   
   function _removeProduct(product, success, error) {
    removeShoppingProduct(product, function() {
     var i = 0;
     for (; i < that.products.length; i++ ) {
      if (product._id === that.products[i]._id) {
       that.products.splice(i, 1);
       break;
      }
     }
     
     iris.notify(iris.evts.shopping.productRemoved, product);
     success();
    });
   }
   
   function _removeAllProducts(success, error) {
    removeAllShoppingProducts(function() {
     while (that.products.length > 0 ) {
      var product = that.products[0];
      that.products.splice(0, 1);
      iris.notify(iris.evts.shopping.productRemoved, product);
     }
     success();
    });
   }
   
   function _removePurchasedProducts(success, error) {
    removePurchasedProducts(function() {
     var i = 0;
     while (i < that.products.length) {
      var product = that.products[i];
      if (product.purchased) {
       that.products.splice(i, 1);
       iris.notify(iris.evts.shopping.productRemoved, product);
      } else {
       i++;
      }
     }
     success();
    });
   }
   
   function _purchaseProduct(product, purchase, success, error) {
    purchaseShoppingProduct(product, purchase, function() {
     product.purchased = purchase;
     success();
     iris.notify(iris.evts.shopping.productPurchased, product);
    });
   }
   
   function _purchaseAllProducts(purchase, success, error) {
    purchaseAllShoppingProducts(purchase, function() {
     for (var i = 0; i < that.products.length; i++ ) {
      that.products[i].purchased = purchase;
      iris.notify(iris.evts.shopping.productPurchased, that.products[i]);
     }
     success();
    });
   }
   
   function _invertPurchaseAllProducts(success, error) {
    invertPurchaseAllShoppingProducts(function() {
     for (var i = 0; i < that.products.length; i++ ) {
      that.products[i].purchased = !that.products[i].purchased;
      iris.notify(iris.evts.shopping.productPurchased, that.products[i]);
     }
     success();
    });
   }
   
   function _getSortedShoppingProducts() {        
    var sortedShoppingProducts = [];
    var index = 0;
    var posPurchased = 0;
            
    for (; index < that.products.length; index++) {
     var product = that.products[index];                
     var purchased = product.purchased === true;
     var i = 0;
     var j = posPurchased;
     if (purchased) {
      i = posPurchased;
      j = sortedShoppingProducts.length;
     }
                
     while (i < j && sortedShoppingProducts[i].order < product.order) {
      i++;
     }
                
     if (i < j) {
      sortedShoppingProducts.splice(i, 0, product);                    
     } else {
      if (purchased) {
       sortedShoppingProducts.push(product);
      } else {
       sortedShoppingProducts.splice(posPurchased, 0, product);
      }
     }
     if (!purchased) {
      posPurchased++;
     }
    }
            
            
    return sortedShoppingProducts;
   }
   
   ShoppingList.prototype.addShoppingProduct = _addProduct;
   ShoppingList.prototype.removeShoppingProduct = _removeProduct;
   ShoppingList.prototype.removeAllShoppingProducts = _removeAllProducts;
   ShoppingList.prototype.purchaseShoppingProduct = _purchaseProduct;
   ShoppingList.prototype.purchaseAllShoppingProducts = _purchaseAllProducts;
   ShoppingList.prototype.invertPurchaseAllShoppingProducts = _invertPurchaseAllProducts;
   ShoppingList.prototype.removePurchasedProducts = _removePurchasedProducts;
   ShoppingList.prototype.getSortedShoppingProducts = _getSortedShoppingProducts;
   ShoppingList.prototype.hasNoPurchasedProducts = function() {            
    return _hasProducts(false);
   };
  
   ShoppingList.prototype.hasPurchasedProducts = function() {            
    return _hasProducts(true);
   };
  }
  
 },
 iris.path.service.shopping);