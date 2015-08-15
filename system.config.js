System.config({
    baseURL: "",
    defaultJSExtensions: true,
    transpiler: "babel",
    babelOptions: {
        moduleIds: false,
        "optional": [
            "runtime"
        ]
    },

    /* where things go */
    paths: {
        "bower/*": "bower_components/*",
        "app/*": "dist/app/*",
        "bundles/*": "dist/bundles/*",
        "npm/*": "node_modules/*"
    },
    /* configuring the location of the module and how to load it */
    meta: {
        "bower/angular/angular.js": {
            "format": "global",
            "exports": "angular"
        },
        "bower/angular-ui-router/release/angular-ui-router.js": {
            "deps": [
                "angular"
            ]
        }
    },

    /* importing modules */
    map: {
        "angular": "bower/angular/angular.js",
        "angular-ui-router": "bower/angular-ui-router/release/angular-ui-router.js",
        "babel": "npm/babel-core/",
        "babel-runtime": "npm/babel-runtime/core-js"
    }
});
