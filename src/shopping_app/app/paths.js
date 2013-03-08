exports.paths = [
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
		"method" : "POST",
		"path": "/shopping",
		"handler": require("./path/createShoppingList")
	},
	{
		"method" : "POST",
		"path": "/shopping/add/:shopping_id/product/:product_id",
		"handler": require("./path/addShoppingProduct")
	},
	{
		"method" : "DELETE",
		"path": "/shopping/remove/:shopping_id/product/:product_id",
		"handler": require("./path/removeShoppingProduct")
	},
	{
		"method" : "DELETE",
		"path": "/shopping/remove/:shopping_id",
		"handler": require("./path/removeAllShoppingProducts")
	},
	{
		"method" : "DELETE",
		"path": "/shopping/remove/purchased/:shopping_id",
		"handler": require("./path/removePurchasedProducts")
	},
	{
		"method" : "PUT",
		"path": "/shopping/purchase/:shopping_id/product/:product_id/purchased/:purchased",
		"handler": require("./path/purchaseShoppingProduct")
	},
	{
		"method" : "PUT",
		"path": "/shopping/purchase/:shopping_id/purchased/:purchased",
		"handler": require("./path/purchaseAllShoppingProducts")
	}
]