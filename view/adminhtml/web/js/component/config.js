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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9jb25maWcudHMiXSwibmFtZXMiOlsiXyIsImpRdWVyeSIsImNtc0NvbmZpZyIsIkNvbmZpZyIsImNvbmZpZyIsImtleSIsImluaXRDb25maWciLCJlbnRpdHlJZHMiLCJzdG9yZUlkIiwiY2FsbGJhY2siLCJlbnRpdHlJZCIsInR5cGUiLCJjb250ZW50QmxvY2tzIiwiZ2V0SW5pdENvbmZpZyIsIlN0cmluZyIsImdldFZhbHVlIiwidmFsdWVLZXkiLCJ2YWx1ZSIsImFyciIsImZvckVhY2giLCJpdGVtIiwicHVzaCIsInZhbHVlcyIsImNvbmNhdCIsIm1hdGNoS2V5IiwibWF0Y2hWYWx1ZSIsIm5ld1ZhbHVlS2V5IiwibmV3VmFsdWUiLCJwbHVnaW4iLCJwbHVnaW5zIiwiYWxsRmllbGRzIiwiZWFjaCIsImluZGV4IiwiZWxlbWVudCIsImZpZWxkcyIsImV4dGVuZCIsImdldEFsbEZpZWxkcyIsImxlbmd0aCIsInZhbCIsImNsYXNzTmFtZSIsImdldENvbHVtbkRlZiIsImJyZWFrcG9pbnQiLCJmaWVsZCIsInNlYXJjaE9iaiIsImZpbmRXaGVyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztRQUFZQSxDOztRQUNBQyxNOztRQUNBQyxTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBT0VDLE07Ozs7Ozs7MENBWVdDLE0sRUFBYztBQUMvQkQsdUJBQU9DLE1BQVAsR0FBZ0JBLE1BQWhCO0FBQ0g7OzswQ0FRb0JDLEcsRUFBWTtBQUM3QixvQkFBSUEsR0FBSixFQUFTO0FBQ0wsd0JBQUksT0FBT0YsT0FBT0csVUFBUCxDQUFrQkQsR0FBbEIsQ0FBUCxLQUFrQyxXQUF0QyxFQUFtRDtBQUMvQywrQkFBT0YsT0FBT0csVUFBUCxDQUFrQkQsR0FBbEIsQ0FBUDtBQUNIO0FBQ0QsMkJBQU8sSUFBUDtBQUNIO0FBQ0QsdUJBQU9GLE9BQU9HLFVBQWQ7QUFDSDs7O3lDQUVtQkMsUyxFQUEwQkMsTyxF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MUIsRUFBUDtBQUNIO0FBQ0o7OzsyREFRcUNDLFMsRUFBaUI7QUFDbkQsdUJBQU9wQyxPQUFPcUMsWUFBUCxDQUFvQixXQUFwQixFQUFpQ0QsU0FBakMsQ0FBUDtBQUNIOzs7NERBUXNDRSxVLEVBQWtCO0FBQ3JELHVCQUFPdEMsT0FBT3FDLFlBQVAsQ0FBb0IsWUFBcEIsRUFBa0NDLFVBQWxDLENBQVA7QUFDSDs7O3lDQVMyQkMsSyxFQUFlekIsSyxFQUFzQjtBQUM3RCxvQkFBSTBCLFlBQWlCLEVBQXJCO0FBQ0FBLDBCQUFVRCxLQUFWLElBQW1CekIsS0FBbkI7QUFDQSx1QkFBT2pCLEVBQUU0QyxTQUFGLENBQVksS0FBSy9CLGFBQUwsQ0FBbUIsb0JBQW5CLENBQVosRUFBc0Q4QixTQUF0RCxDQUFQO0FBQ0g7Ozs7OztzQkFoUVN4QyxNOztBQUNLQSxXQUFBRyxVQUFBLEdBQWtCSixTQUFsQjtBQUNBQyxXQUFBQyxNQUFBLEdBQWM7QUFDekIsaUNBQXlCO0FBREEsS0FBZCIsImZpbGUiOiJjb21wb25lbnQvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCAqIGFzIGpRdWVyeSBmcm9tICdqcXVlcnknO1xuaW1wb3J0ICogYXMgY21zQ29uZmlnIGZyb20gJ2FkdmFuY2VkLWNtcy1pbml0LWNvbmZpZyc7XG5cbi8qKlxuICogQ29uZmlnIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmZpZyB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdENvbmZpZzogYW55ID0gY21zQ29uZmlnO1xuICAgIHByaXZhdGUgc3RhdGljIGNvbmZpZzogYW55ID0ge1xuICAgICAgICAnZGF0YVJvbGVBdHRyaWJ1dGVOYW1lJzogJ2RhdGEtcm9sZSdcbiAgICB9O1xuICAgIHByaXZhdGUgc3RhdGljIGFsbEZpZWxkczogYW55O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBpbml0aWFsIGNvbmZpZ1xuICAgICAqXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqL1xuICAgIHN0YXRpYyBzZXRJbml0Q29uZmlnKGNvbmZpZzogb2JqZWN0KTogdm9pZCB7XG4gICAgICAgIENvbmZpZy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIGluaXQgY29uZmlnXG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0SW5pdENvbmZpZyhrZXk/OiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIENvbmZpZy5pbml0Q29uZmlnW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5pbml0Q29uZmlnW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ29uZmlnLmluaXRDb25maWc7XG4gICAgfVxuXG4gICAgc3RhdGljIGxvYWRFbnRpdGllcyhlbnRpdHlJZHM6IEFycmF5PG51bWJlcj4sIHN0b3JlSWQ6IG51bWJlciwgY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYW4gZW50aXR5IGZyb20gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbnRpdHlJZFxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldEVudGl0eShlbnRpdHlJZDogbnVtYmVyKTogb2JqZWN0IHtcbiAgICAgICAgaWYgKHR5cGVvZiBDb25maWcuY29uZmlnWydlbnRpdGllcyddW2VudGl0eUlkXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuY29uZmlnWydlbnRpdGllcyddW2VudGl0eUlkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBjb250ZW50IHR5cGVzIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgY29uZmlnXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZVxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldENvbnRlbnRCbG9ja0NvbmZpZyh0eXBlOiBzdHJpbmcpOiBvYmplY3Qge1xuICAgICAgICBpZiAodHlwZW9mIENvbmZpZy5pbml0Q29uZmlnLmNvbnRlbnRCbG9ja3MgPT09ICdvYmplY3QnICYmIHR5cGVvZiBDb25maWcuaW5pdENvbmZpZy5jb250ZW50QmxvY2tzW3R5cGVdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5pbml0Q29uZmlnLmNvbnRlbnRCbG9ja3NbdHlwZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIGVudGlyZSBjb25maWdcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldENvbmZpZygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gQ29uZmlnLmNvbmZpZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBzcGVjaWZpYyB2YWx1ZSBmcm9tIHRoZSBjb25maWd1cmF0aW9uIGJhc2VkIG9uIGEga2V5XG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0VmFsdWUoa2V5OiBzdHJpbmcpOiBvYmplY3QgfCBzdHJpbmcgfCB2b2lkIHtcbiAgICAgICAgaWYgKHR5cGVvZiBDb25maWcuY29uZmlnW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29uZmlnLmNvbmZpZ1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGlmIChDb25maWcuZ2V0SW5pdENvbmZpZyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29uZmlnLmdldEluaXRDb25maWcoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhIHZhbHVlIGFzIGEgc3RyaW5nXG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0VmFsdWVBc1N0cmluZyhrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoQ29uZmlnLmdldFZhbHVlKGtleSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBhIHZhbHVlIGZyb20gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcGFyYW0gdmFsdWVLZXlcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKi9cbiAgICBzdGF0aWMgZGVsZXRlVmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlS2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgbGV0IGFycjogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICBDb25maWcuY29uZmlnW2tleV0uZm9yRWFjaChmdW5jdGlvbiAoaXRlbTogYW55KSB7XG4gICAgICAgICAgICBpZiAoaXRlbVt2YWx1ZUtleV0gIT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIENvbmZpZy5jb25maWdba2V5XSA9IGFycjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXJnZSB2YWx1ZXMgaW50byB0aGUgY29uZmlndXJhdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEBwYXJhbSB2YWx1ZXNcbiAgICAgKi9cbiAgICBzdGF0aWMgbWVyZ2VWYWx1ZShrZXk6IHN0cmluZywgdmFsdWVzOiBvYmplY3QpOiB2b2lkIHtcbiAgICAgICAgQ29uZmlnLmNvbmZpZ1trZXldID0gQ29uZmlnLmNvbmZpZ1trZXldLmNvbmNhdCh2YWx1ZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBhIHZhbHVlIHdpdGhpbiBhIHRlbXBsYXRlcyBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIG1hdGNoS2V5XG4gICAgICogQHBhcmFtIG1hdGNoVmFsdWVcbiAgICAgKiBAcGFyYW0gbmV3VmFsdWVLZXlcbiAgICAgKiBAcGFyYW0gbmV3VmFsdWVcbiAgICAgKi9cbiAgICBzdGF0aWMgdXBkYXRlVGVtcGxhdGVWYWx1ZShtYXRjaEtleTogc3RyaW5nLCBtYXRjaFZhbHVlOiBzdHJpbmcsIG5ld1ZhbHVlS2V5OiBzdHJpbmcgfCBudW1iZXIsIG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGFycjogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICBDb25maWcuY29uZmlnWyd0ZW1wbGF0ZXMnXS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtOiBhbnkpIHtcbiAgICAgICAgICAgIGlmIChpdGVtW21hdGNoS2V5XSA9PT0gbWF0Y2hWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGl0ZW1bbmV3VmFsdWVLZXldID0gbmV3VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcnIucHVzaChpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIENvbmZpZy5jb25maWdbJ3RlbXBsYXRlcyddID0gYXJyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIGEgc3BlY2lmaWMgY29uZmlnIHZhbHVlIGZyb20gdGhlIHBsdWdpbiBzZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGx1Z2luXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEByZXR1cm5zIHtudWxsfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRQbHVnaW5Db25maWcocGx1Z2luOiBzdHJpbmcsIGtleTogc3RyaW5nKTogb2JqZWN0IHwgbnVsbCB7XG4gICAgICAgIGxldCBjb25maWcgPSBDb25maWcuaW5pdENvbmZpZztcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcucGx1Z2luc1twbHVnaW5dICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY29uZmlnLnBsdWdpbnNbcGx1Z2luXVsnY29uZmlnJ10gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjb25maWcucGx1Z2luc1twbHVnaW5dWydjb25maWcnXVtrZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5wbHVnaW5zW3BsdWdpbl1bJ2NvbmZpZyddW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhbGwgZmllbGRzIHN0b3JlZCBpbiB0aGUgY29uZmlndXJhdGlvblxuICAgICAqXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0QWxsRmllbGRzKCkge1xuICAgICAgICBpZiAoQ29uZmlnLmFsbEZpZWxkcykge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5hbGxGaWVsZHM7XG4gICAgICAgIH1cblxuICAgICAgICBDb25maWcuYWxsRmllbGRzID0ge307XG4gICAgICAgIGpRdWVyeS5lYWNoKENvbmZpZy5pbml0Q29uZmlnLmNvbnRlbnRCbG9ja3MsIGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LmZpZWxkcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnkuZXh0ZW5kKENvbmZpZy5hbGxGaWVsZHMsIGVsZW1lbnQuZmllbGRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSW5jbHVkZSBnbG9iYWwgZmllbGRzIGluIGFsbCBmaWVsZHNcbiAgICAgICAgaWYgKHRoaXMuZ2V0VmFsdWUoJ2dsb2JhbEZpZWxkcycpKSB7XG4gICAgICAgICAgICBqUXVlcnkuZXh0ZW5kKENvbmZpZy5hbGxGaWVsZHMsIHRoaXMuZ2V0VmFsdWUoJ2dsb2JhbEZpZWxkcycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBDb25maWcuYWxsRmllbGRzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhbiBpbmRpdmlkdWFsIGZpZWxkcyBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0RmllbGQoa2V5OiBzdHJpbmcpOiBvYmplY3QgfCBudWxsIHtcbiAgICAgICAgbGV0IGZpZWxkcztcbiAgICAgICAgaWYgKCFDb25maWcuYWxsRmllbGRzKSB7XG4gICAgICAgICAgICBmaWVsZHMgPSBDb25maWcuZ2V0QWxsRmllbGRzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWVsZHMgPSBDb25maWcuYWxsRmllbGRzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZHNba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZHNba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHRoZSBjb25maWd1cmF0aW9uXG4gICAgICovXG4gICAgc3RhdGljIHJlc2V0Q29uZmlnKCk6IHZvaWQge1xuICAgICAgICBDb25maWcuY29uZmlnID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHN0b3JlIElEXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRTdG9yZUlkKCkge1xuICAgICAgICBpZiAoalF1ZXJ5KCcjc3RvcmVfc3dpdGNoZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5KCcjc3RvcmVfc3dpdGNoZXInKS52YWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGNvbHVtbiBkZWZpbml0aW9uIGJhc2VkIG9uIHRoZSBjbGFzcyBuYW1lXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xhc3NOYW1lXG4gICAgICogQHJldHVybnMge1R9XG4gICAgICovXG4gICAgc3RhdGljIGdldENvbHVtbkRlZmluaXRpb25CeUNsYXNzTmFtZShjbGFzc05hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gQ29uZmlnLmdldENvbHVtbkRlZignY2xhc3NOYW1lJywgY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBjb2x1bW4gZGVmaW5pdGlvbiBiYXNlZCBvbiBhIGJyZWFrcG9pbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBicmVha3BvaW50XG4gICAgICogQHJldHVybnMge1R9XG4gICAgICovXG4gICAgc3RhdGljIGdldENvbHVtbkRlZmluaXRpb25CeUJyZWFrcG9pbnQoYnJlYWtwb2ludDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBDb25maWcuZ2V0Q29sdW1uRGVmKCdicmVha3BvaW50JywgYnJlYWtwb2ludCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYSBjb2x1bW4gZGVmaW5hdGlvbiBiYXNlZCBvbiBhIGtleSB2YWx1ZSBwYWlyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmllbGRcbiAgICAgKiBAcGFyYW0gdmFsdWVcbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfFR9XG4gICAgICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Q29sdW1uRGVmKGZpZWxkOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgICAgbGV0IHNlYXJjaE9iajogYW55ID0ge307XG4gICAgICAgIHNlYXJjaE9ialtmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIF8uZmluZFdoZXJlKHRoaXMuZ2V0SW5pdENvbmZpZygnY29sdW1uX2RlZmluaXRpb25zJyksIHNlYXJjaE9iaik7XG4gICAgfVxufSJdfQ==
