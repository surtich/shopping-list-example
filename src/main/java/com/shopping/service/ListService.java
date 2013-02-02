package com.shopping.service;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.shopping.list.ListDto;
import com.shopping.list.ListManager;
import com.shopping.productList.ProductListDto;
import com.shopping.productList.ProductListManager;
import com.shopping.productList.ProductListManager.ProductListInvalid;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

@Path("/list")
public class ListService {

    private static final Logger LOGGER = Logger.getLogger(ListService.class.getName());
    private final ListManager listManager = new ListManager();
    private final ProductListManager productListManager = new ProductListManager();

    @GET
    @Produces("application/json;charset=UTF-8")
    public Response getLists(@Context HttpServletRequest req) {
        com.google.appengine.api.users.UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();
        List<ListDto> findLists = listManager.findAllByUser(user.getEmail());
        String json = new Gson().toJson(findLists);
        return Response.ok().entity(json).build();
    }

    @GET
    @Path("{idList}")
    @Produces("application/json;charset=UTF-8")
    public Response getList(@PathParam("idList") Long p_idList, @Context HttpServletRequest req) {
        try {
            ListDto list = checkOperation(p_idList);
            String json = new Gson().toJson(list);
            LOGGER.info("List Loaded [" + json + "]");
            return Response.ok().entity(json).build();
        } catch (Exception e) {
            LOGGER.warning("List Loaded Error[" + e.getMessage() + "]");
            return Response.status(HttpServletResponse.SC_BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @POST
    @Produces("application/json;charset=UTF-8")
    public Response create(@FormParam("products") String jsonProducts, @Context HttpServletRequest req) throws ListServiceException {
        final ListDto list = new ListDto();
        final ProductListDto[] productsList = new Gson().fromJson(jsonProducts, ProductListDto[].class);
        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        if (user != null) {
            list.setEmailUser(user.getEmail());
        }
        list.setLastUpdated(new Date());

        try {
            /*listManager.create(list);
             for (ProductListDto productList : productsList) {
             productList.setIdList(list.getIdList());
             productListManager.create(productList);
             }*/
            listManager.create(list, productsList);
            String json = new Gson().toJson(list);
            LOGGER.info("List Created [" + json + "]");
            return Response.ok().entity(json).build();
        } catch (ListManager.ListInvalid e) {
            LOGGER.warning("List Created Error[" + e.getMessage() + "]");
            return Response.status(HttpServletResponse.SC_BAD_REQUEST).entity(e.getMessage()).build();
        } catch (ProductListInvalid e) {
            LOGGER.warning("List Created Error[" + e.getMessage() + "]");
            return Response.status(HttpServletResponse.SC_BAD_REQUEST).entity(e.getMessage()).build();
        }

    }

    @PUT
    @Path("/{idList}")
    @Produces("application/json;charset=UTF-8")
    public Response update(@PathParam("idList") Long idList, @FormParam("products") String jsonProducts, @Context HttpServletRequest req) {
        try {
            ListDto list = checkOperation(idList);
            final ProductListDto[] productsList = new Gson().fromJson(jsonProducts, ProductListDto[].class);
            list.setLastUpdated(new Date());
            listManager.update(list, productsList);
            String json = new Gson().toJson(list);
            LOGGER.info("List Updated [" + json + "]");
            return Response.ok().entity(json).build();
        } catch (Exception e) {
            LOGGER.warning("List Updated Error[" + e.getMessage() + "]");
            return Response.status(HttpServletResponse.SC_BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{idList}")
    @Produces("application/json;charset=UTF-8")
    public Response delete(@PathParam("idList") Long idList, @Context HttpServletRequest req) {
        try {
            ListDto list = checkOperation(idList);
            listManager.deleteList(list);
            LOGGER.info("List deleted idList [" + idList + "]");
            return Response.ok().build();
        } catch (ListServiceException e) {
            LOGGER.warning("List Deleted Error[" + e.getMessage() + "]");
            return Response.status(HttpServletResponse.SC_BAD_REQUEST).entity(e.getMessage()).build();
        }

    }

    private ListDto checkOperation(Long idList) throws ListServiceException {
        com.google.appengine.api.users.UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        if (user == null) {
            throw new ListServiceException("No user conected");
        } else {
            ListDto list = listManager.get(idList);
            if (list == null) {
                throw new ListServiceException("There is no list whith idList " + idList);
            } else {
                if (!list.getEmailUser().equals(user.getEmail())) {
                    throw new ListServiceException("You, " + user.getEmail() + ", are not the owner of list (idList " + idList +")");
                } else {
                    return list;
                }
            }
        }
    }
    
    @POST
    @Path("products")
    @Produces("application/json;charset=UTF-8")
    public Response getProducts(@FormParam("idProducts") String jsonIdProductsList, @Context HttpServletRequest req) {
        try {
            final Long[] idProductsList = new Gson().fromJson(jsonIdProductsList, Long[].class);
            Map<Long, ProductListDto> products = productListManager.getByLongIds(Arrays.asList(idProductsList));
            String json = new Gson().toJson(products);
            LOGGER.info("Products loaded [" + json + "]");
            return Response.ok().entity(json).build();
        } catch (Exception e) {
            LOGGER.warning("Products loaded Error[" + e.getMessage() + "]");
            return Response.status(HttpServletResponse.SC_BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @SuppressWarnings("serial")
    public class ListServiceException extends Exception {

        public ListServiceException(String msg) {
            super(msg);
        }
    }
}
