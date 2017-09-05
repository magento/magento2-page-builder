define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.moveArrayItem = moveArrayItem;
    exports.moveArrayItemIntoArray = moveArrayItemIntoArray;
    exports.removeArrayItem = removeArrayItem;
    /**
     * Move an array item within the current array
     *
     * @param array
     * @param fromIndex
     * @param toIndex
     * @returns {Array<any>}
     */
    function moveArrayItem(array, fromIndex, toIndex) {
        array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
        return array;
    }
    /**
     * Move an array item from one array into another
     *
     * @param item
     * @param array
     * @param toIndex
     * @returns {Array<any>}
     */
    function moveArrayItemIntoArray(item, array, toIndex) {
        array.splice(toIndex, 0, item);
        return array;
    }
    /**
     * Remove an array item
     *
     * @param array
     * @param item
     * @returns {Array<any>}
     */
    function removeArrayItem(array, item) {
        var index = array.indexOf(item);
        if (~index) {
            array.splice(index, 1);
        }
        return array;
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL3V0aWxzL2FycmF5LnRzIl0sIm5hbWVzIjpbIm1vdmVBcnJheUl0ZW0iLCJtb3ZlQXJyYXlJdGVtSW50b0FycmF5IiwicmVtb3ZlQXJyYXlJdGVtIiwiYXJyYXkiLCJmcm9tSW5kZXgiLCJ0b0luZGV4Iiwic3BsaWNlIiwiaXRlbSIsImluZGV4IiwiaW5kZXhPZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1lBUU1BLGEsR0FBQUEsYTtZQWFBQyxzQixHQUFBQSxzQjtZQVlBQyxlLEdBQUFBLGU7QUFqQ047Ozs7Ozs7O0FBUU0sYUFBQUYsYUFBQSxDQUF3QkcsS0FBeEIsRUFBMEVDLFNBQTFFLEVBQTZGQyxPQUE3RixFQUE0RztBQUM5R0YsY0FBTUcsTUFBTixDQUFhRCxPQUFiLEVBQXNCLENBQXRCLEVBQXlCRixNQUFNRyxNQUFOLENBQWFGLFNBQWIsRUFBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsQ0FBekI7QUFDQSxlQUFPRCxLQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7QUFRTSxhQUFBRixzQkFBQSxDQUFpQ00sSUFBakMsRUFBNENKLEtBQTVDLEVBQThGRSxPQUE5RixFQUE2RztBQUMvR0YsY0FBTUcsTUFBTixDQUFhRCxPQUFiLEVBQXNCLENBQXRCLEVBQXlCRSxJQUF6QjtBQUNBLGVBQU9KLEtBQVA7QUFDSDtBQUVEOzs7Ozs7O0FBT00sYUFBQUQsZUFBQSxDQUEwQkMsS0FBMUIsRUFBNEVJLElBQTVFLEVBQXFGO0FBQ3ZGLFlBQUlDLFFBQVFMLE1BQU1NLE9BQU4sQ0FBY0YsSUFBZCxDQUFaO0FBRUEsWUFBSSxDQUFDQyxLQUFMLEVBQVk7QUFDUkwsa0JBQU1HLE1BQU4sQ0FBYUUsS0FBYixFQUFvQixDQUFwQjtBQUNIO0FBRUQsZUFBT0wsS0FBUDtBQUNIIiwiZmlsZSI6InV0aWxzL2FycmF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb3ZlIGFuIGFycmF5IGl0ZW0gd2l0aGluIHRoZSBjdXJyZW50IGFycmF5XG4gKlxuICogQHBhcmFtIGFycmF5XG4gKiBAcGFyYW0gZnJvbUluZGV4XG4gKiBAcGFyYW0gdG9JbmRleFxuICogQHJldHVybnMge0FycmF5PGFueT59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlQXJyYXlJdGVtKGFycmF5OiBBcnJheTxhbnk+IHwgS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PiwgZnJvbUluZGV4OiBudW1iZXIsIHRvSW5kZXg6IG51bWJlcik6IEFycmF5PGFueT4gfCBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+IHtcbiAgICBhcnJheS5zcGxpY2UodG9JbmRleCwgMCwgYXJyYXkuc3BsaWNlKGZyb21JbmRleCwgMSlbMF0pO1xuICAgIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBNb3ZlIGFuIGFycmF5IGl0ZW0gZnJvbSBvbmUgYXJyYXkgaW50byBhbm90aGVyXG4gKlxuICogQHBhcmFtIGl0ZW1cbiAqIEBwYXJhbSBhcnJheVxuICogQHBhcmFtIHRvSW5kZXhcbiAqIEByZXR1cm5zIHtBcnJheTxhbnk+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gbW92ZUFycmF5SXRlbUludG9BcnJheShpdGVtOiBhbnksIGFycmF5OiBBcnJheTxhbnk+IHwgS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PiwgdG9JbmRleDogbnVtYmVyKTogQXJyYXk8YW55PiB8IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4ge1xuICAgIGFycmF5LnNwbGljZSh0b0luZGV4LCAwLCBpdGVtKTtcbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIGFycmF5IGl0ZW1cbiAqXG4gKiBAcGFyYW0gYXJyYXlcbiAqIEBwYXJhbSBpdGVtXG4gKiBAcmV0dXJucyB7QXJyYXk8YW55Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFycmF5SXRlbShhcnJheTogQXJyYXk8YW55PiB8IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4sIGl0ZW06IGFueSk6IEFycmF5PGFueT4gfCBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+IHtcbiAgICBsZXQgaW5kZXggPSBhcnJheS5pbmRleE9mKGl0ZW0pO1xuXG4gICAgaWYgKH5pbmRleCkge1xuICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn0iXX0=
