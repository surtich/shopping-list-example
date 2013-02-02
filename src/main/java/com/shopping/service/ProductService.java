package com.shopping.service;

import com.google.gson.Gson;
import com.shopping.list.ListDto;
import com.shopping.product.ProductDto;
import com.shopping.product.ProductManager;
import com.shopping.productList.ProductListDto;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

@Path("/product")
public class ProductService {

    private static final Logger LOGGER = Logger.getLogger(ProductService.class.getName());
    private final ProductManager productManager = new ProductManager();

    @GET
    @Produces("application/json;charset=UTF-8")
    public Response findAll(@Context HttpServletRequest p_request) {
        List<ProductDto> findAll = productManager.findAll();
        String json = new Gson().toJson(findAll);
        return Response.ok().entity(json).build();
    }

    @GET
    @Path("{idCategory}")
    @Produces("application/json;charset=UTF-8")
    public Response getProducts(@PathParam("idCategory") Long p_idCategory, @Context HttpServletRequest req) {
        List<ProductDto> findProducts = productManager.findAllByCategory(p_idCategory);
        String json = new Gson().toJson(findProducts);
        return Response.ok().entity(json).build();
    }
    
    @POST
    @Produces("application/json;charset=UTF-8")
    public Response getProducts(@FormParam("productsList") String jsonIdProducts, @Context HttpServletRequest req) {
        try {
            final Long[] idProducts = new Gson().fromJson(jsonIdProducts, Long[].class);
            Map<Long, ProductDto> products = productManager.getByLongIds(Arrays.asList(idProducts));
            String json = new Gson().toJson(products);
            LOGGER.info("Products loaded [" + json + "]");
            return Response.ok().entity(json).build();
        } catch (Exception e) {
            LOGGER.warning("Products loaded Error[" + e.getMessage() + "]");
            return Response.status(HttpServletResponse.SC_BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
}
