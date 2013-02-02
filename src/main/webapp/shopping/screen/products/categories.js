iris.screen(
    function (self) {
        
        function _inflate(categories, products) {
            $.each(categories,
                function(index, category) {						
                    self.ui("list_categories", iris.path.ui.category_list_item.js, {
                        "category": category,
                        "products": products
                    });
                }
                );
        }
        
        self.create = function () {
            self.tmpl(iris.path.screen.categories.html);
            model.init(false, function(){
                _inflate(model.categories, model.products); 
            });
            
        };
        
        
    }, iris.path.screen.categories.js);