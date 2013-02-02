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
    
    
    module( "Model Test", {
        setup: function() {
            model.init();
            iris.baseUri("..");
        },
        teardown: function () {
            model.destroy();
            clearBody();
        }
    });
    
    test("Test addShoppingProduct() method", function() {
        model.shoppingList.addShoppingProduct({
            "idProduct":1 , 
            "nameProduct":"Carrots"
        });
        model.shoppingList.addShoppingProduct({
            "idProduct":15 , 
            "nameProduct":"Bacon"
        });
        window.ok(model.shoppingList.getShoppingProducts().length === 2, "Two Prodcuts added to the Shopping List");
    }
    );
        
    test("Test removeShoppingProduct() method", function() {
        model.shoppingList.addShoppingProduct({
            "idProduct":1 , 
            "nameProduct":"Carrots"
        });
        model.shoppingList.addShoppingProduct({
            "idProduct":15 , 
            "nameProduct":"Bacon"
        });
        
        model.shoppingList.removeShoppingProduct(1);
        model.shoppingList.removeShoppingProduct(20);
        
        window.ok(model.shoppingList.getShoppingProducts().length === 1, "One product removed from the Shopping List");
    }
    );
        
    test("Test getShoppingProduct() method", function() {
        model.shoppingList.addShoppingProduct({
            "idProduct":1 , 
            "nameProduct":"Carrots"
        });
        model.shoppingList.addShoppingProduct({
            "idProduct":15 , 
            "nameProduct":"Bacon"
        });
        
        
        window.ok(model.shoppingList.getShoppingProduct(15).nameProduct === "Bacon", "Bacon product retrieved from the Shoppiing List");
        window.ok(model.shoppingList.getShoppingProduct(20) === null, "The idProduct 20 is not in the Shopping List");
    }
    );
        
    test("Test changeStateShoppingProduct() method", function() {
        model.shoppingList.addShoppingProduct({
            "idProduct":1 , 
            "nameProduct":"Carrots"
        });
        model.shoppingList.addShoppingProduct({
            "idProduct":15 , 
            "nameProduct":"Bacon"
        });
        
        model.shoppingList.changeStateShoppingProduct(15);
        
        window.ok(model.shoppingList.getShoppingProduct(15).purchased === true, "Bacon has been purchased");
        
        model.shoppingList.changeStateShoppingProduct(15);
        
        window.ok(model.shoppingList.getShoppingProduct(15).purchased === false, "Bacon has not been purchased");
    }
    );
        
    

    asyncTest("Test getCategories() Method", function() {
        window.expect(1);
        model.service.app.getCategories(
            function(categories) {
                window.ok(categories.length === 4, "Categories retrieved");
                window.start();
            }
            );
    }
    );
        
    asyncTest("Test getProducts() Method", function() {
        window.expect(1);
        model.service.app.getAllProducts(
            function(products) {
                window.ok(products.length === 28, "Products retrieved");
                window.start();
            }
            ),function(request, status, error) {
                    console.log(error);
            };
    }
    );

    
}(jQuery));