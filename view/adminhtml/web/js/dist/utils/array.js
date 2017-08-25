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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy9hcnJheS50cyJdLCJuYW1lcyI6WyJtb3ZlQXJyYXlJdGVtIiwibW92ZUFycmF5SXRlbUludG9BcnJheSIsInJlbW92ZUFycmF5SXRlbSIsImFycmF5IiwiZnJvbUluZGV4IiwidG9JbmRleCIsInNwbGljZSIsIml0ZW0iLCJpbmRleCIsImluZGV4T2YiXSwibWFwcGluZ3MiOiI7Ozs7OztZQVFNQSxhLEdBQUFBLGE7WUFhQUMsc0IsR0FBQUEsc0I7WUFZQUMsZSxHQUFBQSxlO0FBakNOOzs7Ozs7OztBQVFNLGFBQUFGLGFBQUEsQ0FBd0JHLEtBQXhCLEVBQTBFQyxTQUExRSxFQUE2RkMsT0FBN0YsRUFBNEc7QUFDOUdGLGNBQU1HLE1BQU4sQ0FBYUQsT0FBYixFQUFzQixDQUF0QixFQUF5QkYsTUFBTUcsTUFBTixDQUFhRixTQUFiLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLENBQXpCO0FBQ0EsZUFBT0QsS0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7O0FBUU0sYUFBQUYsc0JBQUEsQ0FBaUNNLElBQWpDLEVBQTRDSixLQUE1QyxFQUE4RkUsT0FBOUYsRUFBNkc7QUFDL0dGLGNBQU1HLE1BQU4sQ0FBYUQsT0FBYixFQUFzQixDQUF0QixFQUF5QkUsSUFBekI7QUFDQSxlQUFPSixLQUFQO0FBQ0g7QUFFRDs7Ozs7OztBQU9NLGFBQUFELGVBQUEsQ0FBMEJDLEtBQTFCLEVBQTRFSSxJQUE1RSxFQUFxRjtBQUN2RixZQUFJQyxRQUFRTCxNQUFNTSxPQUFOLENBQWNGLElBQWQsQ0FBWjtBQUVBLFlBQUksQ0FBQ0MsS0FBTCxFQUFZO0FBQ1JMLGtCQUFNRyxNQUFOLENBQWFFLEtBQWIsRUFBb0IsQ0FBcEI7QUFDSDtBQUVELGVBQU9MLEtBQVA7QUFDSCIsImZpbGUiOiJ1dGlscy9hcnJheS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTW92ZSBhbiBhcnJheSBpdGVtIHdpdGhpbiB0aGUgY3VycmVudCBhcnJheVxuICpcbiAqIEBwYXJhbSBhcnJheVxuICogQHBhcmFtIGZyb21JbmRleFxuICogQHBhcmFtIHRvSW5kZXhcbiAqIEByZXR1cm5zIHtBcnJheTxhbnk+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gbW92ZUFycmF5SXRlbShhcnJheTogQXJyYXk8YW55PiB8IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4sIGZyb21JbmRleDogbnVtYmVyLCB0b0luZGV4OiBudW1iZXIpOiBBcnJheTxhbnk+IHwgS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PiB7XG4gICAgYXJyYXkuc3BsaWNlKHRvSW5kZXgsIDAsIGFycmF5LnNwbGljZShmcm9tSW5kZXgsIDEpWzBdKTtcbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogTW92ZSBhbiBhcnJheSBpdGVtIGZyb20gb25lIGFycmF5IGludG8gYW5vdGhlclxuICpcbiAqIEBwYXJhbSBpdGVtXG4gKiBAcGFyYW0gYXJyYXlcbiAqIEBwYXJhbSB0b0luZGV4XG4gKiBAcmV0dXJucyB7QXJyYXk8YW55Pn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkoaXRlbTogYW55LCBhcnJheTogQXJyYXk8YW55PiB8IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4sIHRvSW5kZXg6IG51bWJlcik6IEFycmF5PGFueT4gfCBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+IHtcbiAgICBhcnJheS5zcGxpY2UodG9JbmRleCwgMCwgaXRlbSk7XG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBhcnJheSBpdGVtXG4gKlxuICogQHBhcmFtIGFycmF5XG4gKiBAcGFyYW0gaXRlbVxuICogQHJldHVybnMge0FycmF5PGFueT59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBcnJheUl0ZW0oYXJyYXk6IEFycmF5PGFueT4gfCBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+LCBpdGVtOiBhbnkpOiBBcnJheTxhbnk+IHwgS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PiB7XG4gICAgbGV0IGluZGV4ID0gYXJyYXkuaW5kZXhPZihpdGVtKTtcblxuICAgIGlmICh+aW5kZXgpIHtcbiAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59Il19
