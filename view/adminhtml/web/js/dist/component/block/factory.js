define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = createBlock;
    var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function (resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    /**
     * Retrieve the block instance from the config object
     *
     * @param config
     * @returns {any|string}
     */
    function getBlockComponentPath(config) {
        return config.js_block || 'bluefoot/block/abstract';
    }
    /**
     * Create a new instance of a block
     *
     * @param config
     * @param parent
     * @param stage
     * @param formData
     * @returns {Promise<BlockInterface>}
     */
    function createBlock(config, parent, stage, formData) {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            var c;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return import(getBlockComponentPath(config));

                        case 2:
                            c = _context.sent;
                            return _context.abrupt("return", new c(parent, stage || parent.stage, config, formData || {}));

                        case 4:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvYmxvY2svZmFjdG9yeS50cyIsImNvbXBvbmVudC9ibG9jay9mYWN0b3J5LmpzIl0sIm5hbWVzIjpbImNyZWF0ZUJsb2NrIiwiX19hd2FpdGVyIiwidGhpc0FyZyIsIl9hcmd1bWVudHMiLCJQIiwiZ2VuZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJmdWxmaWxsZWQiLCJ2YWx1ZSIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsImdldEJsb2NrQ29tcG9uZW50UGF0aCIsImNvbmZpZyIsImpzX2Jsb2NrIiwicGFyZW50Iiwic3RhZ2UiLCJmb3JtRGF0YSIsImMiXSwibWFwcGluZ3MiOiI7Ozs7OztzQkE0QmNBLFc7QUM1QmQsUUFBSUMsWUFBYSxhQUFRLFVBQUtBLFNBQWQsSUFBNEIsVUFBVUMsT0FBVixFQUFtQkMsVUFBbkIsRUFBK0JDLENBQS9CLEVBQWtDQyxTQUFsQyxFQUE2QztBQUNyRixlQUFPLEtBQUtELE1BQU1BLElBQUlFLE9BQVYsQ0FBTCxFQUF5QixVQUFVQyxPQUFWLEVBQW1CQyxNQUFuQixFQUEyQjtBQUN2RCxxQkFBU0MsU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEI7QUFBRSxvQkFBSTtBQUFFQyx5QkFBS04sVUFBVU8sSUFBVixDQUFlRixLQUFmLENBQUw7QUFBOEIsaUJBQXBDLENBQXFDLE9BQU9HLENBQVAsRUFBVTtBQUFFTCwyQkFBT0ssQ0FBUDtBQUFZO0FBQUU7QUFDM0YscUJBQVNDLFFBQVQsQ0FBa0JKLEtBQWxCLEVBQXlCO0FBQUUsb0JBQUk7QUFBRUMseUJBQUtOLFVBQVUsT0FBVixFQUFtQkssS0FBbkIsQ0FBTDtBQUFrQyxpQkFBeEMsQ0FBeUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLDJCQUFPSyxDQUFQO0FBQVk7QUFBRTtBQUM5RixxQkFBU0YsSUFBVCxDQUFjSSxNQUFkLEVBQXNCO0FBQUVBLHVCQUFPQyxJQUFQLEdBQWNULFFBQVFRLE9BQU9MLEtBQWYsQ0FBZCxHQUFzQyxJQUFJTixDQUFKLENBQU0sVUFBVUcsT0FBVixFQUFtQjtBQUFFQSw0QkFBUVEsT0FBT0wsS0FBZjtBQUF3QixpQkFBbkQsRUFBcURPLElBQXJELENBQTBEUixTQUExRCxFQUFxRUssUUFBckUsQ0FBdEM7QUFBdUg7QUFDL0lILGlCQUFLLENBQUNOLFlBQVlBLFVBQVVhLEtBQVYsQ0FBZ0JoQixPQUFoQixFQUF5QkMsY0FBYyxFQUF2QyxDQUFiLEVBQXlEUyxJQUF6RCxFQUFMO0FBQ0gsU0FMTSxDQUFQO0FBTUgsS0FQRDtBRFNBOzs7Ozs7QUFNQSxhQUFBTyxxQkFBQSxDQUErQkMsTUFBL0IsRUFBbUQ7QUFDL0MsZUFBT0EsT0FBT0MsUUFBUCxJQUFtQix5QkFBMUI7QUFDSDtBQUVEOzs7Ozs7Ozs7QUFTYyxhQUFBckIsV0FBQSxDQUE0Qm9CLE1BQTVCLEVBQWtERSxNQUFsRCxFQUFpRkMsS0FBakYsRUFBd0dDLFFBQXhHLEVBQXlIO0FDRG5JLGVBQU92QixVQUFVLElBQVYsRUFBZ0IsS0FBSyxDQUFyQixFQUF3QixLQUFLLENBQTdCLDBCQUFnQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1DREVYLE9BQU9rQixzQkFBc0JDLE1BQXRCLENBQVAsQ0NGVzs7QUFBQTtBREVuQ0ssNkJDRm1DO0FBQUEsNkRER2hDLElBQUlBLENBQUosQ0FBTUgsTUFBTixFQUFjQyxTQUFTRCxPQUFPQyxLQUE5QixFQUFxQ0gsTUFBckMsRUFBNkNJLFlBQVksRUFBekQsQ0NIZ0M7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBaEMsRUFBUDtBRElIIiwiZmlsZSI6ImNvbXBvbmVudC9ibG9jay9mYWN0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi9zdGFnZS5kJztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4uL3N0YWdlL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCB7IEJsb2NrIH0gZnJvbSAnLi9ibG9jayc7XG5cbmludGVyZmFjZSBDb25maWdPYmplY3Qge1xuICAgIGpzX2Jsb2NrPzogc3RyaW5nO1xuICAgIFtrZXk6IHN0cmluZ106IGFueVxufVxuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBibG9jayBpbnN0YW5jZSBmcm9tIHRoZSBjb25maWcgb2JqZWN0XG4gKlxuICogQHBhcmFtIGNvbmZpZ1xuICogQHJldHVybnMge2FueXxzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEJsb2NrQ29tcG9uZW50UGF0aChjb25maWc6IENvbmZpZ09iamVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGNvbmZpZy5qc19ibG9jayB8fCAnYmx1ZWZvb3QvYmxvY2svYWJzdHJhY3QnO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhIGJsb2NrXG4gKlxuICogQHBhcmFtIGNvbmZpZ1xuICogQHBhcmFtIHBhcmVudFxuICogQHBhcmFtIHN0YWdlXG4gKiBAcGFyYW0gZm9ybURhdGFcbiAqIEByZXR1cm5zIHtQcm9taXNlPEJsb2NrSW50ZXJmYWNlPn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQmxvY2soY29uZmlnOiBDb25maWdPYmplY3QsIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UsIGZvcm1EYXRhPzogb2JqZWN0KTogUHJvbWlzZTxCbG9jaz4ge1xuICAgIGxldCBjOiB0eXBlb2YgQmxvY2sgPSBhd2FpdCBpbXBvcnQoZ2V0QmxvY2tDb21wb25lbnRQYXRoKGNvbmZpZykpO1xuICAgIHJldHVybiBuZXcgYyhwYXJlbnQsIHN0YWdlIHx8IHBhcmVudC5zdGFnZSwgY29uZmlnLCBmb3JtRGF0YSB8fCB7fSk7XG59XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8qKlxuICogUmV0cmlldmUgdGhlIGJsb2NrIGluc3RhbmNlIGZyb20gdGhlIGNvbmZpZyBvYmplY3RcbiAqXG4gKiBAcGFyYW0gY29uZmlnXG4gKiBAcmV0dXJucyB7YW55fHN0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0QmxvY2tDb21wb25lbnRQYXRoKGNvbmZpZykge1xuICAgIHJldHVybiBjb25maWcuanNfYmxvY2sgfHwgJ2JsdWVmb290L2Jsb2NrL2Fic3RyYWN0Jztcbn1cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYmxvY2tcbiAqXG4gKiBAcGFyYW0gY29uZmlnXG4gKiBAcGFyYW0gcGFyZW50XG4gKiBAcGFyYW0gc3RhZ2VcbiAqIEBwYXJhbSBmb3JtRGF0YVxuICogQHJldHVybnMge1Byb21pc2U8QmxvY2tJbnRlcmZhY2U+fVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVCbG9jayhjb25maWcsIHBhcmVudCwgc3RhZ2UsIGZvcm1EYXRhKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IGMgPSB5aWVsZCBpbXBvcnQoZ2V0QmxvY2tDb21wb25lbnRQYXRoKGNvbmZpZykpO1xuICAgICAgICByZXR1cm4gbmV3IGMocGFyZW50LCBzdGFnZSB8fCBwYXJlbnQuc3RhZ2UsIGNvbmZpZywgZm9ybURhdGEgfHwge30pO1xuICAgIH0pO1xufVxuIl19
