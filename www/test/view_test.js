/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

    /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */
 
    function init() {
        iris.baseUri("..");
        iris.cache(false);
        iris.enableLog("localhost");
    
        iris.path = {
            screen: {
                welcome: {
                    js: "/shopping/screen/welcome.js", 
                    html: "/shopping/screen/welcome.html"
                },
                home: {
                    js: "/shopping/screen/home.js", 
                    html: "/shopping/screen/home.html"
                },
                categories: {
                    js: "/shopping/screen/products/categories.js", 
                    html: "/shopping/screen/products/categories.html"
                },                
                shopping: {
                    js: "/shopping/screen/list/shopping.js", 
                    html: "/shopping/screen/list/shopping.html"
                }
            },
            ui: {
                products: {
                    js: "/shopping/ui/products/products.js", 
                    html: "/shopping/ui/products/products.html"
                },
                product_shopping_list: {
                    js: "/shopping/ui/list/product_shopping_list.js", 
                    html: "/shopping/ui/list/product_shopping_list.html"
                }
            },
            resource: {
                js: "/shopping/resource.js"  
            }
        };
    }
    
    function clearBody() {
        var irisGeneratedCode = $("#start_iris").nextAll();
        if (irisGeneratedCode !== undefined) {
            irisGeneratedCode.remove();
        }
    }
    
    
    module( "View Test", {
        setup: function() {            
            iris.notify("iris-reset");
            init();
            iris.welcome(iris.path.screen.welcome.js);
        },
        teardown: function () {
            model.destroy();
            //window.location.hash ="";
            clearBody();
        }
    });
    
    
    asyncTest("Test add products to the Shopping List", function() {
        window.expect(1);
        iris.on(iris.AFTER_NAVIGATION ,function() {
            iris.off(iris.AFTER_NAVIGATION);
            model.init(function(){
                iris.navigate("#/categories");
                iris.on(iris.AFTER_NAVIGATION ,function() {
                    setTimeout(function() {
                        $("input[type='checkbox']", "[id^='collapse_category']").trigger('click');
                        window.ok(model.shoppingList.getShoppingProducts().length === model.products().length, "All products are selected");
                        window.start();
                    },1000);
                
                });
            });
            
        });
    });
        
    asyncTest("Test remove purchased products", function() {
        var products = [];
        window.expect(1);
        iris.on(iris.AFTER_NAVIGATION ,function() {
            iris.off(iris.AFTER_NAVIGATION);
            model.init(function(){                    
                iris.navigate("#/categories");
                iris.on(iris.AFTER_NAVIGATION ,function() {
                    iris.off(iris.AFTER_NAVIGATION);
                    setTimeout(function() {
                        $("input[type='checkbox']", "[id^='collapse_category']").trigger('click');
                        iris.navigate("#/shopping");
                        iris.on(iris.AFTER_NAVIGATION ,function() {
                            iris.off(iris.AFTER_NAVIGATION);                            
                            $("button[data-id='buy']").first().trigger("click");
                            $("button[data-id='btn_remove_checked']").trigger("click");
                            //model.ShoppingList.prototype.removePurchased();
                            window.ok(model.shoppingList.getShoppingProducts().length === model.products().length - 1, "Removed 1 purchased product");
                            window.start();
                        });
                    },1000);
                });
                
            });
            
        });
    }
    );
        
}(jQuery));