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
 
    iris.cache(false);
    iris.enableLog("localhost");

    function clearBody() {
        var irisGeneratedCode = $("#start_iris").nextAll();
        if (irisGeneratedCode !== undefined) {
            irisGeneratedCode.remove();
        }
    }
    
    
    module( "View Test", {
        setup: function() {            
            iris.notify("iris-reset");
            iris.baseUri("..");
            model.init();
            iris.welcome("/shopping/screen/welcome.js");
        },
        teardown: function () {
        model.destroy();
        //window.location.hash ="";
        clearBody();
        }
    });
    
    
    asyncTest("Test add products to the Shopping List", function() {
        var products = [];
        window.expect(1);
        iris.on(iris.AFTER_NAVIGATION ,function() {
            iris.off(iris.AFTER_NAVIGATION);
            model.service.app.getCategories(function(categories){
                model.categories = categories;
                model.service.app.getAllProducts(function(products){
                    model.products = products;
                    iris.navigate("#/categories");
                    iris.on(iris.AFTER_NAVIGATION ,function() {
                        $("input[type='checkbox']", "[id^='collapse_category']").trigger('click');
                        window.ok(model.shoppingList.getShoppingProducts().length === model.products.length, "All products are selected");
                        window.start();
                    });
                });
            });
            
        });
    })
        
    asyncTest("Test remove purchased products", function() {
        var products = [];
        window.expect(1);
        iris.on(iris.AFTER_NAVIGATION ,function() {
            iris.off(iris.AFTER_NAVIGATION);
            model.service.app.getCategories(function(categories){
                model.categories = categories;
                model.service.app.getAllProducts(function(products){
                    model.products = products;
                    iris.navigate("#/categories");
                    iris.on(iris.AFTER_NAVIGATION ,function() {
                        iris.off(iris.AFTER_NAVIGATION);
                        $("input[type='checkbox']", "[id^='collapse_category']").trigger('click');
                        iris.navigate("#/shopping");
                        iris.on(iris.AFTER_NAVIGATION ,function() {
                            $("button[data-id='buy']").first().trigger("click");
                            $("button[data-id='btn_remove_checked']").trigger("click");
                            //model.ShoppingList.prototype.removePurchased();
                            window.ok(model.shoppingList.getShoppingProducts().length === products.length - 1, "Removed 1 purchased product");
                            window.start();
                        });
                    });
                });
            });
            
        });
    }
    );
        
}(jQuery));