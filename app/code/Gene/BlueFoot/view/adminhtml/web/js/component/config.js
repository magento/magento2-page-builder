define(["underscore", "jquery", "advanced-cms-init-config"], function (_underscore, _jquery, _advancedCmsInitConfig) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var Config =
  /*#__PURE__*/
  function () {
    function Config() {}

    /**
     * Set the initial config
     *
     * @param config
     */
    Config.setInitConfig = function setInitConfig(config) {
      Config.config = config;
    };
    /**
     * Retrieve the init config
     *
     * @param key
     * @returns {any}
     */


    Config.getInitConfig = function getInitConfig(key) {
      if (key) {
        if (typeof Config.initConfig[key] !== 'undefined') {
          return Config.initConfig[key];
        }

        return null;
      }

      return Config.initConfig;
    };
    /**
     * Return a content types configuration from the config
     *
     * @param type
     * @returns {any}
     */


    Config.getContentBlockConfig = function getContentBlockConfig(type) {
      if (_typeof(Config.initConfig.contentBlocks) === 'object' && _typeof(Config.initConfig.contentBlocks[type]) === 'object') {
        return Config.initConfig.contentBlocks[type];
      }

      return {};
    };
    /**
     * Retrieve the entire config
     *
     * @returns {any}
     */


    Config.getConfig = function getConfig() {
      return Config.config;
    };
    /**
     * Get a specific value from the configuration based on a key
     *
     * @param key
     * @returns {any}
     */


    Config.getValue = function getValue(key) {
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


    Config.getValueAsString = function getValueAsString(key) {
      return String(Config.getValue(key));
    };
    /**
     * Delete a value from the configuration
     *
     * @param key
     * @param valueKey
     * @param value
     */


    Config.deleteValue = function deleteValue(key, valueKey, value) {
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


    Config.mergeValue = function mergeValue(key, values) {
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


    Config.updateTemplateValue = function updateTemplateValue(matchKey, matchValue, newValueKey, newValue) {
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


    Config.getPluginConfig = function getPluginConfig(plugin, key) {
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


    Config.getAllFields = function getAllFields() {
      if (Config.allFields) {
        return Config.allFields;
      }

      Config.allFields = {};

      _jquery.each(Config.initConfig.contentBlocks, function (index, element) {
        if (_typeof(element.fields) === 'object') {
          _jquery.extend(Config.allFields, element.fields);
        }
      }); // Include global fields in all fields


      if (this.getValue('globalFields')) {
        _jquery.extend(Config.allFields, this.getValue('globalFields'));
      }

      return Config.allFields;
    };
    /**
     * Return an individual fields data
     *
     * @param key
     * @returns {any}
     */


    Config.getField = function getField(key) {
      var fields;

      if (!Config.allFields) {
        fields = Config.getAllFields();
      } else {
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


    Config.resetConfig = function resetConfig() {
      Config.config = {};
    };
    /**
     * Retrieve the store ID
     *
     * @returns {any}
     */


    Config.getStoreId = function getStoreId() {
      if ((0, _jquery)('#store_switcher').length > 0) {
        return (0, _jquery)('#store_switcher').val();
      }
    };
    /**
     * Return a column definition based on the class name
     *
     * @param className
     * @returns {T}
     */


    Config.getColumnDefinitionByClassName = function getColumnDefinitionByClassName(className) {
      return Config.getColumnDef('className', className);
    };
    /**
     * Return a column definition based on a breakpoint
     *
     * @param breakpoint
     * @returns {T}
     */


    Config.getColumnDefinitionByBreakpoint = function getColumnDefinitionByBreakpoint(breakpoint) {
      return Config.getColumnDef('breakpoint', breakpoint);
    };
    /**
     * Retrieve a column defination based on a key value pair
     *
     * @param field
     * @param value
     * @returns {undefined|T}
     */


    Config.getColumnDef = function getColumnDef(field, value) {
      var searchObj = {};
      searchObj[field] = value;
      return _underscore.findWhere(this.getInitConfig('column_definitions'), searchObj);
    };

    return Config;
  }();

  Config.initConfig = _advancedCmsInitConfig;
  Config.config = {
    'dataRoleAttributeName': 'data-role'
  };
  return Config;
});
//# sourceMappingURL=config.js.map
