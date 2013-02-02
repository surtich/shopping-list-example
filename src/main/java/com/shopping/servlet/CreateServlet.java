package com.shopping.servlet;

import com.igzcode.java.gae.configuration.ConfigurationManager.InvalidConfigurationException;
import com.igzcode.java.gae.util.ConfigUtil;
import java.io.IOException;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class CreateServlet extends HttpServlet {

    private static final String CONFIG_KEY_CREATED = "APP_CREATED";

    public static void createApp() {
        try {
            ConfigUtil config = ConfigUtil.getInstance();
            //
            // Set the application as created
            //
            config.save(CONFIG_KEY_CREATED, new Date().toString());

        } catch (InvalidConfigurationException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        if (ConfigUtil.getInstance().getValue(CONFIG_KEY_CREATED) == null) {
            createApp();
        } else {
            resp.getWriter().println("WARNING: The application has been created before. You must remove " + CONFIG_KEY_CREATED + " entity from ConfigurationDto to create again.");
        }
    }
}
