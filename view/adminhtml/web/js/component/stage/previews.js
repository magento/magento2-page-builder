define(['exports', '../config', '../block/preview/block'], function (exports, _config, _block) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.load = load;
    exports.default = get;

    var _config2 = _interopRequireDefault(_config);

    var _block2 = _interopRequireDefault(_block);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var previews = [];
    /**
     * Load all preview instances into our cache
     */
    function load() {
        var contentBlocks = _config2.default.getInitConfig("contentBlocks");
        var blocksToLoad = [],
            blockCodes = []; // @todo should be string, but TS complains
        Object.keys(contentBlocks).forEach(function (blockKey) {
            var block = contentBlocks[blockKey];
            if (typeof block.preview_block === 'string') {
                blockCodes.push(blockKey);
                blocksToLoad.push(block.preview_block);
            }
        });
        // @todo this could create a race condition loading these async upfront
        require(blocksToLoad, function () {
            for (var arg = 0; arg < arguments.length; ++arg) {
                previews[blockCodes[arg]] = arguments[arg].default;
            }
        });
    }
    /**
     * Get preview instance for a specific block
     *
     * @param {Block} block
     * @param blockConfig
     * @returns {PreviewBlock}
     */
    function get(block, blockConfig) {
        var code = blockConfig.code;
        var instance = void 0;
        if (typeof previews[code] === 'undefined') {
            instance = _block2.default;
        } else {
            instance = previews[code];
        }
        return new instance(block, blockConfig);
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9wcmV2aWV3cy50cyJdLCJuYW1lcyI6WyJsb2FkIiwiZ2V0IiwicHJldmlld3MiLCJjb250ZW50QmxvY2tzIiwiZ2V0SW5pdENvbmZpZyIsImJsb2Nrc1RvTG9hZCIsImJsb2NrQ29kZXMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImJsb2NrS2V5IiwiYmxvY2siLCJwcmV2aWV3X2Jsb2NrIiwicHVzaCIsInJlcXVpcmUiLCJhcmciLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJkZWZhdWx0IiwiYmxvY2tDb25maWciLCJjb2RlIiwiaW5zdGFuY2UiXSwibWFwcGluZ3MiOiI7Ozs7OztZQVNNQSxJLEdBQUFBLEk7c0JBMkJRQyxHOzs7Ozs7Ozs7Ozs7QUFoQ2QsUUFBSUMsV0FBdUIsRUFBM0I7QUFFQTs7O0FBR00sYUFBQUYsSUFBQSxHQUFBO0FBQ0YsWUFBTUcsZ0JBQWdCLGlCQUFPQyxhQUFQLENBQXFCLGVBQXJCLENBQXRCO0FBQ0EsWUFBSUMsZUFBOEIsRUFBbEM7QUFBQSxZQUNJQyxhQUF5QixFQUQ3QixDQUZFLENBRytCO0FBQ2pDQyxlQUFPQyxJQUFQLENBQVlMLGFBQVosRUFBMkJNLE9BQTNCLENBQW1DLFVBQUNDLFFBQUQsRUFBYTtBQUM1QyxnQkFBTUMsUUFBUVIsY0FBY08sUUFBZCxDQUFkO0FBQ0EsZ0JBQUksT0FBT0MsTUFBTUMsYUFBYixLQUErQixRQUFuQyxFQUE2QztBQUN6Q04sMkJBQVdPLElBQVgsQ0FBZ0JILFFBQWhCO0FBQ0FMLDZCQUFhUSxJQUFiLENBQWtCRixNQUFNQyxhQUF4QjtBQUNIO0FBQ0osU0FORDtBQVFBO0FBQ0FFLGdCQUFRVCxZQUFSLEVBQXNCLFlBQUE7QUFDbEIsaUJBQUssSUFBSVUsTUFBYyxDQUF2QixFQUEwQkEsTUFBTUMsVUFBVUMsTUFBMUMsRUFBa0QsRUFBRUYsR0FBcEQsRUFBeUQ7QUFDckRiLHlCQUFTSSxXQUFXUyxHQUFYLENBQVQsSUFBNEJDLFVBQVVELEdBQVYsRUFBZUcsT0FBM0M7QUFDSDtBQUNKLFNBSkQ7QUFLSDtBQUVEOzs7Ozs7O0FBT2MsYUFBQWpCLEdBQUEsQ0FBY1UsS0FBZCxFQUE0QlEsV0FBNUIsRUFBNEM7QUFDdEQsWUFBTUMsT0FBT0QsWUFBWUMsSUFBekI7QUFDQSxZQUFJQyxpQkFBSjtBQUNBLFlBQUksT0FBT25CLFNBQVNrQixJQUFULENBQVAsS0FBMEIsV0FBOUIsRUFBMkM7QUFDdkNDO0FBQ0gsU0FGRCxNQUVPO0FBQ0hBLHVCQUFXbkIsU0FBU2tCLElBQVQsQ0FBWDtBQUNIO0FBRUQsZUFBTyxJQUFJQyxRQUFKLENBQWFWLEtBQWIsRUFBb0JRLFdBQXBCLENBQVA7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvcHJldmlld3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgUHJldmlld0Jsb2NrIGZyb20gJy4uL2Jsb2NrL3ByZXZpZXcvYmxvY2snO1xuaW1wb3J0IEJsb2NrIGZyb20gXCIuLi9ibG9jay9ibG9ja1wiO1xuXG5sZXQgcHJldmlld3M6IEFycmF5PGFueT4gPSBbXTtcblxuLyoqXG4gKiBMb2FkIGFsbCBwcmV2aWV3IGluc3RhbmNlcyBpbnRvIG91ciBjYWNoZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZCgpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZW50QmxvY2tzID0gQ29uZmlnLmdldEluaXRDb25maWcoXCJjb250ZW50QmxvY2tzXCIpIGFzIENvbmZpZ0NvbnRlbnRCbG9ja3M7XG4gICAgbGV0IGJsb2Nrc1RvTG9hZDogQXJyYXk8c3RyaW5nPiA9IFtdLFxuICAgICAgICBibG9ja0NvZGVzOiBBcnJheTxhbnk+ID0gW107IC8vIEB0b2RvIHNob3VsZCBiZSBzdHJpbmcsIGJ1dCBUUyBjb21wbGFpbnNcbiAgICBPYmplY3Qua2V5cyhjb250ZW50QmxvY2tzKS5mb3JFYWNoKChibG9ja0tleSkgPT4ge1xuICAgICAgICBjb25zdCBibG9jayA9IGNvbnRlbnRCbG9ja3NbYmxvY2tLZXldO1xuICAgICAgICBpZiAodHlwZW9mIGJsb2NrLnByZXZpZXdfYmxvY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBibG9ja0NvZGVzLnB1c2goYmxvY2tLZXkpO1xuICAgICAgICAgICAgYmxvY2tzVG9Mb2FkLnB1c2goYmxvY2sucHJldmlld19ibG9jayk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEB0b2RvIHRoaXMgY291bGQgY3JlYXRlIGEgcmFjZSBjb25kaXRpb24gbG9hZGluZyB0aGVzZSBhc3luYyB1cGZyb250XG4gICAgcmVxdWlyZShibG9ja3NUb0xvYWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChsZXQgYXJnOiBudW1iZXIgPSAwOyBhcmcgPCBhcmd1bWVudHMubGVuZ3RoOyArK2FyZykge1xuICAgICAgICAgICAgcHJldmlld3NbYmxvY2tDb2Rlc1thcmddXSA9IGFyZ3VtZW50c1thcmddLmRlZmF1bHQ7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgcHJldmlldyBpbnN0YW5jZSBmb3IgYSBzcGVjaWZpYyBibG9ja1xuICpcbiAqIEBwYXJhbSB7QmxvY2t9IGJsb2NrXG4gKiBAcGFyYW0gYmxvY2tDb25maWdcbiAqIEByZXR1cm5zIHtQcmV2aWV3QmxvY2t9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldChibG9jazogQmxvY2ssIGJsb2NrQ29uZmlnOiBhbnkpOiBQcmV2aWV3QmxvY2sge1xuICAgIGNvbnN0IGNvZGUgPSBibG9ja0NvbmZpZy5jb2RlO1xuICAgIGxldCBpbnN0YW5jZTogdHlwZW9mIFByZXZpZXdCbG9jaztcbiAgICBpZiAodHlwZW9mIHByZXZpZXdzW2NvZGVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpbnN0YW5jZSA9IFByZXZpZXdCbG9jaztcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0YW5jZSA9IHByZXZpZXdzW2NvZGVdO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgaW5zdGFuY2UoYmxvY2ssIGJsb2NrQ29uZmlnKTtcbn1cblxuLy8gQHRvZG8gbW92ZSB0aGVzZSBpbnRvIENvbmZpZyBjbGFzc1xuaW50ZXJmYWNlIENvbmZpZ0NvbnRlbnRCbG9jayB7XG4gICAgY29kZTogc3RyaW5nLFxuICAgIGNvbnRlbnRUeXBlOiBzdHJpbmcsXG4gICAgZmllbGRzOiBvYmplY3QsXG4gICAgZmllbGRzX2xpc3Q6IEFycmF5PHN0cmluZz4sXG4gICAgZ3JvdXA6IHN0cmluZyxcbiAgICBpY29uOiBzdHJpbmcsXG4gICAganNfYmxvY2s6IHN0cmluZyB8IG51bGwsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHByZXZpZXdfYmxvY2s6IHN0cmluZyB8IG51bGwsXG4gICAgcHJldmlld190ZW1wbGF0ZTogc3RyaW5nIHwgbnVsbCxcbiAgICB2aXNpYmxlOiBib29sZWFuXG59XG5pbnRlcmZhY2UgQ29uZmlnQ29udGVudEJsb2NrcyB7XG4gICAgW2tleTogc3RyaW5nXTogQ29uZmlnQ29udGVudEJsb2NrXG59Il19
