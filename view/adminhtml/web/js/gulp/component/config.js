define(["require", "exports", "underscore", "jquery"], function (require, exports, _, jQuery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Config class
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var Config = (function () {
        function Config() {
        }
        /**
         * Set the initial config
         *
         * @param config
         */
        Config.setInitConfig = function (config) {
            Config.config = config;
        };
        /**
         * Retrieve the init config
         *
         * @param key
         * @returns {any}
         */
        Config.getInitConfig = function (key) {
            if (key) {
                if (typeof Config.initConfig[key] !== 'undefined') {
                    return Config.initConfig[key];
                }
                return null;
            }
            return Config.initConfig;
        };
        Config.loadEntities = function (entityIds, storeId, callback) {
            // @todo
        };
        /**
         * Retrieve an entity from the configuration
         *
         * @param entityId
         * @returns {any}
         */
        Config.getEntity = function (entityId) {
            if (typeof Config.config['entities'][entityId] !== 'undefined') {
                return Config.config['entities'][entityId];
            }
            return {};
        };
        /**
         * Return a content types configuration from the config
         *
         * @param type
         * @returns {any}
         */
        Config.getContentBlockConfig = function (type) {
            if (typeof Config.initConfig.contentBlocks === 'object' && typeof Config.initConfig.contentBlocks[type] === 'object') {
                return Config.initConfig.contentBlocks[type];
            }
            return {};
        };
        /**
         * Retrieve the entire config
         *
         * @returns {any}
         */
        Config.getConfig = function () {
            return Config.config;
        };
        /**
         * Get a specific value from the configuration based on a key
         *
         * @param key
         * @returns {any}
         */
        Config.getValue = function (key) {
            if (typeof Config.config[key] !== 'undefined') {
                return Config.config[key];
            }
            if (Config.getInitConfig(key)) {
                return Config.getInitConfig(key);
            }
            return null;
        };
        /**
         * Retrieve a value as a string
         *
         * @param key
         * @returns {String}
         */
        Config.getValueAsString = function (key) {
            return String(Config.getValue(key));
        };
        /**
         * Delete a value from the configuration
         *
         * @param key
         * @param valueKey
         * @param value
         */
        Config.deleteValue = function (key, valueKey, value) {
            var arr = [];
            Config.config[key].forEach(function (item) {
                if (item[valueKey] != value) {
                    arr.push(item);
                }
            });
            Config.config[key] = arr;
        };
        /**
         * Merge values into the configuration
         *
         * @param key
         * @param values
         */
        Config.mergeValue = function (key, values) {
            Config.config[key] = Config.config[key].concat(values);
        };
        /**
         * Update a value within a templates array
         *
         * @param matchKey
         * @param matchValue
         * @param newValueKey
         * @param newValue
         */
        Config.updateTemplateValue = function (matchKey, matchValue, newValueKey, newValue) {
            var arr = [];
            Config.config['templates'].forEach(function (item) {
                if (item[matchKey] === matchValue) {
                    item[newValueKey] = newValue;
                }
                arr.push(item);
            });
            Config.config['templates'] = arr;
        };
        /**
         * Retrieve a specific config value from the plugin section
         *
         * @param plugin
         * @param key
         * @returns {null}
         */
        Config.getPluginConfig = function (plugin, key) {
            var config = Config.initConfig;
            if (typeof config.plugins[plugin] !== 'undefined' && typeof config.plugins[plugin]['config'] !== 'undefined' && typeof config.plugins[plugin]['config'][key] !== 'undefined') {
                return config.plugins[plugin]['config'][key];
            }
            return null;
        };
        /**
         * Retrieve all fields stored in the configuration
         *
         * @returns {any}
         */
        Config.getAllFields = function () {
            if (Config.allFields) {
                return Config.allFields;
            }
            Config.allFields = {};
            jQuery.each(Config.initConfig.contentBlocks, function (index, element) {
                if (typeof element.fields === 'object') {
                    jQuery.extend(Config.allFields, element.fields);
                }
            });
            // Include global fields in all fields
            if (this.getValue('globalFields')) {
                jQuery.extend(Config.allFields, this.getValue('globalFields'));
            }
            return Config.allFields;
        };
        /**
         * Return an individual fields data
         *
         * @param key
         * @returns {any}
         */
        Config.getField = function (key) {
            var fields;
            if (!Config.allFields) {
                fields = Config.getAllFields();
            }
            else {
                fields = Config.allFields;
            }
            if (typeof fields[key] !== 'undefined') {
                return fields[key];
            }
            return null;
        };
        /**
         * Reset the configuration
         */
        Config.resetConfig = function () {
            Config.config = {};
        };
        /**
         * Retrieve the store ID
         *
         * @returns {any}
         */
        Config.getStoreId = function () {
            if (jQuery('#store_switcher').length > 0) {
                return jQuery('#store_switcher').val();
            }
        };
        /**
         * Return a column definition based on the class name
         *
         * @param className
         * @returns {T}
         */
        Config.getColumnDefinitionByClassName = function (className) {
            return Config.getColumnDef('className', className);
        };
        /**
         * Return a column definition based on a breakpoint
         *
         * @param breakpoint
         * @returns {T}
         */
        Config.getColumnDefinitionByBreakpoint = function (breakpoint) {
            return Config.getColumnDef('breakpoint', breakpoint);
        };
        /**
         * Retrieve a column defination based on a key value pair
         *
         * @param field
         * @param value
         * @returns {undefined|T}
         */
        Config.getColumnDef = function (field, value) {
            var searchObj = {};
            searchObj[field] = value;
            return _.findWhere(this.getInitConfig('column_definitions'), searchObj);
        };
        Config.initConfig = require('advanced-cms-init-config');
        Config.config = {
            'dataRoleAttributeName': 'data-role'
        };
        return Config;
    }());
    exports.Config = Config;
});
