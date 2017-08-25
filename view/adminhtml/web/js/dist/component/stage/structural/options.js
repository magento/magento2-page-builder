define(['exports', 'underscore'], function (exports, _underscore) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Options = undefined;

    var _ = _interopRequireWildcard(_underscore);

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

    var Options = exports.Options = function () {
        /**
         * Options constructor
         *
         * @param parent
         * @param options
         */
        function Options(parent, options) {
            _classCallCheck(this, Options);

            this.options = ko.observableArray([]);
            this.template = 'Gene_BlueFoot/component/stage/structural/options.html';
            this.parent = parent;
            this.options = this.options.concat(options);
            this.sort();
        }
        /**
         * Sort the options
         */


        _createClass(Options, [{
            key: 'sort',
            value: function sort() {
                this.options.sort(function (a, b) {
                    return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
                });
            }
            /**
             * Add an option into the options array
             *
             * @param option
             */

        }, {
            key: 'addOption',
            value: function addOption(option) {
                this.options.push(option);
                this.sort();
            }
            /**
             * Remove an option
             *
             * @param code
             */

        }, {
            key: 'removeOption',
            value: function removeOption(code) {
                this.options(_.without(this.options(), _.findWhere(this.options(), {
                    code: code
                })));
                this.sort();
            }
            /**
             * Retrieve the template
             *
             * @deprecated
             * @returns {string}
             */

        }, {
            key: 'getTemplate',
            value: function getTemplate() {
                return this.template;
            }
        }]);

        return Options;
    }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9vcHRpb25zLnRzIl0sIm5hbWVzIjpbIl8iLCJPcHRpb25zIiwicGFyZW50Iiwib3B0aW9ucyIsImtvIiwib2JzZXJ2YWJsZUFycmF5IiwidGVtcGxhdGUiLCJjb25jYXQiLCJzb3J0IiwiYSIsImIiLCJvcHRpb24iLCJwdXNoIiwiY29kZSIsIndpdGhvdXQiLCJmaW5kV2hlcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBRVlBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFPTkMsTyxXQUFBQSxPO0FBS0Y7Ozs7OztBQU1BLHlCQUFZQyxNQUFaLEVBQWdDQyxPQUFoQyxFQUErRDtBQUFBOztBQVR2RCxpQkFBQUEsT0FBQSxHQUFvREMsR0FBR0MsZUFBSCxDQUFtQixFQUFuQixDQUFwRDtBQUNSLGlCQUFBQyxRQUFBLEdBQW1CLHVEQUFuQjtBQVNJLGlCQUFLSixNQUFMLEdBQWNBLE1BQWQ7QUFDQSxpQkFBS0MsT0FBTCxHQUFlLEtBQUtBLE9BQUwsQ0FBYUksTUFBYixDQUFvQkosT0FBcEIsQ0FBZjtBQUNBLGlCQUFLSyxJQUFMO0FBQ0g7QUFFRDs7Ozs7OzttQ0FHWTtBQUNSLHFCQUFLTCxPQUFMLENBQWFLLElBQWIsQ0FBa0IsVUFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWM7QUFDNUIsMkJBQU9ELEVBQUVELElBQUYsS0FBV0UsRUFBRUYsSUFBYixHQUFvQixDQUFwQixHQUF5QkMsRUFBRUQsSUFBRixHQUFTRSxFQUFFRixJQUFYLEdBQWtCLENBQUMsQ0FBbkIsR0FBdUIsQ0FBdkQ7QUFDSCxpQkFGRDtBQUdIO0FBRUQ7Ozs7Ozs7O3NDQUtVRyxNLEVBQXVCO0FBQzdCLHFCQUFLUixPQUFMLENBQWFTLElBQWIsQ0FBa0JELE1BQWxCO0FBQ0EscUJBQUtILElBQUw7QUFDSDtBQUVEOzs7Ozs7Ozt5Q0FLYUssSSxFQUFZO0FBQ3JCLHFCQUFLVixPQUFMLENBQWFILEVBQUVjLE9BQUYsQ0FBVSxLQUFLWCxPQUFMLEVBQVYsRUFBMEJILEVBQUVlLFNBQUYsQ0FBWSxLQUFLWixPQUFMLEVBQVosRUFBNEI7QUFDL0RVLDBCQUFNQTtBQUR5RCxpQkFBNUIsQ0FBMUIsQ0FBYjtBQUdBLHFCQUFLTCxJQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBDQU1XO0FBQ1AsdUJBQU8sS0FBS0YsUUFBWjtBQUNIIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcHRpb25JbnRlcmZhY2UgfSBmcm9tICcuL29wdGlvbnMvb3B0aW9uLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QuZCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIE9wdGlvbnMgQ2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIE9wdGlvbnMge1xuICAgIHBhcmVudDogU3RydWN0dXJhbDtcbiAgICBwcml2YXRlIG9wdGlvbnM6IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PE9wdGlvbkludGVyZmFjZT4gPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICAgIHRlbXBsYXRlOiBzdHJpbmcgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9vcHRpb25zLmh0bWwnO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBTdHJ1Y3R1cmFsLCBvcHRpb25zOiBBcnJheTxPcHRpb25JbnRlcmZhY2U+KSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuY29uY2F0KG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnNvcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTb3J0IHRoZSBvcHRpb25zXG4gICAgICovXG4gICAgcHJpdmF0ZSBzb3J0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEuc29ydCA9PT0gYi5zb3J0ID8gMCA6IChhLnNvcnQgPCBiLnNvcnQgPyAtMSA6IDEpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBvcHRpb24gaW50byB0aGUgb3B0aW9ucyBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvblxuICAgICAqL1xuICAgIGFkZE9wdGlvbihvcHRpb246IE9wdGlvbkludGVyZmFjZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICB0aGlzLnNvcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gb3B0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29kZVxuICAgICAqL1xuICAgIHJlbW92ZU9wdGlvbihjb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zKF8ud2l0aG91dCh0aGlzLm9wdGlvbnMoKSwgXy5maW5kV2hlcmUodGhpcy5vcHRpb25zKCksIHtcbiAgICAgICAgICAgIGNvZGU6IGNvZGVcbiAgICAgICAgfSkpKTtcbiAgICAgICAgdGhpcy5zb3J0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGU7XG4gICAgfVxufSJdfQ==
