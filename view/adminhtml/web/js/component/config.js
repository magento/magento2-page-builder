/**
 * - Config.js
 * Handles retrieve the configuration from the server
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['jquery', 'bluefoot/utils/ajax', 'bluefoot/utils/persistence'], function (jQuery, AjaxClass, persistence) {

    /**
     * The initial config before the Ajax request
     *
     * @type {{}}
     * @private
     */
    var _initConfig = {};

    /**
     * Cache the config within this module
     *
     * @type {boolean}
     * @private
     */
    var _config = {};

    /**
     * Store all the fields in a cache so we don't have to re-generate them
     *
     * @type {boolean}
     * @private
     */
    var _allFields = false;

    return {

        /**
         * Set the initial config
         *
         * @param config
         */
        setInitConfig: function (config) {
            _initConfig = config;
        },

        /**
         * Return the initial config
         *
         * @returns {{}}
         */
        getInitConfig: function (key) {
            if (key) {
                if (typeof _initConfig[key] !== 'undefined') {
                    return _initConfig[key];
                }
                return null;
            }
            return _initConfig;
        },

        /**
         * Load in entities
         *
         * @param entityIds
         * @param storeId
         * @param callback
         */
        loadEntities: function (entityIds, storeId, callback) {
            if (typeof _config['entities'] === 'undefined') {
                _config['entities'] = {};
            }

            storeId = storeId || this.getStoreId();

            // Include the Ajax Class
            var Ajax = new AjaxClass(this.getInitConfig('formkey'));
            Ajax.post(this.getInitConfig('config_url'), {entityIds: entityIds, storeId: storeId}, function (data) {
                jQuery.extend(_config['entities'], data);

                if (typeof callback === 'function') {
                    callback(_config);
                }
            }.bind(this), false, function () {
                alert('can\'t load entities');
            });
        },

        /**
         * Retrieve an entity from the configuration
         *
         * @param entityId
         * @returns {*}
         */
        getEntity: function (entityId) {
            if (typeof _config['entities'][entityId] !== 'undefined') {
                return _config['entities'][entityId];
            }
        },

        /**
         * Return a content types configuration from the config
         *
         * @param type
         * @returns {*}
         */
        getContentTypeConfig: function (type) {
            if (typeof _initConfig.contentTypes === 'object' && typeof _initConfig.contentTypes[type] === 'object') {
                return _initConfig.contentTypes[type];
            }

            return false;
        },

        /**
         * Retrieve the previously built configuration
         *
         * @returns {boolean}
         */
        getConfig: function () {
            return _config;
        },

        /**
         * Return a value from the config
         *
         * @param key
         * @returns {*}
         */
        getValue: function (key) {
            if (typeof _config[key] !== 'undefined') {
                return _config[key];
            }
            if (typeof this.getInitConfig()[key] !== 'undefined') {
                return this.getInitConfig()[key];
            }
            return null;
        },

        /**
         * Deletes a value from the config providing you know the config key, the item key and the value to check for
         *
         * @param key
         * @param valueKey
         * @param value
         */
        deleteValue: function (key, valueKey, value) {
            var arr = [];
            _config[key].forEach(function (item) {
                if (item[valueKey] != value) {
                    arr.push(item);
                }
            });
            _config[key] = arr;
        },

        /**
         * Add to a config setting array without having to rebuild config.
         * @param key
         * @param values (array)
         */
        mergeValues: function (key, values) {
            _config[key] = _config[key].concat(values);
        },

        /**
         * Update a value in the tempalates array
         * @param matchKey
         * @param matchValue
         * @param newValueKey
         * @param newValue
         */
        updateTemplateValue: function (matchKey, matchValue, newValueKey, newValue) {
            var arr = [];
            _config['templates'].forEach(function (item) {
                if (item[matchKey] === matchValue) {
                    item[newValueKey] = newValue;
                }
                arr.push(item);
            });
            _config['templates'] = arr;
        },

        /**
         * Plugins can have config values declared inside their JSON
         *
         * @param plugin
         * @param key
         * @returns {*}
         */
        getPluginConfig: function (plugin, key) {
            var config = _initConfig;
            if (typeof config.plugins[plugin] !== 'undefined' && typeof config.plugins[plugin]['config'] !== 'undefined' && typeof config.plugins[plugin]['config'][key] !== 'undefined') {
                return config.plugins[plugin]['config'][key];
            }

            return null;
        },

        /**
         * Return all fields available in the system
         *
         * @returns {{}}
         */
        getAllFields: function () {
            if (_allFields !== false) {
                return _allFields;
            }

            _allFields = {};
            jQuery.each(_initConfig.contentTypes, function (index, element) {
                if (typeof element.fields === 'object') {
                    jQuery.extend(_allFields, element.fields);
                }
            });

            // Include global fields in all fields
            if (this.getValue('globalFields')) {
                jQuery.extend(_allFields, this.getValue('globalFields'));
            }

            return _allFields;
        },

        /**
         * Return an individual fields data
         *
         * @param key
         * @returns {*}
         */
        getField: function (key) {
            var fields;
            if (_allFields === false) {
                fields = this.getAllFields();
            } else {
                fields = _allFields;
            }

            if (typeof fields[key] !== 'undefined') {
                return fields[key];
            }

            return null;
        },

        /**
         * Return the form key
         *
         * @returns {*}
         */
        getFormKey: function () {
            return window.FORM_KEY;
        },

        /**
         * Reset the configuration
         */
        resetConfig: function () {
            _config = {};
        },

        /**
         * Retrieve the store ID
         * @returns {*}
         */
        getStoreId: function () {
            if (jQuery('#store_switcher').length > 0) {
                return jQuery('#store_switcher').val();
            }
        },

        /**
         * Add a form to the configuration
         *
         * @param key
         * @param data
         */
        addForm: function (key, data) {
            if (this.getInitConfig('edit_panel_cache')) {
                if (this.getInitConfig('edit_panel_cache_key') !== localStorage.getItem('bluefoot-edit-key')) {
                    this.invalidateLocalStorage();
                }
                persistence.setItem('bluefoot-edit-' + key, data);
            } else {
                if (typeof _config['forms'] === 'undefined') {
                    _config['forms'] = {};
                }
                _config['forms'][key] = data;
            }
        },

        /**
         * Try and load a form from the config
         *
         * @param key
         * @returns {*}
         */
        loadForm: function (key) {
            if (this.getInitConfig('edit_panel_cache')) {
                if (this.getInitConfig('edit_panel_cache_key') !== localStorage.getItem('bluefoot-edit-key')) {
                    this.invalidateLocalStorage();
                }
                return persistence.getItem('bluefoot-edit-' + key);
            } else {
                if (key && typeof _config['forms'] !== 'undefined' && typeof _config['forms'][key] !== 'undefined') {
                    return _config['forms'][key];
                }
            }

            return null;
        },

        /**
         * Invalidate the localStorage cache
         */
        invalidateLocalStorage: function () {
            var cachePrefix = 'bluefoot-edit-';
            persistence.keys()
                .forEach(function(key) {
                    if (key.substring(0, cachePrefix.length) == cachePrefix) {
                        localStorage.removeItem(key);
                    }
                });

            persistence.setItem('bluefoot-edit-key', this.getInitConfig('edit_panel_cache_key'));
        },

        /**
         * Return a column definition based on the class name
         *
         * @param className
         * @returns {*}
         */
        getColumnDefinitionByClassName: function (className) {
            var search = jQuery.grep(this.getInitConfig('column_definitions'), function (columnDef) {
                return className == columnDef.className;
            });
            if (search.length > 0) {
                return search[0];
            }

            return null;
        },

        /**
         * Return a column definition based on a breakpoint
         *
         * @param breakpoint
         * @returns {*}
         */
        getColumnDefinitionByBreakpoint: function (breakpoint) {
            var search = jQuery.grep(this.getInitConfig('column_definitions'), function (columnDef) {
                return breakpoint == columnDef.breakpoint;
            });
            if (search.length > 0) {
                return search[0];
            }

            return null;
        }
    };
});
