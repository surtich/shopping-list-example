package com.shopping.filter;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This filter covers all calls to /s/* where services are listening. All call
 * to /s/* NEED a user in session.
 *
 */
public class ServiceFilter implements Filter {

    protected static final Logger logger = Logger.getLogger(ServiceFilter.class.getName());
    private FilterConfig filterConfig;

    @Override
    public void doFilter(ServletRequest p_request, ServletResponse p_response, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) p_request;
        HttpServletResponse response = (HttpServletResponse) p_response;

        UserService userService = UserServiceFactory.getUserService();
        User user = userService.getCurrentUser();

        if (user != null) {
            filterChain.doFilter(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "You must be logged to perform this action");
        }

    }

    public FilterConfig getFilterConfig() {
        return this.filterConfig;
    }

    @Override
    public void init(FilterConfig filterConfig) {
        this.filterConfig = filterConfig;
    }

    @Override
    public void destroy() {
        this.filterConfig = null;
    }
}