var commons = require('../../lib/commons'),
extend	= commons.extend,
mongodb = commons.mongodb,
async	= commons.async,
ObjectID = commons.mongodb.ObjectID,
passport = commons.passport,
GoogleStrategy	= commons.GoogleStrategy,
util = commons.util,
hero	= commons.hero,
app		= hero.app,
express	= commons.express,
auth = require('./auth.js'),
RedisStore		= commons.RedisStore
evts = {
 shopping : {
  listCreated: "shopping_list_created",
  listLoaded: "shopping_list_loaded",
  listRemoved: "shopping_list_removed",
  productAdded: "shopping_product_added",
  productRemoved: "shopping_product_removed",
  productPurchased: "shopping_product_purchased"
 },
 user : {
  changed: "user_changed",
  collaboratorRemoved: "collaborator_removed"
 }
};
module.exports = hero.worker (
 function(self){
  var port = self.config.app.port;
  var url  = self.config.app.url + ":" + port + '/';
  var redis_client;

  var dbShopping = self.db('shopping', self.config.app.db.shopping_conf);
  var dbSession = self.db('session', self.config.app.db.session);
  var dbUsers = self.db('user', self.config.app.db.user_config);
  
  self.dbUsers = dbUsers;
  
  var colCounters, colUsers, colCategories, colProducts, colShoppings;

  // Configuration
  app.configure(function() {
   app.set('port', process.env.PORT || port);
   app.set('url', url);
   app.use(express.logger());
   app.use(express.cookieParser());
   app.use(express.bodyParser());
   app.use(express.session({
    secret: 'SEC12345678RET',
    store: new RedisStore({
     host: self.config.app.db.session.host, 
     port: self.config.app.db.session.port, 
     pass: self.config.app.db.session.pass, 
     client: dbSession.client
    })
   }));
   app.use(express.methodOverride());
   app.use(passport.initialize());
   app.use(passport.session());
   app.use(app.router);
   app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
   }));
   app.use(express["static"](__dirname + "/../www"));
  });
  
  auth(self);
    
  self.ready = function(p_cbk){
   async.parallel (
    [
    // mongoDb
    function(done){
     dbShopping.setup(
      function(err, client){
       self.mongo_client = client;
       colUsers = new mongodb.Collection(client, 'users');
       colCounters = new mongodb.Collection(client, 'counters');
       colCategories = new mongodb.Collection(client, 'categories');
       colProducts = new mongodb.Collection(client, 'products');
       colShoppings = new mongodb.Collection(client, 'shoppings');
       done(null);
      }
      );
    },
    // redis
    function(done){
     dbUsers.setup(
      function(err, client){
       redis_client = client;
       self.redis_client = redis_client;
       done(null);
      }
      );
    },
    // socket.io
    function(done){
  /*
    var RedisStore = require('socket.io/lib/stores/redis')
     , redis  = require('socket.io/node_modules/redis')
     , pub    = redis.createClient()
     , sub    = redis.createClient()
     , client = redis.createClient();

     app.io.set('store', new RedisStore({
      redisPub : pub, 
      redisSub : sub, 
      redisClient : client
     }));
*/
     app.io.sockets.on('connection', function (socket) {
      
      socket.on('login', function(email) {
       socket.set('email', email, function(err) {
        if (err) {
         throw err;
        }
        socket.emit('serverMessage', 'Currently logged in as ' + email);
       });
      });
      
      socket.on(evts.shopping.productPurchased, function (data) {
       socket.get('list', function(err, list) {
        if (err) {
         throw err;
        }
        var broadcast = socket.broadcast;
        if (list) {
         broadcast.to(list);
        }
        broadcast.emit(evts.shopping.productPurchased, data);
       });
      });
      
      socket.on(evts.shopping.productRemoved, function (data) {
       socket.get('list', function(err, list) {
        if (err) {
         throw err;
        }
        var broadcast = socket.broadcast;
        if (list) {
         broadcast.to(list);
        }
        broadcast.emit(evts.shopping.productRemoved, data);
       });
       
      });
      
      socket.on(evts.shopping.listRemoved, function (data) {
       socket.get('email', function(err, email) {
        if (! email) {
         email = socket.id;
        }
        socket.get('list', function(err, list) {
         if (err) {
          throw err;
         }
         var broadcast = socket.broadcast;
         if (list) {
          broadcast.to(list);
         }
         broadcast.emit(evts.shopping.listRemoved, list);
        //socket.emit(evts.shopping.listRemoved, list);
        });
        
       });
      });
      
      socket.on(evts.user.collaboratorRemoved, function (email) {
       socket.get('list', function(err, list) {
        if (err) {
         throw err;
        }
        var broadcast = socket.broadcast;
        if (list) {
         broadcast.to(list);
        }
        broadcast.emit(evts.user.collaboratorRemoved, email);
       //socket.emit(evts.shopping.listRemoved, list);
       });
      });
      
      socket.on('join', function(list) {
       socket.get('list', function(err, oldList) {
        if (err) {
         throw err;
        }
        socket.set('list', list, function(err) {
         if (err) {
          throw err;
         }
         
         if (list !== oldList) {
          socket.join(list);
          socket.leave(oldList);
          socket.emit('serverMessage', 'Your joined list is' + list);
          socket.get('email', function(err, email) {
           if (! email) {
            email = socket.id;
           }
           socket.broadcast.to(list).emit('serverMessage', 'User ' +
            email + ' joined to ' + list);
          });
         }
        });
       });
      });
      
      socket.on('leave', function(list) {
       socket.get('list', function(err, oldList) {
        if (err) {
         throw err;
        }
        if (!list || list === oldList) {
         socket.leave(oldList);
         socket.set('list', null, function(err) {
          if (err) {
           throw err;
          }
          socket.emit('serverMessage', 'Your have left the list ' + list);
         });
        }
       });
      });

     });
     done(null);
    }
    ], function(err){
     p_cbk(err);
    }
    );
  };


  // -----
  // USERS
  // -----

  function getUserFromId(userId, p_cbk){
   var find = {
    usr: ObjectID(String(userId))
   };

   colUsers.findOne(find, {
    fields:{
     _id:0
    }
   }, function(err, user){
    if(err || user === null){
     p_cbk(err, null);
    } else {
     p_cbk(null, user);
    }
   });
  }

  function getUserFromEmail(email, p_cbk){
   var find = {
    email : email
   };

   colUsers.findOne(find, {
    fields:{
     _id:0
    }
   }, function(err, user){
    if(err || user === null){
     p_cbk(err, null);
    } else {
     p_cbk(null, user);
    }
   });
  }

  function createUser(email, p_cbk){
   var user = {
    usr : ObjectID(),
    email: email,
    lan : 'en',
    knds : [],
    idps : []
   };

   colUsers.insert(user, {
    w:1
   }, function(err, users){
    if(err || users.length === 0){
     p_cbk(err, null);
    } else {
     p_cbk(null, users[0]);
    }
   });
  }

  // -----
  // IDPS
  // -----
  function setUserIdp(userId, idp, p_cbk){
   // redis_client.set("idp:" + idp.idp + ":" + idp.uid, userId, function(){});

   var find = {
    usr: ObjectID(String(userId)),
    'idps.idp': idp.idp
   };

   var set = {
    $set:{
     'idps.$.uid': idp.uid
    }
   };

   colUsers.update(find, set, function(err,res){
    if(res){
     // idp updated
     p_cbk(err,res);
    } else {
     // idp does not exists, must be created
     var find = {
      usr: ObjectID(String(userId))
     };

     var set = {
      $addToSet: {
       'idps': idp
      }
     };

     colUsers.update(find, set, function(err,res){
      p_cbk(err,res);
     });
    }
   });
  }
  
  function checkOwner(shopping_id, email, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id)),
    email: email
   };

   colShoppings.find(find).count(function(err, count){
    p_cbk(err, count > 0);
   });
   
  }

  // -----
  // PRODUCTS
  // -----

  function getAllCategories(p_cbk){
   colCategories.find({}).toArray(function(err, items){
    if(!err){
     p_cbk(items);
    }
   });
  }

  function getProducts(category_id, p_cbk){
   colProducts.find({
    category_id: parseInt(category_id, 10)
   }).sort({
    _id: 1
   }).toArray(function(err, items){
    p_cbk(err, items);
   });
  }

  // -----
  // SHOPPINGS
  // -----


  function createShoppingList(email, p_cbk){
   saveShoppingList([], email, p_cbk);
  }
  
  function cloneShoppingList(shopping_id, email, p_cbk, error) {
   getShoppingList(shopping_id, function(error, shopping) {
    saveShoppingList(shopping.products, email, p_cbk);
   });
  }
  
  function saveShoppingList(products, email, p_cbk){
   
   var order = 0;
   var date = new Date();
   for (var i = 0; i< products.length; i++) {
    var product = products[i];
    product._id = parseInt(product._id, 10);
    product.purchased = product.purchased === "true" ? 1 : 0;
    product.email = email;
    product.last_updated = date;
    if (product.order > order) {
     order++;
    }
   }
   var shoppingList = {
    _id : ObjectID(),
    email: email,
    products: products,
    collaborators: [],
    last_updated: date
   };

   colShoppings.insert(shoppingList, {
    w:1
   }, function(err, result){
    if(err || result.length === 0){
     p_cbk(err, null);
    } else {
          
     getNextSequence(ObjectID(String(result[0]._id)), function(err ,ret) {
      p_cbk(null, result[0]); 
     }, order);
    }
   });
  }
  
  function updateShoppingListDate(shopping_id, p_cbk){
   
   var find = {
    _id: ObjectID(String(shopping_id))
   };
   
   var set = {
    $set:{
     'last_updated': new Date()
    }
   };
   
   colShoppings.update(find, set, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
   
  }
  
  function addShoppingProduct(shopping_id, product_id, email, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id))
   };
   
   var projection = {
    "products.order": 1, 
    "_id": 0
   }

   getProduct(product_id, function (err, product) {
    if(err || !product) {
     err = "Product with _id =" + product_id + " does not exists.";
     p_cbk(err, product);
    } else {
     getNextSequence(ObjectID(String(shopping_id)), function(err ,ret) {
      if (!err) {
       var date = new Date();
       var p =  {
        '_id': parseInt(product_id, 10),
        'order': ret.seq,
        'name': product.name,
        'purchased': 0,
        'email': email,
        'last_updated': date
       };
       var set = {
        $addToSet: {
         'products': p
        },
        $set:{
         'last_updated': date
        }
       };
       colShoppings.update(find, set, {
        w: 1
       }, function(err, res){
        p_cbk(err, {
         order: ret.seq,
         product: p
        });
       }); 
      }
     });
    }
   });
  }
  
  function removeShoppingProduct(shopping_id, product_id, p_cbk){
   
   var find = {
    _id: ObjectID(String(shopping_id))
   };

   getProduct(product_id, function (err, product) {
    if(err || !product) {
     err = "Product with _id =" + product_id + " does not exists.";
     p_cbk(err, product);
    } else {
     var remove = {
      $pull: {
       'products': {
        '_id': parseInt(product_id, 10)
       }
      },
      $set:{
       'last_updated': new Date()
      }
     };
     colShoppings.update(find, remove, {
      w: 1
     }, function(err, res){
      p_cbk(err, res);
     });
    }
   });
  }
  
  function removeAllShoppingProducts(shopping_id, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id))
   };

   var set = {
    $set: {
     'products': [],
     'last_updated': new Date()
    }
   };
   
   colShoppings.update(find, set, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
  }
   
  function getProduct(product_id, p_cbk){
   colProducts.findOne({
    _id: parseInt(product_id, 10)
   }, function(err, product){
    p_cbk(err, product);
   });
  }
  
  function purchaseProduct(shopping_id, product_id, purchased, email, p_cbk){
   
   var find = {
    _id: ObjectID(String(shopping_id)),    
    "products._id": parseInt(product_id, 10)
   };
   
   var date = new Date();
   
   var set = {
    $set: {
     "products.$.purchased": purchased === "true" ? 1 : 0,
     "products.$.email": email,
     "products.$.last_updated": date,
     'last_updated': date
    }
   };
   
   colShoppings.update(find, set, {
    w: 1
   }, function(err, res){
    if (res === 0) {
     p_cbk(err, res);
    } else {
     p_cbk(err, {
      email: email,
      last_updated: date
     });
    }
   });
  }
  
  function purchaseAllProducts(shopping_id, purchased, email, p_cbk){
   if (purchased === "invert") {
    invertPurchaseAllProducts(shopping_id, email, p_cbk);
   } else {
    purchased = (purchased === "true");
   
    var date = new Date();
   
    var find = {
     _id: ObjectID(String(shopping_id)),    
     "products.purchased": {
      $mod: [2, !purchased ? 1 : 0]
     }
    };
   
    var set = {
     $set: {
      "products.$.purchased": purchased ? 1 : 0,
      "products.$.email": email,
      "products.$.last_updated": date,
      'last_updated': date
     }
    };
   
    var end = false;
   
    async.whilst(
     function () {
      return end === false;
     },
     function (callback) {
      colShoppings.update(find, set, {
       w: 1
      }, function(err, res){
       end = (res === 0);
       callback(err);
      });
     },
     function (err) {
      p_cbk(err, {
       email: email,
       last_updated: date
      });
     }
     );
   }
  }
  
  function invertPurchaseAllProducts(shopping_id, email, p_cbk){
   
   var date = new Date();
   
   var find = {
    _id: ObjectID(String(shopping_id))
   };
    
   var projection = {
    products: 1,
    _id: 0
   };
   
   var inc = {
    $inc: {
     "products.$.purchased":1
    },
    $set: {
     'last_updated': date,
     "products.$.email": email,
     "products.$.last_updated": date
    }
   };
     
    
   colShoppings.find(find, projection).toArray(function(err, items){
    
    async.forEach(items[0].products, invertPurchase, function(err){
     p_cbk(err, {
      email: email,
      last_updated: date
     });
    });
     
    function invertPurchase(product, callback) {
     find = {
      _id: ObjectID(String(shopping_id)),
      "products._id": product._id
     };
     
     colShoppings.update(find, inc, {
      w: 1
     }, function(err, res){
      callback(err);
     }); 
    }
    
   });
  }
  
  function removePurchasedProducts(shopping_id, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id))
   };
   
   var remove = {
    $pull: {
     "products": {
      "purchased": {
       $mod: [2, 1]
      }
     }
    },
    $set: {
     'last_updated': new Date()
    }
   };
 
   colShoppings.update(find, remove, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
   
  }
  
  function getShoppingsByUser(email, p_cbk){
   
   var map = function() {
    var products = 0;
    var purchased = 0;
    var idx = 0;
    for (idx = 0; idx < this.products.length; idx++) {
     if (this.products[idx].purchased % 2 !== 0) {
      purchased++;
     }
     products++;
    }
    
    var state = "owner";
    
    for (idx = 0; idx < this.collaborators.length; idx++) {
     if (this.collaborators[idx].email === email) {
      state = this.collaborators[idx].state;
      break;
     }
     
     
    }
    
    emit(this._id, {
     last_updated: this.last_updated,
     products: products,
     purchased: purchased,
     owner: this.email,
     state: state
    });
   }
   
   var reduce = function(k, value) {
    return value;
   };
   
   colShoppings.mapReduce(
    map,
    reduce,
    {
     out : {
      inline: 1
     },
     query: {
      $or: [
      {
       "email": email
      },

      {
       "collaborators": {
        "$elemMatch": {
         "email": email, 
         state:{
          $ne: "rejected"
         }
        }
       }
      }
      ]
     },
     scope: {
      "email": email
     }
    }, function (err, results, stats) {
     if (err) {
      throw err;
     }
     p_cbk(results);
    }
    );
  }
  
  function getShoppingList(shopping_id, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id))
   };
   
   colShoppings.findOne(find, function(err, res){
    p_cbk(err, res);
   });
   
  }
  
  function getShoppingCollaborators(shopping_id, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id))
   };
   
   
   var projection = {
    collaborators: 1,
    _id: 0
   };
   
   
   colShoppings.findOne(find, {
    fields: projection
   }, function(err, res){
    p_cbk(err, res);
   });
   
  }
  
  function removeShoppingList(shopping_id, p_cbk){
   
   var find = {
    _id: ObjectID(String(shopping_id))
   };
   
   colShoppings.remove(find, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
   
  }
  
  function addShoppingCollaborator(shopping_id, email, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id))
   };
   
   var set = {
    $addToSet: {
     'collaborators': {
      'email': email,
      'state': 'pending'
     }
    }
   };
   colShoppings.update(find, set, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
  }
  
  
  function changeStateCollaborator(shopping_id, email, state, p_cbk) {
   var find = {
    _id: ObjectID(String(shopping_id)),    
    "collaborators.email": email
   };
   
   var set = {
    $set: {
     "collaborators.$.state": state
    }
   };
   
   colShoppings.update(find, set, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
  }
  
  function removeShoppingCollaborator(shopping_id, email, p_cbk){
   
   var find = {
    _id: ObjectID(String(shopping_id))
   };
   var remove = {
    $pull: {
     'collaborators': {
      'email': email
     }
    }
   };
   colShoppings.update(find, remove, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
  }
  
  function isCollaborator(shopping_id, email, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id)),    
    "collaborators.email": email
   };
   
   colShoppings.findOne(find, function(err, item){
    p_cbk(err, item !== null);
   });
  }
  
  function isAcceptedCollaborator(shopping_id, email, p_cbk){
   var find = {
    _id: ObjectID(String(shopping_id)),    
    "collaborators": {
     "$elemMatch": {
      "email": email, 
      state: "accepted"
     }
    }
   };
   
   colShoppings.findOne(find, function(err, item){
    p_cbk(err, item !== null);
   });
  }
  

  // -----
  // UTILS
  // -----

 
  function getNextSequence(name, p_cbk, order) {
   colCounters.findAndModify({
    _id: name
   }, {}, {
    $inc: {
     seq: order !== undefined ? order : 1
    }
   }, {
    "new": true, 
    "upsert": true
   }, function (err, ret) {
    p_cbk(err, ret);
   });
   
  }

  self.getUserFromId = getUserFromId;
  self.getUserFromEmail = getUserFromEmail;
  self.createUser = createUser;
  self.setUserIdp = setUserIdp;
  self.checkOwner = checkOwner;
  self.getAllCategories = getAllCategories;
  self.getProducts = getProducts;
  self.getProduct = getProduct;
  self.purchaseProduct = purchaseProduct;
  self.purchaseAllProducts = purchaseAllProducts;
  self.createShoppingList = createShoppingList;
  self.saveShoppingList = saveShoppingList;
  self.addShoppingProduct = addShoppingProduct;
  self.removeShoppingProduct = removeShoppingProduct;
  self.removeAllShoppingProducts = removeAllShoppingProducts;
  self.removePurchasedProducts = removePurchasedProducts;
  self.getShoppingsByUser = getShoppingsByUser;
  self.getShoppingList = getShoppingList;
  self.removeShoppingList = removeShoppingList;
  self.cloneShoppingList = cloneShoppingList;
  self.addShoppingCollaborator = addShoppingCollaborator;
  self.acceptCollaborator = function (shopping_id, email, p_cbk) {
   changeStateCollaborator(shopping_id, email, "accepted", p_cbk)
  };
  self.rejectCollaborator = function (shopping_id, email, p_cbk) {
   changeStateCollaborator(shopping_id, email, "rejected", p_cbk)
  };
  self.removeShoppingCollaborator = removeShoppingCollaborator;
  self.getShoppingCollaborators = getShoppingCollaborators;
  self.isCollaborator = isCollaborator;
  self.isAcceptedCollaborator = isAcceptedCollaborator;
  
  
 }
 );