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
RedisStore		= commons.RedisStore;


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
     client: dbSession.client
    })
   }));
   app.use(express.methodOverride());
   app.use(passport.initialize());
   app.use(passport.session());
   /*
   app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', app.get('url'));
    res.header('Access-Control-Allow-Credentials', true);
    next();
   });
   */
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
  
  function saveShoppingList(products, email, p_cbk){
   
   var auxProducts = [];
   var order = 0;
   for (var i = 0; i< products.length; i++) {
    var product = products[i];
    var auxProduct = {};
    auxProduct.product_id = product._id;
    auxProduct.product_name = product._name;
    auxProduct.order = product.order;
    auxProduct.product_name = product.name;
    auxProduct.purchased = product.purchased === true;
    auxProducts.push(auxProduct);
    if (product.order > order) {
     order++;
    }
   }
   var shoppingList = {
    _id : ObjectID(),
    email: email,
    products: auxProducts,
    last_updated: new Date()
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
  
  function addShoppingProduct(shopping_id, product_id, p_cbk){
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
       var set = {
        $addToSet: {
         'products': {
          'product_id': parseInt(product_id, 10),
          'order': ret.seq,
          'product_name': product.name,
          'purchased': 0
         }
        },
        $set:{
         'last_updated': new Date()
        }
       };
       colShoppings.update(find, set, {
        w: 1
       }, function(err, res){
        p_cbk(err, {
         order: ret.seq
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
        'product_id': parseInt(product_id, 10)
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
  
  function purchaseProduct(shopping_id, product_id, purchased, p_cbk){
   
   var find = {
    _id: ObjectID(String(shopping_id)),    
    "products.product_id": parseInt(product_id, 10)
   };
   
   var set = {
    $set: {
     "products.$.purchased": purchased === "true" ? 1 : 0,
     'last_updated': new Date()
    }
   };
   
   colShoppings.update(find, set, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
  }
  
  function purchaseAllProducts(shopping_id, purchased, p_cbk){
   if (purchased === "invert") {
    invertPurchaseAllProducts(shopping_id, p_cbk);
   } else {
    purchased = (purchased === "true");
   
    var find = {
     _id: ObjectID(String(shopping_id)),    
     "products.purchased": {
      $mod: [2, !purchased ? 1 : 0]
     }
    };
   
    var set = {
     $set: {
      "products.$.purchased": purchased ? 1 : 0,
      'last_updated': new Date()
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
      p_cbk(err, 1);
     }
     );
   }
  }
  
  function invertPurchaseAllProducts(shopping_id, p_cbk){
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
     'last_updated': new Date()
    }
   };
     
    
   colShoppings.find(find, projection).toArray(function(err, items){
    
    async.forEach(items[0].products, invertPurchase, function(err){
     p_cbk(err);
    });
     
    function invertPurchase(product, callback) {
     find = {
      _id: ObjectID(String(shopping_id)),
      "products.product_id": product.product_id
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
  
  function getShoppings(p_cbk){
   colShoppings.find({}).toArray(function(err, items){
    if(!err){
     p_cbk(items);
    }
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
  self.getShoppings = getShoppings;
 }
 );