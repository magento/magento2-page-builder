define(['exports', 'underscore', 'jquery', 'advanced-cms-init-config'], function (exports, _underscore, _jquery, _advancedCmsInitConfig) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _ = _interopRequireWildcard(_underscore);

    var jQuery = _interopRequireWildcard(_jquery);

    var cmsConfig = _interopRequireWildcard(_advancedCmsInitConfig);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
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
                jQuery.each(Config.initConfig.contentBlocks, function (index, element) {
                    if (_typeof(element.fields) === 'object') {
                        jQuery.extend(Config.allFields, element.fields);
                    }
                });
                // Include global fields in all fields
                if (this.getValue('globalFields')) {
                    jQuery.extend(Config.allFields, this.getValue('globalFields'));
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
                if (jQuery('#store_switcher').length > 0) {
                    return jQuery('#store_switcher').val();
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
                return _.findWhere(this.getInitConfig('column_definitions'), searchObj);
            }
        }]);

        return Config;
    }();

    exports.default = Config;

    Config.initConfig = cmsConfig;
    Config.config = {
        'dataRoleAttributeName': 'data-role'
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvY29uZmlnLnRzIl0sIm5hbWVzIjpbIl8iLCJqUXVlcnkiLCJjbXNDb25maWciLCJDb25maWciLCJjb25maWciLCJrZXkiLCJpbml0Q29uZmlnIiwiZW50aXR5SWRzIiwic3RvcmVJZCIsImNhbGxiYWNrIiwiZW50aXR5SWQiLCJ0eXBlIiwiY29udGVudEJsb2NrcyIsImdldEluaXRDb25maWciLCJTdHJpbmciLCJnZXRWYWx1ZSIsInZhbHVlS2V5IiwidmFsdWUiLCJhcnIiLCJmb3JFYWNoIiwiaXRlbSIsInB1c2giLCJ2YWx1ZXMiLCJjb25jYXQiLCJtYXRjaEtleSIsIm1hdGNoVmFsdWUiLCJuZXdWYWx1ZUtleSIsIm5ld1ZhbHVlIiwicGx1Z2luIiwicGx1Z2lucyIsImFsbEZpZWxkcyIsImVhY2giLCJpbmRleCIsImVsZW1lbnQiLCJmaWVsZHMiLCJleHRlbmQiLCJnZXRBbGxGaWVsZHMiLCJsZW5ndGgiLCJ2YWwiLCJjbGFzc05hbWUiLCJnZXRDb2x1bW5EZWYiLCJicmVha3BvaW50IiwiZmllbGQiLCJzZWFyY2hPYmoiLCJmaW5kV2hlcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7UUFBWUEsQzs7UUFDQUMsTTs7UUFDQUMsUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9FQyxNOzs7Ozs7OzBDQVlXQyxNLEVBQWM7QUFDL0JELHVCQUFPQyxNQUFQLEdBQWdCQSxNQUFoQjtBQUNIOzs7MENBUW9CQyxHLEVBQVk7QUFDN0Isb0JBQUlBLEdBQUosRUFBUztBQUNMLHdCQUFJLE9BQU9GLE9BQU9HLFVBQVAsQ0FBa0JELEdBQWxCLENBQVAsS0FBa0MsV0FBdEMsRUFBbUQ7QUFDL0MsK0JBQU9GLE9BQU9HLFVBQVAsQ0FBa0JELEdBQWxCLENBQVA7QUFDSDtBQUNELDJCQUFPLElBQVA7QUFDSDtBQUNELHVCQUFPRixPQUFPRyxVQUFkO0FBQ0g7Ozt5Q0FFbUJDLFMsRUFBMEJDLE8s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QTFCLEVBQVA7QUFDSDtBQUNKOzs7MkRBUXFDQyxTLEVBQWlCO0FBQ25ELHVCQUFPcEMsT0FBT3FDLFlBQVAsQ0FBb0IsV0FBcEIsRUFBaUNELFNBQWpDLENBQVA7QUFDSDs7OzREQVFzQ0UsVSxFQUFrQjtBQUNyRCx1QkFBT3RDLE9BQU9xQyxZQUFQLENBQW9CLFlBQXBCLEVBQWtDQyxVQUFsQyxDQUFQO0FBQ0g7Ozt5Q0FTMkJDLEssRUFBZXpCLEssRUFBc0I7QUFDN0Qsb0JBQUkwQixZQUFpQixFQUFyQjtBQUNBQSwwQkFBVUQsS0FBVixJQUFtQnpCLEtBQW5CO0FBQ0EsdUJBQU9qQixFQUFFNEMsU0FBRixDQUFZLEtBQUsvQixhQUFMLENBQW1CLG9CQUFuQixDQUFaLEVBQXNEOEIsU0FBdEQsQ0FBUDtBQUNIOzs7Ozs7c0JBaFFTeEMsTTs7QUFDS0EsV0FBQUcsVUFBQSxHQUFrQkosU0FBbEI7QUFDQUMsV0FBQUMsTUFBQSxHQUFjO0FBQ3pCLGlDQUF5QjtBQURBLEtBQWQiLCJmaWxlIjoiY29tcG9uZW50L2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgKiBhcyBqUXVlcnkgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCAqIGFzIGNtc0NvbmZpZyBmcm9tICdhZHZhbmNlZC1jbXMtaW5pdC1jb25maWcnO1xuXG4vKipcbiAqIENvbmZpZyBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWcge1xuICAgIHByaXZhdGUgc3RhdGljIGluaXRDb25maWc6IGFueSA9IGNtc0NvbmZpZztcbiAgICBwcml2YXRlIHN0YXRpYyBjb25maWc6IGFueSA9IHtcbiAgICAgICAgJ2RhdGFSb2xlQXR0cmlidXRlTmFtZSc6ICdkYXRhLXJvbGUnXG4gICAgfTtcbiAgICBwcml2YXRlIHN0YXRpYyBhbGxGaWVsZHM6IGFueTtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgaW5pdGlhbCBjb25maWdcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0SW5pdENvbmZpZyhjb25maWc6IG9iamVjdCk6IHZvaWQge1xuICAgICAgICBDb25maWcuY29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBpbml0IGNvbmZpZ1xuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldEluaXRDb25maWcoa2V5Pzogc3RyaW5nKTogYW55IHtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBDb25maWcuaW5pdENvbmZpZ1trZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBDb25maWcuaW5pdENvbmZpZ1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENvbmZpZy5pbml0Q29uZmlnO1xuICAgIH1cblxuICAgIHN0YXRpYyBsb2FkRW50aXRpZXMoZW50aXR5SWRzOiBBcnJheTxudW1iZXI+LCBzdG9yZUlkOiBudW1iZXIsIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICAvLyBAdG9kb1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIGFuIGVudGl0eSBmcm9tIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZW50aXR5SWRcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRFbnRpdHkoZW50aXR5SWQ6IG51bWJlcik6IG9iamVjdCB7XG4gICAgICAgIGlmICh0eXBlb2YgQ29uZmlnLmNvbmZpZ1snZW50aXRpZXMnXVtlbnRpdHlJZF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29uZmlnLmNvbmZpZ1snZW50aXRpZXMnXVtlbnRpdHlJZF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgY29udGVudCB0eXBlcyBjb25maWd1cmF0aW9uIGZyb20gdGhlIGNvbmZpZ1xuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGVcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb250ZW50QmxvY2tDb25maWcodHlwZTogc3RyaW5nKTogb2JqZWN0IHtcbiAgICAgICAgaWYgKHR5cGVvZiBDb25maWcuaW5pdENvbmZpZy5jb250ZW50QmxvY2tzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgQ29uZmlnLmluaXRDb25maWcuY29udGVudEJsb2Nrc1t0eXBlXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuaW5pdENvbmZpZy5jb250ZW50QmxvY2tzW3R5cGVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBlbnRpcmUgY29uZmlnXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb25maWcoKTogb2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5jb25maWc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgc3BlY2lmaWMgdmFsdWUgZnJvbSB0aGUgY29uZmlndXJhdGlvbiBiYXNlZCBvbiBhIGtleVxuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldFZhbHVlKGtleTogc3RyaW5nKTogb2JqZWN0IHwgc3RyaW5nIHwgdm9pZCB7XG4gICAgICAgIGlmICh0eXBlb2YgQ29uZmlnLmNvbmZpZ1trZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5jb25maWdba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQ29uZmlnLmdldEluaXRDb25maWcoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRJbml0Q29uZmlnKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYSB2YWx1ZSBhcyBhIHN0cmluZ1xuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGdldFZhbHVlQXNTdHJpbmcoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gU3RyaW5nKENvbmZpZy5nZXRWYWx1ZShrZXkpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGUgYSB2YWx1ZSBmcm9tIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIHZhbHVlS2V5XG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgc3RhdGljIGRlbGV0ZVZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZUtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBhcnI6IEFycmF5PGFueT4gPSBbXTtcbiAgICAgICAgQ29uZmlnLmNvbmZpZ1trZXldLmZvckVhY2goZnVuY3Rpb24gKGl0ZW06IGFueSkge1xuICAgICAgICAgICAgaWYgKGl0ZW1bdmFsdWVLZXldICE9IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBDb25maWcuY29uZmlnW2tleV0gPSBhcnI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWVyZ2UgdmFsdWVzIGludG8gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcGFyYW0gdmFsdWVzXG4gICAgICovXG4gICAgc3RhdGljIG1lcmdlVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlczogb2JqZWN0KTogdm9pZCB7XG4gICAgICAgIENvbmZpZy5jb25maWdba2V5XSA9IENvbmZpZy5jb25maWdba2V5XS5jb25jYXQodmFsdWVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgYSB2YWx1ZSB3aXRoaW4gYSB0ZW1wbGF0ZXMgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtYXRjaEtleVxuICAgICAqIEBwYXJhbSBtYXRjaFZhbHVlXG4gICAgICogQHBhcmFtIG5ld1ZhbHVlS2V5XG4gICAgICogQHBhcmFtIG5ld1ZhbHVlXG4gICAgICovXG4gICAgc3RhdGljIHVwZGF0ZVRlbXBsYXRlVmFsdWUobWF0Y2hLZXk6IHN0cmluZywgbWF0Y2hWYWx1ZTogc3RyaW5nLCBuZXdWYWx1ZUtleTogc3RyaW5nIHwgbnVtYmVyLCBuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBhcnI6IEFycmF5PGFueT4gPSBbXTtcbiAgICAgICAgQ29uZmlnLmNvbmZpZ1sndGVtcGxhdGVzJ10uZm9yRWFjaChmdW5jdGlvbiAoaXRlbTogYW55KSB7XG4gICAgICAgICAgICBpZiAoaXRlbVttYXRjaEtleV0gPT09IG1hdGNoVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpdGVtW25ld1ZhbHVlS2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJyLnB1c2goaXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgICBDb25maWcuY29uZmlnWyd0ZW1wbGF0ZXMnXSA9IGFycjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhIHNwZWNpZmljIGNvbmZpZyB2YWx1ZSBmcm9tIHRoZSBwbHVnaW4gc2VjdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHBsdWdpblxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcmV0dXJucyB7bnVsbH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGx1Z2luQ29uZmlnKHBsdWdpbjogc3RyaW5nLCBrZXk6IHN0cmluZyk6IG9iamVjdCB8IG51bGwge1xuICAgICAgICBsZXQgY29uZmlnID0gQ29uZmlnLmluaXRDb25maWc7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLnBsdWdpbnNbcGx1Z2luXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbmZpZy5wbHVnaW5zW3BsdWdpbl1bJ2NvbmZpZyddICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY29uZmlnLnBsdWdpbnNbcGx1Z2luXVsnY29uZmlnJ11ba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWcucGx1Z2luc1twbHVnaW5dWydjb25maWcnXVtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYWxsIGZpZWxkcyBzdG9yZWQgaW4gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldEFsbEZpZWxkcygpIHtcbiAgICAgICAgaWYgKENvbmZpZy5hbGxGaWVsZHMpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuYWxsRmllbGRzO1xuICAgICAgICB9XG5cbiAgICAgICAgQ29uZmlnLmFsbEZpZWxkcyA9IHt9O1xuICAgICAgICBqUXVlcnkuZWFjaChDb25maWcuaW5pdENvbmZpZy5jb250ZW50QmxvY2tzLCBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5maWVsZHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5LmV4dGVuZChDb25maWcuYWxsRmllbGRzLCBlbGVtZW50LmZpZWxkcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEluY2x1ZGUgZ2xvYmFsIGZpZWxkcyBpbiBhbGwgZmllbGRzXG4gICAgICAgIGlmICh0aGlzLmdldFZhbHVlKCdnbG9iYWxGaWVsZHMnKSkge1xuICAgICAgICAgICAgalF1ZXJ5LmV4dGVuZChDb25maWcuYWxsRmllbGRzLCB0aGlzLmdldFZhbHVlKCdnbG9iYWxGaWVsZHMnKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29uZmlnLmFsbEZpZWxkcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYW4gaW5kaXZpZHVhbCBmaWVsZHMgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldEZpZWxkKGtleTogc3RyaW5nKTogb2JqZWN0IHwgbnVsbCB7XG4gICAgICAgIGxldCBmaWVsZHM7XG4gICAgICAgIGlmICghQ29uZmlnLmFsbEZpZWxkcykge1xuICAgICAgICAgICAgZmllbGRzID0gQ29uZmlnLmdldEFsbEZpZWxkcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmllbGRzID0gQ29uZmlnLmFsbEZpZWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZmllbGRzW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIHN0YXRpYyByZXNldENvbmZpZygpOiB2b2lkIHtcbiAgICAgICAgQ29uZmlnLmNvbmZpZyA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBzdG9yZSBJRFxuICAgICAqXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0U3RvcmVJZCgpIHtcbiAgICAgICAgaWYgKGpRdWVyeSgnI3N0b3JlX3N3aXRjaGVyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGpRdWVyeSgnI3N0b3JlX3N3aXRjaGVyJykudmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBjb2x1bW4gZGVmaW5pdGlvbiBiYXNlZCBvbiB0aGUgY2xhc3MgbmFtZVxuICAgICAqXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZVxuICAgICAqIEByZXR1cm5zIHtUfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb2x1bW5EZWZpbml0aW9uQnlDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRDb2x1bW5EZWYoJ2NsYXNzTmFtZScsIGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgY29sdW1uIGRlZmluaXRpb24gYmFzZWQgb24gYSBicmVha3BvaW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gYnJlYWtwb2ludFxuICAgICAqIEByZXR1cm5zIHtUfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb2x1bW5EZWZpbml0aW9uQnlCcmVha3BvaW50KGJyZWFrcG9pbnQ6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gQ29uZmlnLmdldENvbHVtbkRlZignYnJlYWtwb2ludCcsIGJyZWFrcG9pbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIGEgY29sdW1uIGRlZmluYXRpb24gYmFzZWQgb24gYSBrZXkgdmFsdWUgcGFpclxuICAgICAqXG4gICAgICogQHBhcmFtIGZpZWxkXG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZHxUfVxuICAgICAqL1xuICAgIHByaXZhdGUgc3RhdGljIGdldENvbHVtbkRlZihmaWVsZDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICAgIGxldCBzZWFyY2hPYmo6IGFueSA9IHt9O1xuICAgICAgICBzZWFyY2hPYmpbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBfLmZpbmRXaGVyZSh0aGlzLmdldEluaXRDb25maWcoJ2NvbHVtbl9kZWZpbml0aW9ucycpLCBzZWFyY2hPYmopO1xuICAgIH1cbn0iXX0=
