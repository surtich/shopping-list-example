var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var async = require('async');

//var URI_CONNECTION = "mongodb://shopping-list-database-user:shopping-user-23ewejfoiejfe@linus.mongohq.com:10077/shopping-list-database";
var URI_CONNECTION = "mongodb://nodejitsu:426c4f35c0bb397e8406ca94df9f880d@linus.mongohq.com:10003/nodejitsudb8390532326";
var actual_collection = null;


var categories = [{
    "_id":1,
    "nameCategory":"Vegetables"
},{
    "_id":7,
    "nameCategory":"Fruits"
},{
    "_id":17,
    "nameCategory":"Meat"
},{
    "_id":24,
    "nameCategory":"Seafood"
}];
var products = [{
    "_id":2,
    "nameProduct":"Carrots",
    "category_id":1
},{
    "_id":3,
    "nameProduct":"Cucumbers",
    "category_id":1
},{
    "_id":4,
    "nameProduct":"Onions",
    "category_id":1
},{
    "_id":5,
    "nameProduct":"Spinach",
    "category_id":1
},{
    "_id":6,
    "nameProduct":"Tomatoes",
    "category_id":1
},{
    "_id":8,
    "nameProduct":"Apples",
    "category_id":7
},{
    "_id":9,
    "nameProduct":"Bananas",
    "category_id":7
},{
    "_id":10,
    "nameProduct":"Grapes",
    "category_id":7
},{
    "_id":11,
    "nameProduct":"Kiwis",
    "category_id":7
},{
    "_id":12,
    "nameProduct":"Lemons",
    "category_id":7
},{
    "_id":13,
    "nameProduct":"Melon",
    "category_id":7
},{
    "_id":14,
    "nameProduct":"Oranges",
    "category_id":7
},{
    "_id":15,
    "nameProduct":"Peaches",
    "category_id":7
},{
    "_id":16,
    "nameProduct":"Plums",
    "category_id":7
},{
    "_id":18,
    "nameProduct":"Bacon",
    "category_id":17
},{
    "_id":19,
    "nameProduct":"Beef",
    "category_id":17
},{
    "_id":20,
    "nameProduct":"Chicken",
    "category_id":17
},{
    "_id":21,
    "nameProduct":"Turkey",
    "category_id":17
},{
    "_id":22,
    "nameProduct":"Pork",
    "category_id":17
},{
    "_id":23,
    "nameProduct":"Hot dogs",
    "category_id":17
},{
    "_id":25,
    "nameProduct":"Catfish",
    "category_id":24
},{
    "_id":26,
    "nameProduct":"Crab",
    "category_id":24
},{
    "_id":27,
    "nameProduct":"Lobster",
    "category_id":24
},{
    "_id":28,
    "nameProduct":"Mussels",
    "category_id":24
},{
    "_id":29,
    "nameProduct":"Oysters",
    "category_id":24
},{
    "_id":30,
    "nameProduct":"Salmon",
    "category_id":24
},{
    "_id":31,
    "nameProduct":"Tilapia",
    "category_id":24
},{
    "_id":32,
    "nameProduct":"Tuna",
    "category_id":24
}];

function done(err, p_client) {
    if (err) {
        throw err;
    }
    p_client.close();
    console.log("done!");
}


function iterator(value, callback) {
    actual_collection.insert(value, {}, function (err, objects) {
        if (err) {
            callback(err);
        } else {
            console.log("Inserted " + JSON.stringify(value));
            callback();
        }
    });
}



function tasks(p_client) {
    async.series([
        function(callback){
            p_client.collection("lists", function (err, collection) {
                actual_collection = collection;
            });
            callback(null, 'Get lists collection');
        },
        function(callback){
            actual_collection.remove();
            console.log("Lists removed");
            callback(null, 'Lists removed');
        },
        function(callback){
            p_client.collection("categories", function (err, collection) {
                actual_collection = collection;
            });
            callback(null, 'Get categories collection');
        },
        function(callback){
            actual_collection.remove();
            console.log("Categories removed");
            callback(null, 'Categories removed');
        },
        function(callback){
            async.forEach(categories, iterator, function (err) {
                if (err) {
                    console.log(err);
                    done();
                    callback(err, 'Insert categories');
                } else {
                    callback(null, 'Insert categories');
                }
            });
        },
        function(callback){
            p_client.collection("products", function (err, collection) {
                actual_collection = collection;
            });
            callback(null, 'Get products collection');
        },
        function(callback){
            actual_collection.remove();
            console.log("Products removed");
            callback(null, 'Products removed');
        },
        function(callback){
            async.forEach(products, iterator, function (err) {
                if (err) {
                    console.log(err);
                    callback(err, 'Insert products');
                } else {
                    callback(null, 'Insert products');
                }
            });
        }
        ],
        // optional callback
        function(err, results){
            if (err) {
                console.log(err);
            }
            done(err, p_client);
        });

}

Db.connect(URI_CONNECTION, function(err, client) {
    if(err) { 
        return console.dir(err);
    }
    
    tasks(client);
});

