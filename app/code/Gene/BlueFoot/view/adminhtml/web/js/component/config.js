define(["underscore", "jquery", "advanced-cms-init-config"], function (_underscore, _jquery, _advancedCmsInitConfig) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Config class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var Config =
  /*#__PURE__*/
  function () {
    function Config() {
      _classCallCheck(this, Config);
    }

    _createClass(Config, null, [{
      key: "setInitConfig",

      /**
       * Set the initial config
       *
       * @param config
       */
      value: function setInitConfig(config) {
        Config.config = config;
      }
      /**
       * Retrieve the init config
       *
       * @param key
       * @returns {any}
       */

    }, {
      key: "getInitConfig",
      value: function getInitConfig(key) {
        if (key) {
          if (typeof Config.initConfig[key] !== 'undefined') {
            return Config.initConfig[key];
          }

          return null;
        }

        return Config.initConfig;
      }
      /**
       * Return a content types configuration from the config
       *
       * @param type
       * @returns {any}
       */

    }, {
      key: "getContentBlockConfig",
      value: function getContentBlockConfig(type) {
        if (_typeof(Config.initConfig.contentBlocks) === 'object' && _typeof(Config.initConfig.contentBlocks[type]) === 'object') {
          return Config.initConfig.contentBlocks[type];
        }

        return {};
      }
      /**
       * Retrieve the entire config
       *
       * @returns {any}
       */

    }, {
      key: "getConfig",
      value: function getConfig() {
        return Config.config;
      }
      /**
       * Get a specific value from the configuration based on a key
       *
       * @param key
       * @returns {any}
       */

    }, {
      key: "getValue",
      value: function getValue(key) {
        if (typeof Config.config[key] !== 'undefined') {
          return Config.config[key];
        }

        if (Config.getInitConfig(key)) {
          return Config.getInitConfig(key);
        }

        return null;
      }
      /**
       * Retrieve a value as a string
       *
       * @param key
       * @returns {String}
       */

    }, {
      key: "getValueAsString",
      value: function getValueAsString(key) {
        return String(Config.getValue(key));
      }
      /**
       * Delete a value from the configuration
       *
       * @param key
       * @param valueKey
       * @param value
       */

    }, {
      key: "deleteValue",
      value: function deleteValue(key, valueKey, value) {
        var arr = [];
        Config.config[key].forEach(function (item) {
          if (item[valueKey] != value) {
            arr.push(item);
          }
        });
        Config.config[key] = arr;
      }
      /**
       * Merge values into the configuration
       *
       * @param key
       * @param values
       */

    }, {
      key: "mergeValue",
      value: function mergeValue(key, values) {
        Config.config[key] = Config.config[key].concat(values);
      }
      /**
       * Update a value within a templates array
       *
       * @param matchKey
       * @param matchValue
       * @param newValueKey
       * @param newValue
       */

    }, {
      key: "updateTemplateValue",
      value: function updateTemplateValue(matchKey, matchValue, newValueKey, newValue) {
        var arr = [];
        Config.config['templates'].forEach(function (item) {
          if (item[matchKey] === matchValue) {
            item[newValueKey] = newValue;
          }

          arr.push(item);
        });
        Config.config['templates'] = arr;
      }
      /**
       * Retrieve a specific config value from the plugin section
       *
       * @param plugin
       * @param key
       * @returns {null}
       */

    }, {
      key: "getPluginConfig",
      value: function getPluginConfig(plugin, key) {
        var config = Config.initConfig;

        if (typeof config.plugins[plugin] !== 'undefined' && typeof config.plugins[plugin]['config'] !== 'undefined' && typeof config.plugins[plugin]['config'][key] !== 'undefined') {
          return config.plugins[plugin]['config'][key];
        }

        return null;
      }
      /**
       * Retrieve all fields stored in the configuration
       *
       * @returns {any}
       */

    }, {
      key: "getAllFields",
      value: function getAllFields() {
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
      }
      /**
       * Return an individual fields data
       *
       * @param key
       * @returns {any}
       */

    }, {
      key: "getField",
      value: function getField(key) {
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
      }
      /**
       * Reset the configuration
       */

    }, {
      key: "resetConfig",
      value: function resetConfig() {
        Config.config = {};
      }
      /**
       * Retrieve the store ID
       *
       * @returns {any}
       */

    }, {
      key: "getStoreId",
      value: function getStoreId() {
        if ((0, _jquery)('#store_switcher').length > 0) {
          return (0, _jquery)('#store_switcher').val();
        }
      }
      /**
       * Return a column definition based on the class name
       *
       * @param className
       * @returns {T}
       */

    }, {
      key: "getColumnDefinitionByClassName",
      value: function getColumnDefinitionByClassName(className) {
        return Config.getColumnDef('className', className);
      }
      /**
       * Return a column definition based on a breakpoint
       *
       * @param breakpoint
       * @returns {T}
       */

    }, {
      key: "getColumnDefinitionByBreakpoint",
      value: function getColumnDefinitionByBreakpoint(breakpoint) {
        return Config.getColumnDef('breakpoint', breakpoint);
      }
      /**
       * Retrieve a column defination based on a key value pair
       *
       * @param field
       * @param value
       * @returns {undefined|T}
       */

    }, {
      key: "getColumnDef",
      value: function getColumnDef(field, value) {
        var searchObj = {};
        searchObj[field] = value;
        return _underscore.findWhere(this.getInitConfig('column_definitions'), searchObj);
      }
    }]);

    return Config;
  }();

  Object.defineProperty(Config, "initConfig", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _advancedCmsInitConfig
  });
  Object.defineProperty(Config, "config", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: {
      'dataRoleAttributeName': 'data-role'
    }
  });
  Object.defineProperty(Config, "allFields", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: void 0
  });
  return Config;
});
//# sourceMappingURL=config.js.map
