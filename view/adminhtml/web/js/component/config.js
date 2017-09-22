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

        Config.loadEntities = function loadEntities(entityIds, storeId, callback) {}
        // @todo

        /**
         * Retrieve an entity from the configuration
         *
         * @param entityId
         * @returns {any}
         */
        ;

        Config.getEntity = function getEntity(entityId) {
            if (typeof Config.config['entities'][entityId] !== 'undefined') {
                return Config.config['entities'][entityId];
            }
            return {};
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9jb25maWcudHMiXSwibmFtZXMiOlsiQ29uZmlnIiwic2V0SW5pdENvbmZpZyIsImNvbmZpZyIsImdldEluaXRDb25maWciLCJrZXkiLCJpbml0Q29uZmlnIiwibG9hZEVudGl0aWVzIiwiZW50aXR5SWRzIiwic3RvcmVJZCIsImNhbGxiYWNrIiwiZ2V0RW50aXR5IiwiZW50aXR5SWQiLCJnZXRDb250ZW50QmxvY2tDb25maWciLCJ0eXBlIiwiY29udGVudEJsb2NrcyIsImdldENvbmZpZyIsImdldFZhbHVlIiwiZ2V0VmFsdWVBc1N0cmluZyIsIlN0cmluZyIsImRlbGV0ZVZhbHVlIiwidmFsdWVLZXkiLCJ2YWx1ZSIsImFyciIsImZvckVhY2giLCJpdGVtIiwicHVzaCIsIm1lcmdlVmFsdWUiLCJ2YWx1ZXMiLCJjb25jYXQiLCJ1cGRhdGVUZW1wbGF0ZVZhbHVlIiwibWF0Y2hLZXkiLCJtYXRjaFZhbHVlIiwibmV3VmFsdWVLZXkiLCJuZXdWYWx1ZSIsImdldFBsdWdpbkNvbmZpZyIsInBsdWdpbiIsInBsdWdpbnMiLCJnZXRBbGxGaWVsZHMiLCJhbGxGaWVsZHMiLCJlYWNoIiwiaW5kZXgiLCJlbGVtZW50IiwiZmllbGRzIiwiZXh0ZW5kIiwiZ2V0RmllbGQiLCJyZXNldENvbmZpZyIsImdldFN0b3JlSWQiLCJsZW5ndGgiLCJ2YWwiLCJnZXRDb2x1bW5EZWZpbml0aW9uQnlDbGFzc05hbWUiLCJjbGFzc05hbWUiLCJnZXRDb2x1bW5EZWYiLCJnZXRDb2x1bW5EZWZpbml0aW9uQnlCcmVha3BvaW50IiwiYnJlYWtwb2ludCIsImZpZWxkIiwic2VhcmNoT2JqIiwiZmluZFdoZXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBU2NBLE07Ozs7O2VBWUhDLGEsMEJBQWNDLE0sRUFBYztBQUMvQkYsbUJBQU9FLE1BQVAsR0FBZ0JBLE1BQWhCO0FBQ0gsUzs7ZUFRTUMsYSwwQkFBY0MsRyxF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QUFPcUMsWUFBUCxFQUFUO0FBQ0gsYUFGRCxNQUVPO0FBQ0hLLHlCQUFTMUMsT0FBT3NDLFNBQWhCO0FBQ0g7QUFFRCxnQkFBSSxPQUFPSSxPQUFPdEMsR0FBUCxDQUFQLEtBQXVCLFdBQTNCLEVBQXdDO0FBQ3BDLHVCQUFPc0MsT0FBT3RDLEdBQVAsQ0FBUDtBQUNIO0FBRUQsbUJBQU8sSUFBUDtBQUNILFM7O2VBS015QyxXLDBCQUFXO0FBQ2Q3QyxtQkFBT0UsTUFBUCxHQUFnQixFQUFoQjtBQUNILFM7O2VBT000QyxVLHlCQUFVO0FBQ2IsZ0JBQUksc0JBQU8saUJBQVAsRUFBMEJDLE1BQTFCLEdBQW1DLENBQXZDLEVBQTBDO0FBQ3RDLHVCQUFPLHNCQUFPLGlCQUFQLEVBQTBCQyxHQUExQixFQUFQO0FBQ0g7QUFDSixTOztlQVFNQyw4QiwyQ0FBK0JDLFMsRUFBaUI7QUFDbkQsbUJBQU9sRCxPQUFPbUQsWUFBUCxDQUFvQixXQUFwQixFQUFpQ0QsU0FBakMsQ0FBUDtBQUNILFM7O2VBUU1FLCtCLDRDQUFnQ0MsVSxFQUFrQjtBQUNyRCxtQkFBT3JELE9BQU9tRCxZQUFQLENBQW9CLFlBQXBCLEVBQWtDRSxVQUFsQyxDQUFQO0FBQ0gsUzs7ZUFTY0YsWSx5QkFBYUcsSyxFQUFlakMsSyxFQUFzQjtBQUM3RCxnQkFBSWtDLFlBQWlCLEVBQXJCO0FBQ0FBLHNCQUFVRCxLQUFWLElBQW1CakMsS0FBbkI7QUFDQSxtQkFBTyxxQkFBRW1DLFNBQUYsQ0FBWSxLQUFLckQsYUFBTCxDQUFtQixvQkFBbkIsQ0FBWixFQUFzRG9ELFNBQXRELENBQVA7QUFDSCxTOzs7OztzQkFoUVN2RCxNOztBQUNLQSxXQUFBSyxVQUFBO0FBQ0FMLFdBQUFFLE1BQUEsR0FBYztBQUN6QixpQ0FBeUI7QUFEQSxLQUFkIiwiZmlsZSI6ImNvbXBvbmVudC9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBqUXVlcnkgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBjbXNDb25maWcgZnJvbSAnYWR2YW5jZWQtY21zLWluaXQtY29uZmlnJztcblxuLyoqXG4gKiBDb25maWcgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlnIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbml0Q29uZmlnOiBhbnkgPSBjbXNDb25maWc7XG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uZmlnOiBhbnkgPSB7XG4gICAgICAgICdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnOiAnZGF0YS1yb2xlJ1xuICAgIH07XG4gICAgcHJpdmF0ZSBzdGF0aWMgYWxsRmllbGRzOiBhbnk7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGluaXRpYWwgY29uZmlnXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICovXG4gICAgc3RhdGljIHNldEluaXRDb25maWcoY29uZmlnOiBvYmplY3QpOiB2b2lkIHtcbiAgICAgICAgQ29uZmlnLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgaW5pdCBjb25maWdcbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRJbml0Q29uZmlnKGtleT86IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgQ29uZmlnLmluaXRDb25maWdba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29uZmlnLmluaXRDb25maWdba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb25maWcuaW5pdENvbmZpZztcbiAgICB9XG5cbiAgICBzdGF0aWMgbG9hZEVudGl0aWVzKGVudGl0eUlkczogQXJyYXk8bnVtYmVyPiwgc3RvcmVJZDogbnVtYmVyLCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgLy8gQHRvZG9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhbiBlbnRpdHkgZnJvbSB0aGUgY29uZmlndXJhdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIGVudGl0eUlkXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0RW50aXR5KGVudGl0eUlkOiBudW1iZXIpOiBvYmplY3Qge1xuICAgICAgICBpZiAodHlwZW9mIENvbmZpZy5jb25maWdbJ2VudGl0aWVzJ11bZW50aXR5SWRdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5jb25maWdbJ2VudGl0aWVzJ11bZW50aXR5SWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGNvbnRlbnQgdHlwZXMgY29uZmlndXJhdGlvbiBmcm9tIHRoZSBjb25maWdcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0Q29udGVudEJsb2NrQ29uZmlnKHR5cGU6IHN0cmluZyk6IG9iamVjdCB7XG4gICAgICAgIGlmICh0eXBlb2YgQ29uZmlnLmluaXRDb25maWcuY29udGVudEJsb2NrcyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIENvbmZpZy5pbml0Q29uZmlnLmNvbnRlbnRCbG9ja3NbdHlwZV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29uZmlnLmluaXRDb25maWcuY29udGVudEJsb2Nrc1t0eXBlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgZW50aXJlIGNvbmZpZ1xuICAgICAqXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0Q29uZmlnKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiBDb25maWcuY29uZmlnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIHNwZWNpZmljIHZhbHVlIGZyb20gdGhlIGNvbmZpZ3VyYXRpb24gYmFzZWQgb24gYSBrZXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRWYWx1ZShrZXk6IHN0cmluZyk6IG9iamVjdCB8IHN0cmluZyB8IHZvaWQge1xuICAgICAgICBpZiAodHlwZW9mIENvbmZpZy5jb25maWdba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuY29uZmlnW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKENvbmZpZy5nZXRJbml0Q29uZmlnKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuZ2V0SW5pdENvbmZpZyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIGEgdmFsdWUgYXMgYSBzdHJpbmdcbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRWYWx1ZUFzU3RyaW5nKGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhDb25maWcuZ2V0VmFsdWUoa2V5KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVsZXRlIGEgdmFsdWUgZnJvbSB0aGUgY29uZmlndXJhdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIGtleVxuICAgICAqIEBwYXJhbSB2YWx1ZUtleVxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIHN0YXRpYyBkZWxldGVWYWx1ZShrZXk6IHN0cmluZywgdmFsdWVLZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgICAgICBsZXQgYXJyOiBBcnJheTxhbnk+ID0gW107XG4gICAgICAgIENvbmZpZy5jb25maWdba2V5XS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtOiBhbnkpIHtcbiAgICAgICAgICAgIGlmIChpdGVtW3ZhbHVlS2V5XSAhPSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgQ29uZmlnLmNvbmZpZ1trZXldID0gYXJyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1lcmdlIHZhbHVlcyBpbnRvIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIHZhbHVlc1xuICAgICAqL1xuICAgIHN0YXRpYyBtZXJnZVZhbHVlKGtleTogc3RyaW5nLCB2YWx1ZXM6IG9iamVjdCk6IHZvaWQge1xuICAgICAgICBDb25maWcuY29uZmlnW2tleV0gPSBDb25maWcuY29uZmlnW2tleV0uY29uY2F0KHZhbHVlcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGEgdmFsdWUgd2l0aGluIGEgdGVtcGxhdGVzIGFycmF5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gbWF0Y2hLZXlcbiAgICAgKiBAcGFyYW0gbWF0Y2hWYWx1ZVxuICAgICAqIEBwYXJhbSBuZXdWYWx1ZUtleVxuICAgICAqIEBwYXJhbSBuZXdWYWx1ZVxuICAgICAqL1xuICAgIHN0YXRpYyB1cGRhdGVUZW1wbGF0ZVZhbHVlKG1hdGNoS2V5OiBzdHJpbmcsIG1hdGNoVmFsdWU6IHN0cmluZywgbmV3VmFsdWVLZXk6IHN0cmluZyB8IG51bWJlciwgbmV3VmFsdWU6IHN0cmluZykge1xuICAgICAgICBsZXQgYXJyOiBBcnJheTxhbnk+ID0gW107XG4gICAgICAgIENvbmZpZy5jb25maWdbJ3RlbXBsYXRlcyddLmZvckVhY2goZnVuY3Rpb24gKGl0ZW06IGFueSkge1xuICAgICAgICAgICAgaWYgKGl0ZW1bbWF0Y2hLZXldID09PSBtYXRjaFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaXRlbVtuZXdWYWx1ZUtleV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFyci5wdXNoKGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgQ29uZmlnLmNvbmZpZ1sndGVtcGxhdGVzJ10gPSBhcnI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgYSBzcGVjaWZpYyBjb25maWcgdmFsdWUgZnJvbSB0aGUgcGx1Z2luIHNlY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbHVnaW5cbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHJldHVybnMge251bGx9XG4gICAgICovXG4gICAgc3RhdGljIGdldFBsdWdpbkNvbmZpZyhwbHVnaW46IHN0cmluZywga2V5OiBzdHJpbmcpOiBvYmplY3QgfCBudWxsIHtcbiAgICAgICAgbGV0IGNvbmZpZyA9IENvbmZpZy5pbml0Q29uZmlnO1xuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5wbHVnaW5zW3BsdWdpbl0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjb25maWcucGx1Z2luc1twbHVnaW5dWydjb25maWcnXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbmZpZy5wbHVnaW5zW3BsdWdpbl1bJ2NvbmZpZyddW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLnBsdWdpbnNbcGx1Z2luXVsnY29uZmlnJ11ba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIGFsbCBmaWVsZHMgc3RvcmVkIGluIHRoZSBjb25maWd1cmF0aW9uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRBbGxGaWVsZHMoKSB7XG4gICAgICAgIGlmIChDb25maWcuYWxsRmllbGRzKSB7XG4gICAgICAgICAgICByZXR1cm4gQ29uZmlnLmFsbEZpZWxkcztcbiAgICAgICAgfVxuXG4gICAgICAgIENvbmZpZy5hbGxGaWVsZHMgPSB7fTtcbiAgICAgICAgalF1ZXJ5LmVhY2goQ29uZmlnLmluaXRDb25maWcuY29udGVudEJsb2NrcywgZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQuZmllbGRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGpRdWVyeS5leHRlbmQoQ29uZmlnLmFsbEZpZWxkcywgZWxlbWVudC5maWVsZHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBJbmNsdWRlIGdsb2JhbCBmaWVsZHMgaW4gYWxsIGZpZWxkc1xuICAgICAgICBpZiAodGhpcy5nZXRWYWx1ZSgnZ2xvYmFsRmllbGRzJykpIHtcbiAgICAgICAgICAgIGpRdWVyeS5leHRlbmQoQ29uZmlnLmFsbEZpZWxkcywgdGhpcy5nZXRWYWx1ZSgnZ2xvYmFsRmllbGRzJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIENvbmZpZy5hbGxGaWVsZHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGFuIGluZGl2aWR1YWwgZmllbGRzIGRhdGFcbiAgICAgKlxuICAgICAqIEBwYXJhbSBrZXlcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRGaWVsZChrZXk6IHN0cmluZyk6IG9iamVjdCB8IG51bGwge1xuICAgICAgICBsZXQgZmllbGRzO1xuICAgICAgICBpZiAoIUNvbmZpZy5hbGxGaWVsZHMpIHtcbiAgICAgICAgICAgIGZpZWxkcyA9IENvbmZpZy5nZXRBbGxGaWVsZHMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpZWxkcyA9IENvbmZpZy5hbGxGaWVsZHM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGZpZWxkc1trZXldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIGZpZWxkc1trZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgKi9cbiAgICBzdGF0aWMgcmVzZXRDb25maWcoKTogdm9pZCB7XG4gICAgICAgIENvbmZpZy5jb25maWcgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgc3RvcmUgSURcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgc3RhdGljIGdldFN0b3JlSWQoKSB7XG4gICAgICAgIGlmIChqUXVlcnkoJyNzdG9yZV9zd2l0Y2hlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnkoJyNzdG9yZV9zd2l0Y2hlcicpLnZhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgY29sdW1uIGRlZmluaXRpb24gYmFzZWQgb24gdGhlIGNsYXNzIG5hbWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbGFzc05hbWVcbiAgICAgKiBAcmV0dXJucyB7VH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5Q2xhc3NOYW1lKGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBDb25maWcuZ2V0Q29sdW1uRGVmKCdjbGFzc05hbWUnLCBjbGFzc05hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGNvbHVtbiBkZWZpbml0aW9uIGJhc2VkIG9uIGEgYnJlYWtwb2ludFxuICAgICAqXG4gICAgICogQHBhcmFtIGJyZWFrcG9pbnRcbiAgICAgKiBAcmV0dXJucyB7VH1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0Q29sdW1uRGVmaW5pdGlvbkJ5QnJlYWtwb2ludChicmVha3BvaW50OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRDb2x1bW5EZWYoJ2JyZWFrcG9pbnQnLCBicmVha3BvaW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSBhIGNvbHVtbiBkZWZpbmF0aW9uIGJhc2VkIG9uIGEga2V5IHZhbHVlIHBhaXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWVsZFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR8VH1cbiAgICAgKi9cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRDb2x1bW5EZWYoZmllbGQ6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgICAgICBsZXQgc2VhcmNoT2JqOiBhbnkgPSB7fTtcbiAgICAgICAgc2VhcmNoT2JqW2ZpZWxkXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gXy5maW5kV2hlcmUodGhpcy5nZXRJbml0Q29uZmlnKCdjb2x1bW5fZGVmaW5pdGlvbnMnKSwgc2VhcmNoT2JqKTtcbiAgICB9XG59Il19
