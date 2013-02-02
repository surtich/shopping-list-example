package com.shopping.service;

import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

@Path("/login")
public class UserService {

    private static final Logger LOGGER = Logger.getLogger(UserService.class.getName());

    @GET
    @Produces("application/json;charset=UTF-8")
    public Response login(@Context HttpServletRequest p_request) {
        com.google.appengine.api.users.UserService userService = UserServiceFactory.getUserService();
        try {
            return Response.seeOther(new URI(userService.createLoginURL(p_request.getRequestURI()))).build();
        } catch (URISyntaxException ex) {
            Logger.getLogger(UserService.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }

    @GET
    @Path("is_conected")
    @Produces("application/json;charset=UTF-8")
    public Response isConected(@Context HttpServletRequest p_request) {
        com.google.appengine.api.users.UserService userService = UserServiceFactory.getUserService();
        return Response.ok().entity("{\"isConected\":" + userService.isUserLoggedIn() + "}").build();
    }
}
