define(['exports', 'underscore', 'jquery', 'advanced-cms-init-config'], function (exports, _underscore, _jquery, _advancedCmsInitConfig) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _advancedCmsInitConfig2 = _interopRequireDefault(_advancedCmsInitConfig);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Config = function () {
        function Config() {
            _classCallCheck(this, Config);
        }

        Config.setInitConfig = function setInitConfig(config) {
            Config.config = config;
        };

        Config.getInitConfig = function getInitConfig(key) {
            if (key) {
                if (typeof Config.initConfig[key] !== 'undefined') {
                    return Config.initConfig[key];
                }
                return null;
            }
            return Config.initConfig;
        };

        Config.getContentBlockConfig = function getContentBlockConfig(type) {
            if (_typeof(Config.initConfig.contentBlocks) === 'object' && _typeof(Config.initConfig.contentBlocks[type]) === 'object') {
                return Config.initConfig.contentBlocks[type];
            }
            return {};
        };

        Config.getConfig = function getConfig() {
            return Config.config;
        };

        Config.getValue = function getValue(key) {
            if (typeof Config.config[key] !== 'undefined') {
                return Config.config[key];
            }
            if (Config.getInitConfig(key)) {
                return Config.getInitConfig(key);
            }
            return null;
        };

        Config.getValueAsString = function getValueAsString(key) {
            return String(Config.getValue(key));
        };

        Config.deleteValue = function deleteValue(key, valueKey, value) {
            var arr = [];
            Config.config[key].forEach(function (item) {
                if (item[valueKey] != value) {
                    arr.push(item);
                }
            });
            Config.config[key] = arr;
        };

        Config.mergeValue = function mergeValue(key, values) {
            Config.config[key] = Config.config[key].concat(values);
        };

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

        Config.getPluginConfig = function getPluginConfig(plugin, key) {
            var config = Config.initConfig;
            if (typeof config.plugins[plugin] !== 'undefined' && typeof config.plugins[plugin]['config'] !== 'undefined' && typeof config.plugins[plugin]['config'][key] !== 'undefined') {
                return config.plugins[plugin]['config'][key];
            }
            return null;
        };

        Config.getAllFields = function getAllFields() {
            if (Config.allFields) {
                return Config.allFields;
            }
            Config.allFields = {};
            _jquery2.default.each(Config.initConfig.contentBlocks, function (index, element) {
                if (_typeof(element.fields) === 'object') {
                    _jquery2.default.extend(Config.allFields, element.fields);
                }
            });
            // Include global fields in all fields
            if (this.getValue('globalFields')) {
                _jquery2.default.extend(Config.allFields, this.getValue('globalFields'));
            }
            return Config.allFields;
        };

        Config.getField = function getField(key) {
            var fields = void 0;
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

        Config.resetConfig = function resetConfig() {
            Config.config = {};
        };

        Config.getStoreId = function getStoreId() {
            if ((0, _jquery2.default)('#store_switcher').length > 0) {
                return (0, _jquery2.default)('#store_switcher').val();
            }
        };

        Config.getColumnDefinitionByClassName = function getColumnDefinitionByClassName(className) {
            return Config.getColumnDef('className', className);
        };

        Config.getColumnDefinitionByBreakpoint = function getColumnDefinitionByBreakpoint(breakpoint) {
            return Config.getColumnDef('breakpoint', breakpoint);
        };

        Config.getColumnDef = function getColumnDef(field, value) {
            var searchObj = {};
            searchObj[field] = value;
            return _underscore2.default.findWhere(this.getInitConfig('column_definitions'), searchObj);
        };

        return Config;
    }();

    exports.default = Config;

    Config.initConfig = _advancedCmsInitConfig2.default;
    Config.config = {
        'dataRoleAttributeName': 'data-role'
    };
});