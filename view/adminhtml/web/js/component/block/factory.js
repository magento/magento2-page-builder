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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9mYWN0b3J5LnRzIiwiY29tcG9uZW50L2Jsb2NrL2ZhY3RvcnkuanMiXSwibmFtZXMiOlsiY3JlYXRlQmxvY2siLCJfX2F3YWl0ZXIiLCJ0aGlzQXJnIiwiX2FyZ3VtZW50cyIsIlAiLCJnZW5lcmF0b3IiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInZhbHVlIiwic3RlcCIsIm5leHQiLCJlIiwicmVqZWN0ZWQiLCJyZXN1bHQiLCJkb25lIiwidGhlbiIsImFwcGx5IiwiZ2V0QmxvY2tDb21wb25lbnRQYXRoIiwiY29uZmlnIiwianNfYmxvY2siLCJwYXJlbnQiLCJzdGFnZSIsImZvcm1EYXRhIiwiYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQTRCY0EsVztBQzVCZCxRQUFJQyxZQUFhLGFBQVEsVUFBS0EsU0FBZCxJQUE0QixVQUFVQyxPQUFWLEVBQW1CQyxVQUFuQixFQUErQkMsQ0FBL0IsRUFBa0NDLFNBQWxDLEVBQTZDO0FBQ3JGLGVBQU8sS0FBS0QsTUFBTUEsSUFBSUUsT0FBVixDQUFMLEVBQXlCLFVBQVVDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZELHFCQUFTQyxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUFFLG9CQUFJO0FBQUVDLHlCQUFLTixVQUFVTyxJQUFWLENBQWVGLEtBQWYsQ0FBTDtBQUE4QixpQkFBcEMsQ0FBcUMsT0FBT0csQ0FBUCxFQUFVO0FBQUVMLDJCQUFPSyxDQUFQO0FBQVk7QUFBRTtBQUMzRixxQkFBU0MsUUFBVCxDQUFrQkosS0FBbEIsRUFBeUI7QUFBRSxvQkFBSTtBQUFFQyx5QkFBS04sVUFBVSxPQUFWLEVBQW1CSyxLQUFuQixDQUFMO0FBQWtDLGlCQUF4QyxDQUF5QyxPQUFPRyxDQUFQLEVBQVU7QUFBRUwsMkJBQU9LLENBQVA7QUFBWTtBQUFFO0FBQzlGLHFCQUFTRixJQUFULENBQWNJLE1BQWQsRUFBc0I7QUFBRUEsdUJBQU9DLElBQVAsR0FBY1QsUUFBUVEsT0FBT0wsS0FBZixDQUFkLEdBQXNDLElBQUlOLENBQUosQ0FBTSxVQUFVRyxPQUFWLEVBQW1CO0FBQUVBLDRCQUFRUSxPQUFPTCxLQUFmO0FBQXdCLGlCQUFuRCxFQUFxRE8sSUFBckQsQ0FBMERSLFNBQTFELEVBQXFFSyxRQUFyRSxDQUF0QztBQUF1SDtBQUMvSUgsaUJBQUssQ0FBQ04sWUFBWUEsVUFBVWEsS0FBVixDQUFnQmhCLE9BQWhCLEVBQXlCQyxjQUFjLEVBQXZDLENBQWIsRUFBeURTLElBQXpELEVBQUw7QUFDSCxTQUxNLENBQVA7QUFNSCxLQVBEO0FEU0E7Ozs7OztBQU1BLGFBQUFPLHFCQUFBLENBQStCQyxNQUEvQixFQUFtRDtBQUMvQyxlQUFPQSxPQUFPQyxRQUFQLElBQW1CLHlCQUExQjtBQUNIO0FBRUQ7Ozs7Ozs7OztBQVNjLGFBQUFyQixXQUFBLENBQTRCb0IsTUFBNUIsRUFBa0RFLE1BQWxELEVBQWlGQyxLQUFqRixFQUF3R0MsUUFBeEcsRUFBeUg7QUNEbkksZUFBT3ZCLFVBQVUsSUFBVixFQUFnQixLQUFLLENBQXJCLEVBQXdCLEtBQUssQ0FBN0IsMEJBQWdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUNERVgsT0FBT2tCLHNCQUFzQkMsTUFBdEIsQ0FBUCxDQ0ZXOztBQUFBO0FERW5DSyw2QkNGbUM7QUFBQSw2RERHaEMsSUFBSUEsQ0FBSixDQUFNSCxNQUFOLEVBQWNDLFNBQVNELE9BQU9DLEtBQTlCLEVBQXFDSCxNQUFyQyxFQUE2Q0ksWUFBWSxFQUF6RCxDQ0hnQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFoQyxFQUFQO0FESUgiLCJmaWxlIjoiY29tcG9uZW50L2Jsb2NrL2ZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uL3N0YWdlLmQnO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi4vc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuL2Jsb2NrJztcblxuaW50ZXJmYWNlIENvbmZpZ09iamVjdCB7XG4gICAganNfYmxvY2s/OiBzdHJpbmc7XG4gICAgW2tleTogc3RyaW5nXTogYW55XG59XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIGJsb2NrIGluc3RhbmNlIGZyb20gdGhlIGNvbmZpZyBvYmplY3RcbiAqXG4gKiBAcGFyYW0gY29uZmlnXG4gKiBAcmV0dXJucyB7YW55fHN0cmluZ31cbiAqL1xuZnVuY3Rpb24gZ2V0QmxvY2tDb21wb25lbnRQYXRoKGNvbmZpZzogQ29uZmlnT2JqZWN0KTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29uZmlnLmpzX2Jsb2NrIHx8ICdibHVlZm9vdC9ibG9jay9hYnN0cmFjdCc7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIGEgYmxvY2tcbiAqXG4gKiBAcGFyYW0gY29uZmlnXG4gKiBAcGFyYW0gcGFyZW50XG4gKiBAcGFyYW0gc3RhZ2VcbiAqIEBwYXJhbSBmb3JtRGF0YVxuICogQHJldHVybnMge1Byb21pc2U8QmxvY2tJbnRlcmZhY2U+fVxuICovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjcmVhdGVCbG9jayhjb25maWc6IENvbmZpZ09iamVjdCwgcGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UsIHN0YWdlOiBTdGFnZUludGVyZmFjZSwgZm9ybURhdGE/OiBvYmplY3QpOiBQcm9taXNlPEJsb2NrPiB7XG4gICAgbGV0IGM6IHR5cGVvZiBCbG9jayA9IGF3YWl0IGltcG9ydChnZXRCbG9ja0NvbXBvbmVudFBhdGgoY29uZmlnKSk7XG4gICAgcmV0dXJuIG5ldyBjKHBhcmVudCwgc3RhZ2UgfHwgcGFyZW50LnN0YWdlLCBjb25maWcsIGZvcm1EYXRhIHx8IHt9KTtcbn1cbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgYmxvY2sgaW5zdGFuY2UgZnJvbSB0aGUgY29uZmlnIG9iamVjdFxuICpcbiAqIEBwYXJhbSBjb25maWdcbiAqIEByZXR1cm5zIHthbnl8c3RyaW5nfVxuICovXG5mdW5jdGlvbiBnZXRCbG9ja0NvbXBvbmVudFBhdGgoY29uZmlnKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5qc19ibG9jayB8fCAnYmx1ZWZvb3QvYmxvY2svYWJzdHJhY3QnO1xufVxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBibG9ja1xuICpcbiAqIEBwYXJhbSBjb25maWdcbiAqIEBwYXJhbSBwYXJlbnRcbiAqIEBwYXJhbSBzdGFnZVxuICogQHBhcmFtIGZvcm1EYXRhXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9ja0ludGVyZmFjZT59XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUJsb2NrKGNvbmZpZywgcGFyZW50LCBzdGFnZSwgZm9ybURhdGEpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBsZXQgYyA9IHlpZWxkIGltcG9ydChnZXRCbG9ja0NvbXBvbmVudFBhdGgoY29uZmlnKSk7XG4gICAgICAgIHJldHVybiBuZXcgYyhwYXJlbnQsIHN0YWdlIHx8IHBhcmVudC5zdGFnZSwgY29uZmlnLCBmb3JtRGF0YSB8fCB7fSk7XG4gICAgfSk7XG59XG4iXX0=
