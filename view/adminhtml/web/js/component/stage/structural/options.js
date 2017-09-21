define(['exports', 'underscore', 'knockout'], function (exports, _underscore, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Options = undefined;

    var _underscore2 = _interopRequireDefault(_underscore);

    var _knockout2 = _interopRequireDefault(_knockout);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Options = exports.Options = function () {
        /**
         * Options constructor
         *
         * @param parent
         * @param options
         */
        function Options(parent, options) {
            _classCallCheck(this, Options);

            this.options = _knockout2.default.observableArray([]);
            this.template = 'Gene_BlueFoot/component/stage/structural/options.html';
            this.parent = parent;
            this.options(options);
            this.sort();
        }
        /**
         * Sort the options
         */


        Options.prototype.sort = function sort() {
            this.options.sort(function (a, b) {
                return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
            });
        };
        /**
         * Add an option into the options array
         *
         * @param option
         */


        Options.prototype.addOption = function addOption(option) {
            this.options.push(option);
            this.sort();
        };
        /**
         * Remove an option
         *
         * @param code
         */


        Options.prototype.removeOption = function removeOption(code) {
            this.options(_underscore2.default.without(this.options(), _underscore2.default.findWhere(this.options(), {
                code: code
            })));
            this.sort();
        };
        /**
         * Retrieve the template
         *
         * @deprecated
         * @returns {string}
         */


        Options.prototype.getTemplate = function getTemplate() {
            return this.template;
        };

        return Options;
    }();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMudHMiXSwibmFtZXMiOlsiT3B0aW9ucyIsInBhcmVudCIsIm9wdGlvbnMiLCJvYnNlcnZhYmxlQXJyYXkiLCJ0ZW1wbGF0ZSIsInNvcnQiLCJhIiwiYiIsImFkZE9wdGlvbiIsIm9wdGlvbiIsInB1c2giLCJyZW1vdmVPcHRpb24iLCJjb2RlIiwid2l0aG91dCIsImZpbmRXaGVyZSIsImdldFRlbXBsYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFVTUEsTyxXQUFBQSxPO0FBS0Y7Ozs7OztBQU1BLHlCQUFZQyxNQUFaLEVBQWdDQyxPQUFoQyxFQUErRDtBQUFBOztBQVR2RCxpQkFBQUEsT0FBQSxHQUFvRCxtQkFBR0MsZUFBSCxDQUFtQixFQUFuQixDQUFwRDtBQUNSLGlCQUFBQyxRQUFBLEdBQW1CLHVEQUFuQjtBQVNJLGlCQUFLSCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxpQkFBS0MsT0FBTCxDQUFhQSxPQUFiO0FBQ0EsaUJBQUtHLElBQUw7QUFDSDtBQUVEOzs7OzswQkFHUUEsSSxtQkFBSTtBQUNSLGlCQUFLSCxPQUFMLENBQWFHLElBQWIsQ0FBa0IsVUFBVUMsQ0FBVixFQUFhQyxDQUFiLEVBQWM7QUFDNUIsdUJBQU9ELEVBQUVELElBQUYsS0FBV0UsRUFBRUYsSUFBYixHQUFvQixDQUFwQixHQUF5QkMsRUFBRUQsSUFBRixHQUFTRSxFQUFFRixJQUFYLEdBQWtCLENBQUMsQ0FBbkIsR0FBdUIsQ0FBdkQ7QUFDSCxhQUZEO0FBR0gsUztBQUVEOzs7Ozs7OzBCQUtBRyxTLHNCQUFVQyxNLEVBQXVCO0FBQzdCLGlCQUFLUCxPQUFMLENBQWFRLElBQWIsQ0FBa0JELE1BQWxCO0FBQ0EsaUJBQUtKLElBQUw7QUFDSCxTO0FBRUQ7Ozs7Ozs7MEJBS0FNLFkseUJBQWFDLEksRUFBWTtBQUNyQixpQkFBS1YsT0FBTCxDQUFhLHFCQUFFVyxPQUFGLENBQVUsS0FBS1gsT0FBTCxFQUFWLEVBQTBCLHFCQUFFWSxTQUFGLENBQVksS0FBS1osT0FBTCxFQUFaLEVBQTRCO0FBQy9EVSxzQkFBTUE7QUFEeUQsYUFBNUIsQ0FBMUIsQ0FBYjtBQUdBLGlCQUFLUCxJQUFMO0FBQ0gsUztBQUVEOzs7Ozs7OzswQkFNQVUsVywwQkFBVztBQUNQLG1CQUFPLEtBQUtYLFFBQVo7QUFDSCxTIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcHRpb25JbnRlcmZhY2UgfSBmcm9tICcuL29wdGlvbnMvb3B0aW9uLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCB9IGZyb20gJy4vYWJzdHJhY3QuZCc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBrbyBmcm9tICdrbm9ja291dCc7XG5cbi8qKlxuICogT3B0aW9ucyBDbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgT3B0aW9ucyB7XG4gICAgcGFyZW50OiBTdHJ1Y3R1cmFsO1xuICAgIHByaXZhdGUgb3B0aW9uczogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8T3B0aW9uSW50ZXJmYWNlPiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL29wdGlvbnMuaHRtbCc7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IFN0cnVjdHVyYWwsIG9wdGlvbnM6IEFycmF5PE9wdGlvbkludGVyZmFjZT4pIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5zb3J0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU29ydCB0aGUgb3B0aW9uc1xuICAgICAqL1xuICAgIHByaXZhdGUgc29ydCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnNvcnQgPT09IGIuc29ydCA/IDAgOiAoYS5zb3J0IDwgYi5zb3J0ID8gLTEgOiAxKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gb3B0aW9uIGludG8gdGhlIG9wdGlvbnMgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25cbiAgICAgKi9cbiAgICBhZGRPcHRpb24ob3B0aW9uOiBPcHRpb25JbnRlcmZhY2UpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnB1c2gob3B0aW9uKTtcbiAgICAgICAgdGhpcy5zb3J0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIG9wdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIGNvZGVcbiAgICAgKi9cbiAgICByZW1vdmVPcHRpb24oY29kZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyhfLndpdGhvdXQodGhpcy5vcHRpb25zKCksIF8uZmluZFdoZXJlKHRoaXMub3B0aW9ucygpLCB7XG4gICAgICAgICAgICBjb2RlOiBjb2RlXG4gICAgICAgIH0pKSk7XG4gICAgICAgIHRoaXMuc29ydCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlO1xuICAgIH1cbn0iXX0=
