/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:shopphing_properties.json>',
        meta: {
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        lint: {
            files: ['*.js', 'node_files/**/*.js', 'client_files/shopping/**/*.js', 'client_files/js/init.js', 'client_files/js/shopping_list.js']
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint qunit'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: true,
                iris: true,
                $: true,
                model: true,
                require: true,
                console: true,
                __dirname: true,
                routes: true,
                module: true,
                process: true
            }
        },
        uglify: {},
        server: {
            port: 8080,
            base: '.'
        }
    });

    grunt.registerTask('server', 'Start a shoppinglist server', function() {
        var server = require('./app');
    });
  
    grunt.registerTask('populate', 'Populate de database with initial data', function() {
        var server = require('./preload');
    });
    
    grunt.registerTask('preload', 'lint populate watch');

    // Default task.
    grunt.registerTask('default', 'lint server watch');
};
