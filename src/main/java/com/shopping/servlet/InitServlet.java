package com.shopping.servlet;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Ref;
import com.igzcode.java.gae.configuration.ConfigurationDto;
import com.igzcode.java.gae.util.ConfigUtil;
import com.shopping.category.CategoryDto;
import com.shopping.category.CategoryManager;
import com.shopping.list.ListDto;
import com.shopping.product.ProductDto;
import com.shopping.product.ProductManager;
import com.shopping.productList.ProductListDto;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class InitServlet extends HttpServlet {

    /**
     * Es estática para que pueda ser invocada desde los test unitarios
     */
    public static void initApp() {

        ObjectifyService.register(ConfigurationDto.class);
        ObjectifyService.register(CategoryDto.class);
        ObjectifyService.register(ProductDto.class);
        ObjectifyService.register(ListDto.class);
        ObjectifyService.register(ProductListDto.class);

        ConfigUtil config = ConfigUtil.getInstance();
        config.init();

        //
        // Si se inicia la aplicación en desarrollo se rellena el datastore 
        // con los datos básicos que necesita la aplicación para funcionar
        //
        if (config.isDev()) {
            CreateServlet.createApp();
        }

    }

    @Override
    public void init() throws ServletException {

        initApp();

        //
        // Si estamos en desarrollo se inicia la aplicación con datos de prueba
        //
        if (ConfigUtil.getInstance().isDev()) {

            createDevTestData();
        }
    }

    private void createDevTestData() {

        CategoryManager categoryM = new CategoryManager();
        ProductManager productM = new ProductManager();

        String[] products1 = {"Carrots", "Cucumbers", "Onions", "Spinach", "Tomatoes"};
        createCategory("Vegetables", products1, categoryM, productM);

        String[] products2 = {"Apples", "Bananas", "Grapes", "Kiwis", "Lemons", "Melon", "Oranges", "Peaches", "Plums"};
        createCategory("Fruits", products2, categoryM, productM);

        String[] products3 = {"Bacon", "Beef", "Chicken", "Turkey", "Pork", "Hot dogs"};
        createCategory("Meat", products3, categoryM, productM);

        String[] products4 = {"Catfish", "Crab", "Lobster", "Mussels", "Oysters", "Salmon", "Tilapia", "Tuna"};
        createCategory("Seafood", products4, categoryM, productM);

    }

    private void createCategory(String categoryName, String[] productNames, CategoryManager categoryManager, ProductManager productManager) {
        CategoryDto category = new CategoryDto();
        category.setNameCategory(categoryName);
        categoryManager.save(category);

        for (int i = 0; i < productNames.length; i++) {
            ProductDto product = new ProductDto();
            product.setNameProduct(productNames[i]);
            product.setCategory(category.getIdCategory());
            productManager.save(product);
        }
    }

    /**
     * Refresca las variables de configuración según lo que se establezca en el
     * datastore
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ConfigUtil config = ConfigUtil.getInstance();
        config.loadValuesFromDatastore();
        resp.getWriter().println("Configuration values has been loaded from datastore correctly.");
    }
}
