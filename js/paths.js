/*global requirejs, define*/

define(function () {

    'use strict';

    var config = {

        paths: {
            'fx-cat-br/controllers': './controllers',
            'fx-cat-br/html': '../html',
            'fx-cat-br/js': './',
            'fx-cat-br/json': '../json',
            'fx-cat-br/plugins': './widgets/bridge/plugins',
            'fx-cat-br/structures': 'structures',
            'fx-cat-br/start': './start',
            'fx-cat-br/utils': './utils',
            'fx-cat-br/widgets': './widgets',

            'fx-cat-br/config': '../config',

            //Third party libs
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            'draggabilly': '{FENIX_CDN}/js/draggabilly/dist/draggabilly.pkgd.min',
            'intro': '{FENIX_CDN}/js/introjs/1.0.0/intro',
            'isotope': '{FENIX_CDN}/js/isotope/2.1.0/dist/isotope.pkgd.min',
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'jqwidgets': '{FENIX_CDN}/js/jqwidgets/3.1/jqx-light',
            'jstree': '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
            'nprogress': '{FENIX_CDN}/js/nprogress/0.1.6/nprogress',
            'handlebars': "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
            'packery': '{FENIX_CDN}/js/packery/1.4.3/dist/packery.pkgd.min',
            'pnotify': '{FENIX_CDN}/js/pnotify/2.0.1/pnotify.core',
            'q' : '{FENIX_CDN}/js/q/1.1.2/q'
        },
        shim: {
            'bootstrap': {
                deps: ['jquery']
            },
            shim: {
                "amplify": {
                    deps: ["jquery"],
                    exports: "amplify"
                }
            }
        }
    };

    return config;
});