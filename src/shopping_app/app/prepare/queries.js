print("Search products by category");
var category_id = 1;
db.products.find({category_id: category_id});

print("Search products by name");
var regExp = /as/i;
db.products.find({name: regExp});

print("Count products by category");

db.products.group({
 key: {category_id: true},
 initial: {products: 0},
 reduce: function (doc, aggregator) {
  aggregator.products += 1;
 },
 finalice: function(doc) {
  doc.cat =db.catfindOne()
 }
});
