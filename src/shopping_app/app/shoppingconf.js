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
secure = require('./secure.js');


module.exports = hero.worker (
 function(self){
  var port = self.config.app.port;
  var url  = self.config.app.url + ":" + port + '/';

  var dbShoppingConfMongodb = self.db('shopping', self.config.app.db);
   
  
  var colCounters, colCategories, colProducts, colShoppings;

  // Configuration
  app.configure(function() {
   app.set('port', process.env.PORT || port);
   app.set('url', url);
   app.use(express.logger());
   app.use(express.cookieParser());
   app.use(express.bodyParser());
   app.use(express.session({
    secret: 'SEC12345678RET'
   /*store: new RedisStore({
     host: self.config.db.session.host, 
     port: self.config.db.session.port, 
     client: dbSession.client
    })*/
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
  secure();
    
  self.ready = function(p_cbk){
   async.parallel (
    [
    // mongoDb
    function(done){
     dbShoppingConfMongodb.setup(
      function(err, client){
       self.mongo_client = client;
       colCounters = new mongodb.Collection(client, 'counters');
       colCategories = new mongodb.Collection(client, 'categories');
       colProducts = new mongodb.Collection(client, 'products');
       colShoppings = new mongodb.Collection(client, 'shoppings');
       done(null);
      }
      );
    }
    ], function(err){
     p_cbk(err);
    }
    );
  };


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

  function createShoppingList(p_cbk){
   var shoppingList = {
    _id : ObjectID(),
    products : []
   };

   colShoppings.insert(shoppingList, {
    w:1
   }, function(err, result){
    if(err || result.length === 0){
     p_cbk(err, null);
    } else {
     p_cbk(null, result[0]);
    }
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
     getNextSequence(shopping_id, function(err ,ret) {
      if (!err) {
       var set = {
        $addToSet: {
         'products': {
          'product_id': parseInt(product_id, 10),
          'order': ret.seq,
          'product_name': product.name,
          'purchased': 0
         }
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
     'products': []
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
     "products.$.purchased": purchased === "true" ? 1 : 0
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
      "products.$.purchased": purchased ? 1 : 0
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
    }
   };
 
   colShoppings.update(find, remove, {
    w: 1
   }, function(err, res){
    p_cbk(err, res);
   });
   
  }

 
  function getNextSequence(name, p_cbk) {
   colCounters.findAndModify({
    _id: name
   }, {}, {
    $inc: {
     seq: 1
    }
   }, {
    "new": true, 
    "upsert": true
   }, function (err, ret) {
    p_cbk(err, ret);
   });
   
  }

  self.getAllCategories = getAllCategories;
  self.getProducts = getProducts;
  self.getProduct = getProduct;
  self.purchaseProduct = purchaseProduct;
  self.purchaseAllProducts = purchaseAllProducts;
  self.createShoppingList = createShoppingList;
  self.addShoppingProduct = addShoppingProduct;
  self.removeShoppingProduct = removeShoppingProduct;
  self.removeAllShoppingProducts = removeAllShoppingProducts;
  self.removePurchasedProducts = removePurchasedProducts;
 }
 );