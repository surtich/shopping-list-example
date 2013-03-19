iris.resource(
 function(self){
  var socket = null;
  self.disconnect = function() {
   if (socket) {
    socket.disconnect();
    socket = null;
   }
  };
 
  self.connect = function(success) {
   self.disconnect();
   iris.resource(iris.path.service.auth).getUser(function(user) {
    socket = io.connect(window.location.origin);
    
    socket.emit('login', user.email);
    
    socket.on('serverMessage', function (content) {
     console.log("Message from the server: " + content);
    });

    socket.on(iris.evts.shopping.listRemoved, function (data) {
     socket.emit('leave', data);
     console.log("received from socket.io [" + iris.evts.shopping.listRemoved + "] list [" + data + "]");
     iris.resource(iris.path.service.shopping).createShoppingList();
     iris.navigate("#?msg=" + iris.translate("REMOVED_LIST"));
    });
    
    socket.on(iris.evts.user.collaboratorRemoved, function (data) {
     iris.resource(iris.path.service.auth).getUser(function(user) {
      if (data === user.email) {
       socket.emit('leave');
       console.log("received from socket.io [" + iris.evts.user.collaboratorRemoved + "] email [" + data + "]");
       iris.resource(iris.path.service.shopping).createShoppingList();
       iris.navigate("#?msg=" + iris.translate("REMOVED_COLLABORATOR"));
      }
     });
    });
    
    socket.on(iris.evts.shopping.productPurchased, function (data) {
     console.log("revived socket.io [" + iris.evts.shopping.productPurchased + "]");
     if (iris.resource(iris.path.service.shopping).shopping.replaceProduct(data.product)) {
      iris.notify(iris.evts.shopping.productPurchased_io, data.product);
     }
    });
    
    socket.on(iris.evts.shopping.productRemoved, function (data) {
     console.log("revived socket.io [" + iris.evts.shopping.productRemoved + "]");
     if (iris.resource(iris.path.service.shopping).shopping.replaceProduct(data.product)) {
      //iris.notify(iris.evts.shopping.productRemoved_io, data.product);
     }
    });
    if (success) {
     success();
    }
   }, function() {
    alert.log("Error");
   });
  };
  
  function ensureConnected(success) {
   if (socket == null) {
    self.connect(success);
   } else {
    success();
   }
  }
  
  function ensureJoin(success, _id) {
   ensureConnected(function() {
    var shopping_id = _id ? _id : iris.resource(iris.path.service.shopping).shopping._id;
    socket.emit('join', shopping_id);
    success();
   });
  }
  
  self.on(iris.evts.shopping.productPurchased, function(product) {
   ensureJoin(function() {
    socket.emit(iris.evts.shopping.productPurchased, {
     product: product
    }); 
    console.log("emit socket.io [" + iris.evts.shopping.productPurchased + "]");
   });
  });
  
  self.on(iris.evts.shopping.listRemoved, function(shopping_id) {
   ensureJoin(function() {
    socket.emit(iris.evts.shopping.listRemoved, shopping_id);
   });
  });
  
  self.on(iris.evts.user.collaboratorRemoved, function(data) {
   ensureJoin(function() {
    socket.emit(iris.evts.user.collaboratorRemoved, data.email);
    console.log("emit socket.io [" + iris.evts.user.collaboratorRemoved + "] email [" + data.email + "]");
   }, data.shopping_id);
    
  });
  
  self.on(iris.evts.shopping.listLoaded, function(shopping) {
   ensureConnected(function() {
    socket.emit('join', shopping._id);
   });
   
  });
  
  self.on(iris.evts.shopping.listSaved, function(shopping) {
   ensureConnected(function() {
    socket.emit('join', shopping._id);
   });
  });
  
  self.on(iris.evts.shopping.productRemoved, function(productRemoved) {
   socket.emit(iris.evts.shopping.productRemoved, productRemoved);
  });
  
 },
 iris.path.service.io);
