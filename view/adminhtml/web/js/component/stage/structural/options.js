define(['exports', 'underscore', 'knockout'], function (exports, _underscore, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Options = undefined;

    var _ = _interopRequireWildcard(_underscore);

    var ko = _interopRequireWildcard(_knockout);

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
            this.options(options);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMudHMiXSwibmFtZXMiOlsiXyIsImtvIiwiT3B0aW9ucyIsInBhcmVudCIsIm9wdGlvbnMiLCJvYnNlcnZhYmxlQXJyYXkiLCJ0ZW1wbGF0ZSIsInNvcnQiLCJhIiwiYiIsIm9wdGlvbiIsInB1c2giLCJjb2RlIiwid2l0aG91dCIsImZpbmRXaGVyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFFWUEsQzs7UUFDQUMsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9OQyxPLFdBQUFBLE87QUFLRjs7Ozs7O0FBTUEseUJBQVlDLE1BQVosRUFBZ0NDLE9BQWhDLEVBQStEO0FBQUE7O0FBVHZELGlCQUFBQSxPQUFBLEdBQW9ESCxHQUFHSSxlQUFILENBQW1CLEVBQW5CLENBQXBEO0FBQ1IsaUJBQUFDLFFBQUEsR0FBbUIsdURBQW5CO0FBU0ksaUJBQUtILE1BQUwsR0FBY0EsTUFBZDtBQUNBLGlCQUFLQyxPQUFMLENBQWFBLE9BQWI7QUFDQSxpQkFBS0csSUFBTDtBQUNIO0FBRUQ7Ozs7Ozs7bUNBR1k7QUFDUixxQkFBS0gsT0FBTCxDQUFhRyxJQUFiLENBQWtCLFVBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFjO0FBQzVCLDJCQUFPRCxFQUFFRCxJQUFGLEtBQVdFLEVBQUVGLElBQWIsR0FBb0IsQ0FBcEIsR0FBeUJDLEVBQUVELElBQUYsR0FBU0UsRUFBRUYsSUFBWCxHQUFrQixDQUFDLENBQW5CLEdBQXVCLENBQXZEO0FBQ0gsaUJBRkQ7QUFHSDtBQUVEOzs7Ozs7OztzQ0FLVUcsTSxFQUF1QjtBQUM3QixxQkFBS04sT0FBTCxDQUFhTyxJQUFiLENBQWtCRCxNQUFsQjtBQUNBLHFCQUFLSCxJQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7eUNBS2FLLEksRUFBWTtBQUNyQixxQkFBS1IsT0FBTCxDQUFhSixFQUFFYSxPQUFGLENBQVUsS0FBS1QsT0FBTCxFQUFWLEVBQTBCSixFQUFFYyxTQUFGLENBQVksS0FBS1YsT0FBTCxFQUFaLEVBQTRCO0FBQy9EUSwwQkFBTUE7QUFEeUQsaUJBQTVCLENBQTFCLENBQWI7QUFHQSxxQkFBS0wsSUFBTDtBQUNIO0FBRUQ7Ozs7Ozs7OzswQ0FNVztBQUNQLHVCQUFPLEtBQUtELFFBQVo7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9vcHRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3B0aW9uSW50ZXJmYWNlIH0gZnJvbSAnLi9vcHRpb25zL29wdGlvbi5kJztcbmltcG9ydCB7IFN0cnVjdHVyYWwgfSBmcm9tICcuL2Fic3RyYWN0LmQnO1xuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCAqIGFzIGtvIGZyb20gJ2tub2Nrb3V0JztcblxuLyoqXG4gKiBPcHRpb25zIENsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBPcHRpb25zIHtcbiAgICBwYXJlbnQ6IFN0cnVjdHVyYWw7XG4gICAgcHJpdmF0ZSBvcHRpb25zOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxPcHRpb25JbnRlcmZhY2U+ID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcbiAgICB0ZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvb3B0aW9ucy5odG1sJztcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogU3RydWN0dXJhbCwgb3B0aW9uczogQXJyYXk8T3B0aW9uSW50ZXJmYWNlPikge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5vcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnNvcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTb3J0IHRoZSBvcHRpb25zXG4gICAgICovXG4gICAgcHJpdmF0ZSBzb3J0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEuc29ydCA9PT0gYi5zb3J0ID8gMCA6IChhLnNvcnQgPCBiLnNvcnQgPyAtMSA6IDEpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBvcHRpb24gaW50byB0aGUgb3B0aW9ucyBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvblxuICAgICAqL1xuICAgIGFkZE9wdGlvbihvcHRpb246IE9wdGlvbkludGVyZmFjZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICB0aGlzLnNvcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gb3B0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY29kZVxuICAgICAqL1xuICAgIHJlbW92ZU9wdGlvbihjb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zKF8ud2l0aG91dCh0aGlzLm9wdGlvbnMoKSwgXy5maW5kV2hlcmUodGhpcy5vcHRpb25zKCksIHtcbiAgICAgICAgICAgIGNvZGU6IGNvZGVcbiAgICAgICAgfSkpKTtcbiAgICAgICAgdGhpcy5zb3J0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHRlbXBsYXRlXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGU7XG4gICAgfVxufSJdfQ==
