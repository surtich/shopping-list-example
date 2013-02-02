iris.ui(function(self) {	
    
    function _inflate(category, products) {
        $.each(products,
            function(index, product) {
                if (category.idCategory === product.category) {
                    self.ui("list_products", iris.path.ui.product_list_item.js, {
                        "product": product
                    });
                }
            }
            );
    }
    
    self.create = function() {
        self.tmplMode(self.APPEND);
        var category = self.setting("category");
        self.tmpl(iris.path.ui.category_list_item.html, category);
        _inflate(category, self.setting("products"));
    };	
    
}, iris.path.ui.category_list_item.js);