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

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var Config = function () {
        function Config() {
            _classCallCheck(this, Config);
        }

        _createClass(Config, null, [{
            key: 'setInitConfig',
            value: function setInitConfig(config) {
                Config.config = config;
            }
        }, {
            key: 'getInitConfig',
            value: function getInitConfig(key) {
                if (key) {
                    if (typeof Config.initConfig[key] !== 'undefined') {
                        return Config.initConfig[key];
                    }
                    return null;
                }
                return Config.initConfig;
            }
        }, {
            key: 'loadEntities',
            value: function loadEntities(entityIds, storeId, callback) {}
            // @todo

            /**
             * Retrieve an entity from the configuration
             *
             * @param entityId
             * @returns {any}
             */

        }, {
            key: 'getEntity',
            value: function getEntity(entityId) {
                if (typeof Config.config['entities'][entityId] !== 'undefined') {
                    return Config.config['entities'][entityId];
                }
                return {};
            }
        }, {
            key: 'getContentBlockConfig',
            value: function getContentBlockConfig(type) {
                if (_typeof(Config.initConfig.contentBlocks) === 'object' && _typeof(Config.initConfig.contentBlocks[type]) === 'object') {
                    return Config.initConfig.contentBlocks[type];
                }
                return {};
            }
        }, {
            key: 'getConfig',
            value: function getConfig() {
                return Config.config;
            }
        }, {
            key: 'getValue',
            value: function getValue(key) {
                if (typeof Config.config[key] !== 'undefined') {
                    return Config.config[key];
                }
                if (Config.getInitConfig(key)) {
                    return Config.getInitConfig(key);
                }
                return null;
            }
        }, {
            key: 'getValueAsString',
            value: function getValueAsString(key) {
                return String(Config.getValue(key));
            }
        }, {
            key: 'deleteValue',
            value: function deleteValue(key, valueKey, value) {
                var arr = [];
                Config.config[key].forEach(function (item) {
                    if (item[valueKey] != value) {
                        arr.push(item);
                    }
                });
                Config.config[key] = arr;
            }
        }, {
            key: 'mergeValue',
            value: function mergeValue(key, values) {
                Config.config[key] = Config.config[key].concat(values);
            }
        }, {
            key: 'updateTemplateValue',
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
        }, {
            key: 'getPluginConfig',
            value: function getPluginConfig(plugin, key) {
                var config = Config.initConfig;
                if (typeof config.plugins[plugin] !== 'undefined' && typeof config.plugins[plugin]['config'] !== 'undefined' && typeof config.plugins[plugin]['config'][key] !== 'undefined') {
                    return config.plugins[plugin]['config'][key];
                }
                return null;
            }
        }, {
            key: 'getAllFields',
            value: function getAllFields() {
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
            }
        }, {
            key: 'getField',
            value: function getField(key) {
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
            }
        }, {
            key: 'resetConfig',
            value: function resetConfig() {
                Config.config = {};
            }
        }, {
            key: 'getStoreId',
            value: function getStoreId() {
                if ((0, _jquery2.default)('#store_switcher').length > 0) {
                    return (0, _jquery2.default)('#store_switcher').val();
                }
            }
        }, {
            key: 'getColumnDefinitionByClassName',
            value: function getColumnDefinitionByClassName(className) {
                return Config.getColumnDef('className', className);
            }
        }, {
            key: 'getColumnDefinitionByBreakpoint',
            value: function getColumnDefinitionByBreakpoint(breakpoint) {
                return Config.getColumnDef('breakpoint', breakpoint);
            }
        }, {
            key: 'getColumnDef',
            value: function getColumnDef(field, value) {
                var searchObj = {};
                searchObj[field] = value;
                return _underscore2.default.findWhere(this.getInitConfig('column_definitions'), searchObj);
            }
        }]);

        return Config;
    }();

    exports.default = Config;

    Config.initConfig = _advancedCmsInitConfig2.default;
    Config.config = {
        'dataRoleAttributeName': 'data-role'
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9jb25maWcudHMiXSwibmFtZXMiOlsiQ29uZmlnIiwiY29uZmlnIiwia2V5IiwiaW5pdENvbmZpZyIsImVudGl0eUlkcyIsInN0b3JlSWQiLCJjYWxsYmFjayIsImVudGl0eUlkIiwidHlwZSIsImNvbnRlbnRCbG9ja3MiLCJnZXRJbml0Q29uZmlnIiwiU3RyaW5nIiwiZ2V0VmFsdWUiLCJ2YWx1ZUtleSIsInZhbHVlIiwiYXJyIiwiZm9yRWFjaCIsIml0ZW0iLCJwdXNoIiwidmFsdWVzIiwiY29uY2F0IiwibWF0Y2hLZXkiLCJtYXRjaFZhbHVlIiwibmV3VmFsdWVLZXkiLCJuZXdWYWx1ZSIsInBsdWdpbiIsInBsdWdpbnMiLCJhbGxGaWVsZHMiLCJlYWNoIiwiaW5kZXgiLCJlbGVtZW50IiwiZmllbGRzIiwiZXh0ZW5kIiwiZ2V0QWxsRmllbGRzIiwibGVuZ3RoIiwidmFsIiwiY2xhc3NOYW1lIiwiZ2V0Q29sdW1uRGVmIiwiYnJlYWtwb2ludCIsImZpZWxkIiwic2VhcmNoT2JqIiwiZmluZFdoZXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBU2NBLE07Ozs7Ozs7MENBWVdDLE0sRUFBYztBQUMvQkQsdUJBQU9DLE1BQVAsR0FBZ0JBLE1BQWhCO0FBQ0g7OzswQ0FRb0JDLEcsRUFBWTtBQUM3QixvQkFBSUEsR0FBSixFQUFTO0FBQ0wsd0JBQUksT0FBT0YsT0FBT0csVUFBUCxDQUFrQkQsR0FBbEIsQ0FBUCxLQUFrQyxXQUF0QyxFQUFtRDtBQUMvQywrQkFBT0YsT0FBT0csVUFBUCxDQUFrQkQsR0FBbEIsQ0FBUDtBQUNIO0FBQ0QsMkJBQU8sSUFBUDtBQUNIO0FBQ0QsdUJBQU9GLE9BQU9HLFVBQWQ7QUFDSDs7O3lDQUVtQkMsUyxFQUEwQkMsTyxFQUFpQkMsUSxFQUFrQixDQUVoRjtBQURHOztBQUdKOzs7Ozs7Ozs7c0NBTWlCQyxRLEVBQWdCO0FB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QixXQUFwQixFQUFpQ0QsU0FBakMsQ0FBUDtBQUNIOzs7NERBUXNDRSxVLEVBQWtCO0FBQ3JELHVCQUFPdEMsT0FBT3FDLFlBQVAsQ0FBb0IsWUFBcEIsRUFBa0NDLFVBQWxDLENBQVA7QUFDSDs7O3lDQVMyQkMsSyxFQUFlekIsSyxFQUFzQjtBQUM3RCxvQkFBSTBCLFlBQWlCLEVBQXJCO0FBQ0FBLDBCQUFVRCxLQUFWLElBQW1CekIsS0FBbkI7QUFDQSx1QkFBTyxxQkFBRTJCLFNBQUYsQ0FBWSxLQUFLL0IsYUFBTCxDQUFtQixvQkFBbkIsQ0FBWixFQUFzRDhCLFNBQXRELENBQVA7QUFDSDs7Ozs7O3NCQWhRU3hDLE07O0FBQ0tBLFdBQUFHLFVBQUE7QUFDQUgsV0FBQUMsTUFBQSxHQUFjO0FBQ3pCLGlDQUF5QjtBQURBLEtBQWQiLCJmaWxlIjoiY29tcG9uZW50L2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IGpRdWVyeSBmcm9tICdqcXVlcnknO1xuaW1wb3J0IGNtc0NvbmZpZyBmcm9tICdhZHZhbmNlZC1jbXMtaW5pdC1jb25maWcnO1xuXG4vKipcbiAqIENvbmZpZyBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWcge1xuICAgIHByaXZhdGUgc3RhdGljIGluaXRDb25maWc6IGFueSA9IGNtc0NvbmZpZztcbiAgICBwcml2YXRlIHN0YXRpYyBjb25maWc6IGFueSA9IHtcbiAgICAgICAgJ2RhdGFSb2xlQXR0cmlidXRlTmFtZSc6ICdkYXRhLXJvbGUnXG4gICAgfTtcbiAgICBwcml2YXRlIHN0YXRpYyBhbGxGaWVsZHM6IGFueTtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgaW5pdGlhbCBjb25maWdcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0SW5pdENvbmZpZyhjb25maWc6IG9iamVjdCk6IHZvaWQge1xuICAgICAgICBDb25maWcuY29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBpbml0IGNvbmZpZ1xuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldEluaXRDb25maWcoa2V5Pzogc3RyaW5nKTogYW55IHtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBDb25maWcuaW5pdENvbmZpZ1trZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBDb25maWcuaW5pdENvbmZpZ1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENvbmZpZy5pbml0Q29uZmlnO1xuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkRW50aXRpZXMoZW50aXR5SWRzOiBBcnJheTxudW1iZXI+LCBzdG9yZUlkOiBudW1iZXIsIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICAvLyBAdG9kb1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIGFuIGVudGl0eSBmcm9tIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZW50aXR5SWRcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRFbnRpdHkoZW50aXR5SWQ6IG51bWJlcik6IG9iamVjdCB7XG4gICAgICAgIGlmICh0eXBlb2YgQ29uZmlnLmNvbmZpZ1snZW50aXRpZXMnXVtlbnRpdHlJZF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29uZmlnLmNvbmZpZ1snZW50aXRpZXMnXVtlbnRpdHlJZF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgY29udGVudCB0eXBlcyBjb25maWd1cmF0aW9uIGZyb20gdGhlIGNvbmZpZ1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb250ZW50QmxvY2tDb25maWcodHlwZTogc3RyaW5nKTogb2JqZWN0IHtcbiAgICAgICAgaWYgKHR5cGVvZiBDb25maWcuaW5pdENvbmZpZy5jb250ZW50QmxvY2tzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgQ29uZmlnLmluaXRDb25maWcuY29udGVudEJsb2Nrc1t0eXBlXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuaW5pdENvbmZpZy5jb250ZW50QmxvY2tzW3R5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBlbnRpcmUgY29uZmlnXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb25maWcoKTogb2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5jb25maWc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgc3BlY2lmaWMgdmFsdWUgZnJvbSB0aGUgY29uZmlndXJhdGlvbiBiYXNlZCBvbiBhIGtleVxuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldFZhbHVlKGtleTogc3RyaW5nKTogb2JqZWN0IHwgc3RyaW5nIHwgdm9pZCB7XG4gICAgICAgIGlmICh0eXBlb2YgQ29uZmlnLmNvbmZpZ1trZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5jb25maWdba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQ29uZmlnLmdldEluaXRDb25maWcoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRJbml0Q29uZmlnKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYSB2YWx1ZSBhcyBhIHN0cmluZ1xuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGdldFZhbHVlQXNTdHJpbmcoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gU3RyaW5nKENvbmZpZy5nZXRWYWx1ZShrZXkpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGUgYSB2YWx1ZSBmcm9tIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIHZhbHVlS2V5XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgc3RhdGljIGRlbGV0ZVZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZUtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBhcnI6IEFycmF5PGFueT4gPSBbXTtcbiAgICAgICAgQ29uZmlnLmNvbmZpZ1trZXldLmZvckVhY2goZnVuY3Rpb24gKGl0ZW06IGFueSkge1xuICAgICAgICAgICAgaWYgKGl0ZW1bdmFsdWVLZXldICE9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBDb25maWcuY29uZmlnW2tleV0gPSBhcnI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWVyZ2UgdmFsdWVzIGludG8gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcGFyYW0gdmFsdWVzXG4gICAgICovXG4gICAgc3RhdGljIG1lcmdlVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlczogb2JqZWN0KTogdm9pZCB7XG4gICAgICAgIENvbmZpZy5jb25maWdba2V5XSA9IENvbmZpZy5jb25maWdba2V5XS5jb25jYXQodmFsdWVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgYSB2YWx1ZSB3aXRoaW4gYSB0ZW1wbGF0ZXMgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtYXRjaEtleVxuICAgICAqIEBwYXJhbSBtYXRjaFZhbHVlXG4gICAgICogQHBhcmFtIG5ld1ZhbHVlS2V5XG4gICAgICogQHBhcmFtIG5ld1ZhbHVlXG4gICAgICovXG4gICAgc3RhdGljIHVwZGF0ZVRlbXBsYXRlVmFsdWUobWF0Y2hLZXk6IHN0cmluZywgbWF0Y2hWYWx1ZTogc3RyaW5nLCBuZXdWYWx1ZUtleTogc3RyaW5nIHwgbnVtYmVyLCBuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBhcnI6IEFycmF5PGFueT4gPSBbXTtcbiAgICAgICAgQ29uZmlnLmNvbmZpZ1sndGVtcGxhdGVzJ10uZm9yRWFjaChmdW5jdGlvbiAoaXRlbTogYW55KSB7XG4gICAgICAgICAgICBpZiAoaXRlbVttYXRjaEtleV0gPT09IG1hdGNoVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpdGVtW25ld1ZhbHVlS2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJyLnB1c2goaXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgICBDb25maWcuY29uZmlnWyd0ZW1wbGF0ZXMnXSA9IGFycjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhIHNwZWNpZmljIGNvbmZpZyB2YWx1ZSBmcm9tIHRoZSBwbHVnaW4gc2VjdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHBsdWdpblxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcmV0dXJucyB7bnVsbH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGx1Z2luQ29uZmlnKHBsdWdpbjogc3RyaW5nLCBrZXk6IHN0cmluZyk6IG9iamVjdCB8IG51bGwge1xuICAgICAgICBsZXQgY29uZmlnID0gQ29uZmlnLmluaXRDb25maWc7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLnBsdWdpbnNbcGx1Z2luXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbmZpZy5wbHVnaW5zW3BsdWdpbl1bJ2NvbmZpZyddICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY29uZmlnLnBsdWdpbnNbcGx1Z2luXVsnY29uZmlnJ11ba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWcucGx1Z2luc1twbHVnaW5dWydjb25maWcnXVtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYWxsIGZpZWxkcyBzdG9yZWQgaW4gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldEFsbEZpZWxkcygpIHtcbiAgICAgICAgaWYgKENvbmZpZy5hbGxGaWVsZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuYWxsRmllbGRzO1xuICAgICAgICB9XG5cbiAgICAgICAgQ29uZmlnLmFsbEZpZWxkcyA9IHt9O1xuICAgICAgICBqUXVlcnkuZWFjaChDb25maWcuaW5pdENvbmZpZy5jb250ZW50QmxvY2tzLCBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5maWVsZHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5LmV4dGVuZChDb25maWcuYWxsRmllbGRzLCBlbGVtZW50LmZpZWxkcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEluY2x1ZGUgZ2xvYmFsIGZpZWxkcyBpbiBhbGwgZmllbGRzXG4gICAgICAgIGlmICh0aGlzLmdldFZhbHVlKCdnbG9iYWxGaWVsZHMnKSkge1xuICAgICAgICAgICAgalF1ZXJ5LmV4dGVuZChDb25maWcuYWxsRmllbGRzLCB0aGlzLmdldFZhbHVlKCdnbG9iYWxGaWVsZHMnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29uZmlnLmFsbEZpZWxkcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYW4gaW5kaXZpZHVhbCBmaWVsZHMgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldEZpZWxkKGtleTogc3RyaW5nKTogb2JqZWN0IHwgbnVsbCB7XG4gICAgICAgIGxldCBmaWVsZHM7XG4gICAgICAgIGlmICghQ29uZmlnLmFsbEZpZWxkcykge1xuICAgICAgICAgICAgZmllbGRzID0gQ29uZmlnLmdldEFsbEZpZWxkcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmllbGRzID0gQ29uZmlnLmFsbEZpZWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZmllbGRzW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIHN0YXRpYyByZXNldENvbmZpZygpOiB2b2lkIHtcbiAgICAgICAgQ29uZmlnLmNvbmZpZyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBzdG9yZSBJRFxuICAgICAqXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0U3RvcmVJZCgpIHtcbiAgICAgICAgaWYgKGpRdWVyeSgnI3N0b3JlX3N3aXRjaGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeSgnI3N0b3JlX3N3aXRjaGVyJykudmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBjb2x1bW4gZGVmaW5pdGlvbiBiYXNlZCBvbiB0aGUgY2xhc3MgbmFtZVxuICAgICAqXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZVxuICAgICAqIEByZXR1cm5zIHtUfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb2x1bW5EZWZpbml0aW9uQnlDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRDb2x1bW5EZWYoJ2NsYXNzTmFtZScsIGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgY29sdW1uIGRlZmluaXRpb24gYmFzZWQgb24gYSBicmVha3BvaW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gYnJlYWtwb2ludFxuICAgICAqIEByZXR1cm5zIHtUfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb2x1bW5EZWZpbml0aW9uQnlCcmVha3BvaW50KGJyZWFrcG9pbnQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gQ29uZmlnLmdldENvbHVtbkRlZignYnJlYWtwb2ludCcsIGJyZWFrcG9pbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIGEgY29sdW1uIGRlZmluYXRpb24gYmFzZWQgb24gYSBrZXkgdmFsdWUgcGFpclxuICAgICAqXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZHxUfVxuICAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIGdldENvbHVtbkRlZihmaWVsZDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICAgIGxldCBzZWFyY2hPYmo6IGFueSA9IHt9O1xuICAgICAgICBzZWFyY2hPYmpbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBfLmZpbmRXaGVyZSh0aGlzLmdldEluaXRDb25maWcoJ2NvbHVtbl9kZWZpbml0aW9ucycpLCBzZWFyY2hPYmopO1xuICAgIH1cbn0iXX0=
