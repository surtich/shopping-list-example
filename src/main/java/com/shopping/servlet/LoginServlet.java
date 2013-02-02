package com.shopping.servlet;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet {

    protected static final Logger logger = Logger.getLogger(LoginServlet.class.getName());

    public void doGet(HttpServletRequest p_request, HttpServletResponse p_response) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest) p_request;
        HttpServletResponse response = (HttpServletResponse) p_response;
        
        String next = request.getParameter("next");
        
        if (next == null) {
            next = request.getRequestURI();
        }

        UserService userService = UserServiceFactory.getUserService();

        response.sendRedirect(userService.createLoginURL(next));

    }
}
