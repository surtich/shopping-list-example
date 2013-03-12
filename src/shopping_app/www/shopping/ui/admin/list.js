iris.ui(function(self) {	
    var list = {};
    
    function _inflate() {
        if (list.actual) {
            if (!list.idList) {
                self.get("btn_create").html("<i class=\"icon-folder-open icon-white\"></i>" + iris.translate("ACTIONS.SAVE")).show();
                self.get("btn_remove").hide();
            } else {
                self.get("btn_create").html("<i class=\"icon-folder-open icon-white\"></i>" + iris.translate("ACTIONS.CREATE_NEW")).show();
                self.get("btn_remove").show();
            }
            self.get("btn_load").hide();
        } else {
            self.get("btn_create").hide();
            self.get("btn_load").show();
        }
        
        self.get("btn_save").toggle(list.actual && list.idList != null);
        self.get("actual").toggle(list.actual);
        //self.get("btn_save").toggleClass("disabled", model.shoppingList.getUpdated()).prop("disabled", model.shoppingList.getUpdated());
        var lastUpdated = list.lastUpdated;
        if (lastUpdated) {
            self.get("last_updated").text(iris.translate("UPDATED") + ": " + lastUpdated);
        }
        
        var proportion = 0;
        if (list.numProducts > 0) {
            proportion = 100 * list.numPurchased / list.numProducts;
        }
        
        self.get("progress_numeric").text(list.numPurchased + "/" + list.numProducts);
        self.get("progress_slider").css("width", proportion + "%");
        self.get("progress_link").css("left", proportion + "%");
    }
    
    
    
    self.create = function() {
        self.tmpl(iris.path.ui.list.html);
        //iris.on(model.event.ADMIN.CHANGE_STATE, _changeState);
        
        
        self.get("btn_create").click(function() {
            iris.notify(model.event.ADMIN.CHANGE_STATE, {
                "event" : model.event.ADMIN.CREATED_LIST,
                "ui": self
            });
        });
        
        self.get("btn_save").click(function() {
            iris.notify(model.event.ADMIN.CHANGE_STATE, {
                "event" : model.event.ADMIN.UPDATED_LIST,
                "ui": self
            });
        });
        
        self.get("btn_remove").click(function() {
            iris.notify(model.event.ADMIN.CHANGE_STATE, {
                "event" : model.event.ADMIN.REMOVED_LIST,
                "ui": self
            });
        });
        
        self.get("btn_load").click(function() {
            iris.notify(model.event.ADMIN.CHANGE_STATE, {
                "event" : model.event.ADMIN.LOADED_LIST,
                "ui": self
            });
        });
    };
    self.awake = function() {
        list = self.setting("list");
        if (list.actual) {
            //list.numProducts = model.shoppingList.getShoppingProducts().length;
            //list.numPurchased = model.shoppingList.countPurchased();
        }
        _inflate();
    };
    
    function _changeState(params) {
        if (params.ui === self) {
            if (params.event === model.event.ADMIN.CREATED_LIST) {
                if (!list.idList) {
                    _refresh(model.resource.app.createList, model.event.ADMIN.CREATED_LIST, true); 
                } else {
                    if (model.shoppingList.getUpdated()) {
                        iris.notify(model.event.SHOPPING.UNCHECK_ALL);        
                    }
                    
                    if (! model.shoppingList.getUpdated()) {
                        _refresh(model.resource.app.getList, null, false, list.idList);
                    } else {
                        list.actual = false;
                        _inflate();
                    }
                    iris.notify(model.event.ADMIN.REMOVED_LIST, {
                        resetModel: true
                    });
                    
                    (self.setting("createNew"))();
                }
            } else if (params.event === model.event.ADMIN.UPDATED_LIST) {
                _refresh(model.resource.app.updateList, model.event.ADMIN.UPDATED_LIST, true);
            } else if (params.event === model.event.ADMIN.REMOVED_LIST) {
                model.resource.app.removeList(list.idList, function() {
                    iris.notify(model.event.ADMIN.REMOVED_LIST, {
                        resetModel: true,
                        ui:self
                    });
                    if (list.actual) {
                        iris.notify(model.event.ADMIN.REMOVED_LIST, {
                            resetModel: true
                        });
                        (self.setting("createNew"))();
                        list.actual = false;
                    }
                }, function (e) {
                    throw e;
                });
            } else if (params.event === model.event.ADMIN.LOADED_LIST) {
                list.actual = true;
                iris.notify(model.event.ADMIN.LOADED_LIST, list);
                _inflate();
            }
        } else {
            if (params.event === model.event.ADMIN.LOADED_LIST) {
                if (list.actual === true) {
                    if (!list.idList) {
                        iris.notify(model.event.ADMIN.REMOVED_LIST, {
                            resetModel: false,
                            ui:self
                        });
                    } else {
                        if (! model.shoppingList.getUpdated()) {
                            _refresh(model.resource.app.getList, null, false, list.idList);
                        } else {
                            list.actual = false;
                            _inflate();
                        }
                    }
                }
            }
        }
    }
    
    function _refresh(resource, event, actual, idList) {
        (resource)(function(l) {
            if (event !== undefined) {
                iris.notify(event, l); 
            }
            list = l;
            if (list._id) {                
                list.idList = list._id;
            }
            list.actual = actual;
            if (actual) {
                list.numProducts = model.shoppingList.getShoppingProducts().length;
                list.numPurchased = model.shoppingList.countPurchased();
            } else {
                list.numProducts = list.hasOwnProperty("products") ? list.productsList.length : 0;
            }
            self.setting("list", list);
            _inflate();
        }, function (e) {
            throw e;
        }, idList);
    }
    
}, iris.path.ui.list.js);  