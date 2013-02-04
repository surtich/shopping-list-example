iris.screen(
    function (self) {
        
        function _removeUI(params) {    
            if (params.ui) {
                self.destroyUI(params.ui);
            }
        }
        
        function _newList() {
            self.ui("list_container", iris.path.ui.list.js, {
                list: {
                    "idList": model.shoppingList.getIdList(),
                    "lastUpdated": model.shoppingList.getLastUpdated(),
                    "actual": true
                },
                createNew: _newList
            },self.PREPEND);
        }

        function _inflate(lists) {
            var actual = false;
            $.each(lists,
                
                function(index, list) {
                    list.actual = false;
                    if (list._id) {
                        list.idList = list._id;
                    }
                    if (!actual && list.idList === model.shoppingList.getIdList()) {
                        list.actual = true;
                        actual = true;
                    }
                    list.numProducts = list.hasOwnProperty("productsList") ? list.productsList.length : 0;
                    self.ui("list_container", iris.path.ui.list.js, {
                        "list": list,
                        createNew: _newList
                        
                    },  self.APPEND);
                }
                );
            if (!actual) {
                _newList();
            }
        }
        
        
        self.create = function () {
            self.tmpl(iris.path.screen.admin.html);
            iris.on(model.event.ADMIN.REMOVED_LIST, _removeUI);
        };
        
        self.awake = function () {
            model.init(false, function(){
            
                model.resource.app.isConected(
                    function (data) {
                        if (data) {
                            self.destroyUIs("list_container");
                            model.resource.app.getLists(_inflate, function(p_request, p_textStatus, p_errorThrown) {
                                throw p_textStatus;
                            });
                        } else {
                            window.location.href = "/login";                        
                        }
                    }, function (e) {
                        throw e;
                    });
            });
        };
        
        self.destroy = function() {
            iris.off(model.event.ADMIN.REMOVED_LIST, _removeUI);
        };
        
        iris.translations("es_ES", {                
            ACTIONS: {
                CREATE_NEW: "Nuevo",
                SAVE: "Guardar",
                REMOVE: "Eliminar",
                UPDATE: "Actualizar",
                LOAD: "Cargar"
            },
            UPDATED: "Última grabación"
        });
            
        iris.translations("en_US", {          
            ACTIONS: {
                CREATE_NEW: "New",
                SAVE: "Save",
                REMOVE: "Remove",
                UPDATE: "Update",
                LOAD: "Load"
            },
            UPDATED: "Last updated"
        });

    }, iris.path.screen.admin.js);
    
    