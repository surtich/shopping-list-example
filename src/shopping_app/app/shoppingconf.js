var commons = require('../../lib/commons'),
extend	= commons.extend,
mongodb = commons.mongodb,
async	= commons.async,
ObjectID = commons.mongodb.ObjectID,
hero	= commons.hero;

module.exports = hero.worker (
 function(self){
  var redis_client;
  var mongo_client = mongodb.MongoClient;
  var mongo_db;

  var dbCategoryConfMongodb = self.db('categories', self.config.app.db);

  var colUsers, colKinds, colCategories, colProducts, colShoppings;

  self.ready = function(p_cbk){
   async.parallel (
    [
    // mongoDb
    function(done){
     dbCategoryConfMongodb.setup(
      function(err, client){
       self.mongo_client = client;
       colCategories = new mongodb.Collection(client, 'categories');
       colProducts = new mongodb.Collection(client, 'products');
       colShoppings = new mongodb.Collection(client, 'shoppings');
       colUsers = new mongodb.Collection(client, 'users');
       self.colUsers = colUsers;
       colKinds = new mongodb.Collection(client, 'kinds');
       self.colKinds = colKinds;
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

  // -----
  // CATEGORIES
  // -----
  function addKind(knd, p_cbk){
   colKinds.insert(knd, function(err, result){
    if(!err){
     p_cbk(result);
    }
   });
  }



  function setUserKind(userId, knd, p_cbk){
   if(knd.act === undefined){
    knd.act = 0;
   }

   setUserKindAction(userId, knd.knd, knd.act, function(err,res){
    if(res){
     p_cbk(err,res);
    } else {
     var find = {
      usr: ObjectID(String(userId))
     };

     var set = {
      $addToSet: {
       'knds': {
        'knd': String(knd.knd),
        'act': parseInt(knd.act, 10)
       }
      }
     };

     colUsers.update(find, set, function(err,res){
      p_cbk(err,res);
     });
    }
   });
  }

  function setUserKindAction(userId, kndId, action, p_cbk){
   if(action === undefined){
    action = 0;
   }

   redis_client.set("cfg:usr:" + userId + ":knd:" + kndId + ":actions", action, function(){});

   var find = {
    usr: ObjectID(String(userId)),
    'knds.knd': String(kndId)
   };

   var set = {
    $set:{
     'knds.$.act': parseInt(action,10)
    }
   };

   colUsers.update(find, set, function(err,res){
    if(err || res === undefined){
     var find = {
      usr: ObjectID(String(userId))
     };

     var set = {
      $addToSet: {
       'knds': {
        'knd': String(kndId),
        'act': parseInt(action, 10)
       }
      }
     };

     colUsers.update(find, set, function(err,res){
      p_cbk(err,res);
     });
    } else {
     p_cbk(err,res);
    }
   });
 
   
  }


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

   getProduct(product_id, function (err, product) {
    if(err || !product) {
     err = "Product with _id =" + product_id + " does not exists.";
     p_cbk(err, product);
    } else {
     var set = {
      $addToSet: {
       'products': {
        'product_id': parseInt(product_id, 10),
        'product_name': product.name,
        'purchased': false
       }
      }
     };
     colShoppings.update(find, set, {
      w: 1
     }, function(err, res){
      p_cbk(err, res);
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
  
  function getProduct(product_id, p_cbk){
   colProducts.findOne({
    _id: parseInt(product_id, 10)
   }, function(err, product){
    p_cbk(err, product);
   });
  }
  

  self.createUser = createUser;
  self.setUserIdp = setUserIdp;
  self.getUserFromId = getUserFromId;
  self.getUserFromEmail = getUserFromEmail;
  self.addKind = addKind;

  self.setUserKind = setUserKind;
  self.setUserKindAction = setUserKindAction;

  self.getAllCategories = getAllCategories;
  self.getProducts = getProducts;
  self.getProduct = getProduct;
  self.createShoppingList = createShoppingList;
  self.addShoppingProduct = addShoppingProduct;
  self.removeShoppingProduct = removeShoppingProduct;
 }
 );