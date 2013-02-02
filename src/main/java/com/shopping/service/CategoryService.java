package com.shopping.service;

import com.google.gson.Gson;
import com.shopping.category.CategoryDto;
import com.shopping.category.CategoryManager;
import java.util.List;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

@Path("/category")
public class CategoryService {

    private static final Logger LOGGER = Logger.getLogger(CategoryService.class.getName());
    private final CategoryManager categoryManager = new CategoryManager();

    @GET
    @Produces("application/json;charset=UTF-8")
    public Response findAll(@Context HttpServletRequest p_request) {
        List<CategoryDto> findAll = categoryManager.findAll();
        String json = new Gson().toJson(findAll);
        return Response.ok().entity(json).build();
    
    }
}
