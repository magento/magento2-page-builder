/**
 * - Plugins.js
 * Handles loading and other things to do with plugins
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/hook', 'bluefoot/cms-config'], function (Hook, InitConfig) {

    /**
     * Store our plugins within this module
     *
     * @type {{}}
     */
    var plugins = {};

    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function() {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function(obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

    return {

        /**
         * Prepare the plugin system
         *
         * This retrieves the plugins object from the InitConfig (which is placed upon the init.phtml page) and iterates
         * through all the plugins and declares their paths within RequireJS. This also populates the plugins object
         *
         * @returns {{}}
         */
        prepare: function (callbackFn) {
            Hook.trigger('gene-bluefoot-plugins-prepare-before', {plugins: plugins});

            // Are there JS plugins to be loaded?
            if (typeof InitConfig.plugins === 'object') {
                var configPaths = {};
                for (var pluginsKey in InitConfig.plugins) {
                    if (!InitConfig.plugins.hasOwnProperty(pluginsKey)) continue;

                    var plugins = InitConfig.plugins[pluginsKey];
                    for (var name in plugins) {
                        if (!plugins.hasOwnProperty(name)) continue;

                        var plugin = plugins[name];

                        // Ignore any config parameters in the plugins section
                        if (name == 'config') {
                            continue;
                        }
                        if (typeof plugin.alias !== 'undefined' && typeof plugin.path !== 'undefined') {
                            configPaths[plugin.alias] = plugin.path;
                            plugins[plugin.alias] = plugin;
                        }
                    }
                }

                // Declare any aliased modules
                if (!this._isObjectEmpty(configPaths)) {
                    Hook.trigger('gene-bluefoot-plugins-prepare-paths', {configPaths: configPaths});

                    require.config({
                        paths: configPaths
                    });
                }
            }

            Hook.trigger('gene-bluefoot-plugins-prepare-after', {plugins: plugins});

            // Prepare jQuery
            this.preparejQuery();
            this.prepareAsync();

            if (typeof callbackFn === 'function') {
                return callbackFn();
            }
        },

        /**
         * Prepare jQuery
         */
        preparejQuery: function () {

            // Work out the jQuery dependencies
            var deps = ['jquery', 'bluefoot/jquery/ui'];
            var shim = {};
            if (typeof InitConfig.plugins['jquery'] !== 'undefined') {
                for (var key in InitConfig.plugins['jquery']) {
                    if (!InitConfig.plugins['jquery'].hasOwnProperty(key)) continue;

                    var jQueryPlugin = InitConfig.plugins['jquery'][key];
                    if (jQueryPlugin.alias !== 'undefined') {
                        deps.push(jQueryPlugin.alias);

                        var shimDeps = ['jquery'];
                        if (typeof jQueryPlugin.deps !== 'undefined') {
                            for (var jQueryDep in jQueryPlugin.deps) {
                                if (!jQueryPlugin.deps.hasOwnProperty(jQueryDep)) continue;

                                shimDeps.push(jQueryPlugin.deps[jQueryDep]);
                            }
                        }
                        shim[jQueryPlugin.alias] = {
                            deps: shimDeps
                        };
                    }
                }
            }

            // Add any shim elements into the require JS configuration
            if (!this._isObjectEmpty(shim)) {
                require.config({
                    shim: shim
                });
            }

            // Define a noConflict version of jQuery
            define('bluefoot/jquery', deps, function (jQuery, jQueryUi) {
                return jQuery.noConflict(true);
            });
        },

        /**
         * Require any Async plugins
         */
        prepareAsync: function () {
            if (typeof InitConfig.plugins['async'] !== 'undefined') {
                for (var key in InitConfig.plugins['async']) {
                    if (!InitConfig.plugins['async'].hasOwnProperty(key)) continue;

                    var plugin = InitConfig.plugins['async'][key];
                    if (typeof plugin.path !== 'undefined') {
                        require(['bluefoot/async!' + plugin.path]);
                    }
                }
            }
        },

        /**
         * Determine if an object is empty
         *
         * @param object
         * @returns {boolean}
         * @private
         */
        _isObjectEmpty: function (object) {
            for(var prop in object) {
                if(object.hasOwnProperty(prop))
                    return false;
            }

            return true && JSON.stringify(object) === JSON.stringify({});
        },

        /**
         * Load plugins
         *
         * This loads all plugins associated with a particular type. A type is an action within the systems initialization
         * when a plugin can be initialized itself
         *
         * @param type
         * @param stage
         * @param callbackFn
         */
        load: function (type, callbackFn, stage) {
            var loadPlugins = [];
            for (var alias in plugins) {
                if (!plugins.hasOwnProperty(alias)) continue;

                var plugin = plugins[alias];
                if (typeof plugin.load !== 'undefined' && plugin.load == type && !plugin.loaded) {
                    loadPlugins.push(alias);
                }
            }

            // Handle types that contain no plugins
            if (loadPlugins.length) {

                // Required plugins
                require(loadPlugins, function () {
                    // Pass the instance of the plugin into the plugins object
                    for (var index in arguments) {
                        if (!arguments.hasOwnProperty(index)) continue;

                        var instance = arguments[index];
                        var alias = loadPlugins[index];
                        plugins[alias].instance = instance;
                        if (stage && typeof instance.init === 'function') {
                            instance.init(stage);
                        }
                    }

                    // Fire the callback to let the system know every plugin has been loaded
                    callbackFn();
                });

            } else {
                callbackFn();
            }
        },

        /**
         * Return the instance of a plugin
         *
         * @param alias
         * @returns {*|o}
         */
        getInstance: function (alias) {
            if (typeof plugins[alias] !== 'undefined') {
                return plugins[alias].instance;
            }
        }
    }
});