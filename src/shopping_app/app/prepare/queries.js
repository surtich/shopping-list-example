print("Search products by category");
var category_id = 1;
db.products.find({
 category_id: category_id
});

print("Search products by name");
var regExp = /as/i;
db.products.find({
 name: regExp
});

print("Count products by category");

db.products.group({
 key: {
  category_id: true
 },
 initial: {
  products: 0
 },
 reduce: function (doc, aggregator) {
  aggregator.products += 1;
 }
});

print("Purchase a product");


var find = {
 "_id" : ObjectId("5138922dfb4bfbc23400001d"),
 "products.product_id": 1
};

var set = {
 $set: {
  "products.$.purchased": true
 }
}

db.shoppings.update(find, set);

print("List Shoppings");

map = function() {
 emit(this._id, {
  products_count: 0
 });
};

reduce = function(key, values) {
 var products = 0;
 values.forEach(function(value) {
  products += value.products.count;
 });
 return {
  products: products
 };
}

