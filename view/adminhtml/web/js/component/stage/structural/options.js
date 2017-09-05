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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMudHMiXSwibmFtZXMiOlsiXyIsIk9wdGlvbnMiLCJwYXJlbnQiLCJvcHRpb25zIiwia28iLCJvYnNlcnZhYmxlQXJyYXkiLCJ0ZW1wbGF0ZSIsImNvbmNhdCIsInNvcnQiLCJhIiwiYiIsIm9wdGlvbiIsInB1c2giLCJjb2RlIiwid2l0aG91dCIsImZpbmRXaGVyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFFWUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9OQyxPLFdBQUFBLE87QUFLRjs7Ozs7O0FBTUEseUJBQVlDLE1BQVosRUFBZ0NDLE9BQWhDLEVBQStEO0FBQUE7O0FBVHZELGlCQUFBQSxPQUFBLEdBQW9EQyxHQUFHQyxlQUFILENBQW1CLEVBQW5CLENBQXBEO0FBQ1IsaUJBQUFDLFFBQUEsR0FBbUIsdURBQW5CO0FBU0ksaUJBQUtKLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGlCQUFLQyxPQUFMLEdBQWUsS0FBS0EsT0FBTCxDQUFhSSxNQUFiLENBQW9CSixPQUFwQixDQUFmO0FBQ0EsaUJBQUtLLElBQUw7QUFDSDtBQUVEOzs7Ozs7O21DQUdZO0FBQ1IscUJBQUtMLE9BQUwsQ0FBYUssSUFBYixDQUFrQixVQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBYztBQUM1QiwyQkFBT0QsRUFBRUQsSUFBRixLQUFXRSxFQUFFRixJQUFiLEdBQW9CLENBQXBCLEdBQXlCQyxFQUFFRCxJQUFGLEdBQVNFLEVBQUVGLElBQVgsR0FBa0IsQ0FBQyxDQUFuQixHQUF1QixDQUF2RDtBQUNILGlCQUZEO0FBR0g7QUFFRDs7Ozs7Ozs7c0NBS1VHLE0sRUFBdUI7QUFDN0IscUJBQUtSLE9BQUwsQ0FBYVMsSUFBYixDQUFrQkQsTUFBbEI7QUFDQSxxQkFBS0gsSUFBTDtBQUNIO0FBRUQ7Ozs7Ozs7O3lDQUthSyxJLEVBQVk7QUFDckIscUJBQUtWLE9BQUwsQ0FBYUgsRUFBRWMsT0FBRixDQUFVLEtBQUtYLE9BQUwsRUFBVixFQUEwQkgsRUFBRWUsU0FBRixDQUFZLEtBQUtaLE9BQUwsRUFBWixFQUE0QjtBQUMvRFUsMEJBQU1BO0FBRHlELGlCQUE1QixDQUExQixDQUFiO0FBR0EscUJBQUtMLElBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7MENBTVc7QUFDUCx1QkFBTyxLQUFLRixRQUFaO0FBQ0giLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvb3B0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wdGlvbkludGVyZmFjZSB9IGZyb20gJy4vb3B0aW9ucy9vcHRpb24uZCc7XG5pbXBvcnQgeyBTdHJ1Y3R1cmFsIH0gZnJvbSAnLi9hYnN0cmFjdC5kJztcbmltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbi8qKlxuICogT3B0aW9ucyBDbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgT3B0aW9ucyB7XG4gICAgcGFyZW50OiBTdHJ1Y3R1cmFsO1xuICAgIHByaXZhdGUgb3B0aW9uczogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8T3B0aW9uSW50ZXJmYWNlPiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMuaHRtbCc7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IFN0cnVjdHVyYWwsIG9wdGlvbnM6IEFycmF5PE9wdGlvbkludGVyZmFjZT4pIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMub3B0aW9ucy5jb25jYXQob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc29ydCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNvcnQgdGhlIG9wdGlvbnNcbiAgICAgKi9cbiAgICBwcml2YXRlIHNvcnQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5zb3J0ID09PSBiLnNvcnQgPyAwIDogKGEuc29ydCA8IGIuc29ydCA/IC0xIDogMSlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGFuIG9wdGlvbiBpbnRvIHRoZSBvcHRpb25zIGFycmF5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uXG4gICAgICovXG4gICAgYWRkT3B0aW9uKG9wdGlvbjogT3B0aW9uSW50ZXJmYWNlKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgICAgIHRoaXMuc29ydCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBvcHRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjb2RlXG4gICAgICovXG4gICAgcmVtb3ZlT3B0aW9uKGNvZGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLm9wdGlvbnMoXy53aXRob3V0KHRoaXMub3B0aW9ucygpLCBfLmZpbmRXaGVyZSh0aGlzLm9wdGlvbnMoKSwge1xuICAgICAgICAgICAgY29kZTogY29kZVxuICAgICAgICB9KSkpO1xuICAgICAgICB0aGlzLnNvcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZTtcbiAgICB9XG59Il19
