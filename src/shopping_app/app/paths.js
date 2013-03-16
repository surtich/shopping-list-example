exports.paths = [
	{
		"method" : "POST",
		"path": "/api/user",
		"handler": require("./path/post_user")
	},
 {
		"method" : "GET",
		"path": "/api/user",
		"handler": require("./path/get_user")
	},
 {
		"method" : "GET",
		"path": "/connected",
		"handler": require("./path/login")
	},
 {
		"method" : "GET",
		"path": "/disconnected",
		"handler": require("./path/logout")
	},
	{
		"method": "GET",
		"path": "/category",
		"handler": require("./path/category")
	},
	{
		"method": "GET",
		"path": "/category/:category_id",
		"handler": require("./path/productByCategory")
	},
	{
		"method": "GET",
		"path": "/product/:product_id",
		"handler": require("./path/productById")
	},
	{
		"method" : "GET",
		"path": "/shopping/:shopping_id",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/shoppingById")]
	},
	{
		"method" : "POST",
		"path": "/shopping",
		"handler": [require("./path/ensureAuthenticated"), require("./path/createShoppingList")]
	},
 {
		"method" : "POST",
		"path": "/shopping/clone/:shopping_id",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/shoppingClone")]
	},
	{
		"method" : "POST",
		"path": "/shopping/save",
		"handler": [require("./path/ensureAuthenticated"), require("./path/saveShoppingList")]
	},
	{
		"method" : "POST",
		"path": "/shopping/add/:shopping_id/product/:product_id",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/addShoppingProduct")]
	},
	{
		"method" : "DELETE",
		"path": "/shopping/:shopping_id",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/shoppingRemove")]
	},
	{
		"method" : "DELETE",
		"path": "/shopping/remove/:shopping_id/product/:product_id",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/removeShoppingProduct")]
	},
	{
		"method" : "DELETE",
		"path": "/shopping/remove/:shopping_id",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/removeAllShoppingProducts")]
	},
	{
		"method" : "DELETE",
		"path": "/shopping/remove/purchased/:shopping_id",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/removePurchasedProducts")]
	},
	{
		"method" : "PUT",
		"path": "/shopping/purchase/:shopping_id/product/:product_id/purchased/:purchased",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/purchaseShoppingProduct")]
	},
	{
		"method" : "PUT",
		"path": "/shopping/purchase/:shopping_id/purchased/:purchased",
		"handler": [require("./path/ensureAuthenticated"), require("./path/checkOwner"), require("./path/purchaseAllShoppingProducts")]
	},
 {
		"method": "GET",
		"path": "/shoppings",
		"handler": [require("./path/ensureAuthenticated"), require("./path/shoppingsByUser")]
	}
]