define(['exports', 'knockout', '../../../config'], function (exports, _knockout, _config) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ColumnBuilder = undefined;

    var _knockout2 = _interopRequireDefault(_knockout);

    var _config2 = _interopRequireDefault(_config);

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

    var ColumnBuilder = exports.ColumnBuilder = function ColumnBuilder() {
        _classCallCheck(this, ColumnBuilder);

        this.position = _knockout2.default.observable('');
        this.visible = _knockout2.default.observable(false);
        this.sizes = _knockout2.default.observableArray([]);
        /**
         * Build the sizes available for column widths
         */
        this.buildOptions = function () {
            var columnOptions = _config2.default.getInitConfig("column_definitions");
            for (var i = 0; i < columnOptions.length; i++) {
                if (columnOptions[i].displayed === true) {
                    this.sizes.push({
                        label: columnOptions[i].label,
                        className: columnOptions[i].className
                    });
                }
            }
        };
        /**
         * Retrieve template path
         */
        this.getTemplate = function () {
            return 'Gene_BlueFoot/component/stage/structural/column/builder.html';
        };
        /**
         * Show the builder from the column options scope
         */
        this.showFromOption = function (option, structure) {
            this.position('top');
            this.visible(true);
        };
        /**
         * Change the visibility to visible
         */
        this.show = function (option, structure) {
            this.visible(true);
        };
        /**
         * Change the visibility to hidden
         */
        this.hide = function () {
            this.visible(false);
        };
        /**
         * Proxy to the correct parent's add column function
         */
        this.addColumn = function (parents, data) {
            // Nest a column (within a column or on a row)
            if (this.position() == 'top') {
                parents[1].addColumn(data);
            } else {
                // Add to left or right side of current column
                parents[1].insertColumnAtIndex(this.position(), parents[1], data);
            }
        };
        this.position = _knockout2.default.observable('');
        // Build sizes to display
        this.sizes = _knockout2.default.observableArray([]);
        this.buildOptions();
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NvbHVtbi9idWlsZGVyLnRzIl0sIm5hbWVzIjpbIkNvbHVtbkJ1aWxkZXIiLCJwb3NpdGlvbiIsIm9ic2VydmFibGUiLCJ2aXNpYmxlIiwic2l6ZXMiLCJvYnNlcnZhYmxlQXJyYXkiLCJidWlsZE9wdGlvbnMiLCJjb2x1bW5PcHRpb25zIiwiZ2V0SW5pdENvbmZpZyIsImkiLCJsZW5ndGgiLCJkaXNwbGF5ZWQiLCJwdXNoIiwibGFiZWwiLCJjbGFzc05hbWUiLCJnZXRUZW1wbGF0ZSIsInNob3dGcm9tT3B0aW9uIiwib3B0aW9uIiwic3RydWN0dXJlIiwic2hvdyIsImhpZGUiLCJhZGRDb2x1bW4iLCJwYXJlbnRzIiwiZGF0YSIsImluc2VydENvbHVtbkF0SW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQU9NQSxhLFdBQUFBLGEsR0FTRix5QkFBQTtBQUFBOztBQVJBLGFBQUFDLFFBQUEsR0FBdUMsbUJBQUdDLFVBQUgsQ0FBYyxFQUFkLENBQXZDO0FBQ0EsYUFBQUMsT0FBQSxHQUF1QyxtQkFBR0QsVUFBSCxDQUFjLEtBQWQsQ0FBdkM7QUFDQSxhQUFBRSxLQUFBLEdBQXlDLG1CQUFHQyxlQUFILENBQW1CLEVBQW5CLENBQXpDO0FBYUE7OztBQUdBLGFBQUFDLFlBQUEsR0FBZSxZQUFBO0FBQ1gsZ0JBQU1DLGdCQUFnQixpQkFBT0MsYUFBUCxDQUFxQixvQkFBckIsQ0FBdEI7QUFFQSxpQkFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlGLGNBQWNHLE1BQWxDLEVBQTBDRCxHQUExQyxFQUErQztBQUMzQyxvQkFBSUYsY0FBY0UsQ0FBZCxFQUFpQkUsU0FBakIsS0FBK0IsSUFBbkMsRUFBeUM7QUFDckMseUJBQUtQLEtBQUwsQ0FBV1EsSUFBWCxDQUFnQjtBQUNaQywrQkFBT04sY0FBY0UsQ0FBZCxFQUFpQkksS0FEWjtBQUVaQyxtQ0FBV1AsY0FBY0UsQ0FBZCxFQUFpQks7QUFGaEIscUJBQWhCO0FBSUg7QUFDSjtBQUNKLFNBWEQ7QUFhQTs7O0FBR0EsYUFBQUMsV0FBQSxHQUFjLFlBQUE7QUFDVixtQkFBTyw4REFBUDtBQUNILFNBRkQ7QUFJQTs7O0FBR0EsYUFBQUMsY0FBQSxHQUFpQixVQUFVQyxNQUFWLEVBQXVCQyxTQUF2QixFQUFxQztBQUNsRCxpQkFBS2pCLFFBQUwsQ0FBYyxLQUFkO0FBQ0EsaUJBQUtFLE9BQUwsQ0FBYSxJQUFiO0FBQ0gsU0FIRDtBQUtBOzs7QUFHQSxhQUFBZ0IsSUFBQSxHQUFPLFVBQVVGLE1BQVYsRUFBdUJDLFNBQXZCLEVBQXFDO0FBQ3hDLGlCQUFLZixPQUFMLENBQWEsSUFBYjtBQUNILFNBRkQ7QUFJQTs7O0FBR0EsYUFBQWlCLElBQUEsR0FBTyxZQUFBO0FBQ0gsaUJBQUtqQixPQUFMLENBQWEsS0FBYjtBQUNILFNBRkQ7QUFJQTs7O0FBR0EsYUFBQWtCLFNBQUEsR0FBWSxVQUFVQyxPQUFWLEVBQXdCQyxJQUF4QixFQUFpQztBQUN6QztBQUNBLGdCQUFJLEtBQUt0QixRQUFMLE1BQW1CLEtBQXZCLEVBQThCO0FBQzFCcUIsd0JBQVEsQ0FBUixFQUFXRCxTQUFYLENBQXFCRSxJQUFyQjtBQUNILGFBRkQsTUFFTztBQUNIO0FBQ0FELHdCQUFRLENBQVIsRUFBV0UsbUJBQVgsQ0FBK0IsS0FBS3ZCLFFBQUwsRUFBL0IsRUFBZ0RxQixRQUFRLENBQVIsQ0FBaEQsRUFBNERDLElBQTVEO0FBQ0g7QUFDSixTQVJEO0FBdERJLGFBQUt0QixRQUFMLEdBQWdCLG1CQUFHQyxVQUFILENBQWMsRUFBZCxDQUFoQjtBQUNBO0FBQ0EsYUFBS0UsS0FBTCxHQUFhLG1CQUFHQyxlQUFILENBQW1CLEVBQW5CLENBQWI7QUFDQSxhQUFLQyxZQUFMO0FBQ0gsSyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4vYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBrbyBmcm9tICdrbm9ja291dCc7XG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuLi8uLi8uLi9jb25maWdcIjtcblxuLyoqXG4gKiBDb2x1bW5CdWlsZGVyIEludGVyZmFjZVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIENvbHVtbkJ1aWxkZXIge1xuICAgIHBvc2l0aW9uOiBLbm9ja291dE9ic2VydmFibGU8c3RyaW5nPiA9IGtvLm9ic2VydmFibGUoJycpO1xuICAgIHZpc2libGU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIHNpemVzOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxvYmplY3Q+ID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuICAgIC8qKlxuICAgICAqIENvbHVtbkJ1aWxkZXIgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0ga28ub2JzZXJ2YWJsZSgnJyk7XG4gICAgICAgIC8vIEJ1aWxkIHNpemVzIHRvIGRpc3BsYXlcbiAgICAgICAgdGhpcy5zaXplcyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgICAgIHRoaXMuYnVpbGRPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIHNpemVzIGF2YWlsYWJsZSBmb3IgY29sdW1uIHdpZHRoc1xuICAgICAqL1xuICAgIGJ1aWxkT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgY29sdW1uT3B0aW9ucyA9IENvbmZpZy5nZXRJbml0Q29uZmlnKFwiY29sdW1uX2RlZmluaXRpb25zXCIpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1uT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNvbHVtbk9wdGlvbnNbaV0uZGlzcGxheWVkID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaXplcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IGNvbHVtbk9wdGlvbnNbaV0ubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogY29sdW1uT3B0aW9uc1tpXS5jbGFzc05hbWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0ZW1wbGF0ZSBwYXRoXG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jb2x1bW4vYnVpbGRlci5odG1sJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBidWlsZGVyIGZyb20gdGhlIGNvbHVtbiBvcHRpb25zIHNjb3BlXG4gICAgICovXG4gICAgc2hvd0Zyb21PcHRpb24gPSBmdW5jdGlvbiAob3B0aW9uOiBhbnksIHN0cnVjdHVyZTogYW55KSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24oJ3RvcCcpO1xuICAgICAgICB0aGlzLnZpc2libGUodHJ1ZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgdmlzaWJpbGl0eSB0byB2aXNpYmxlXG4gICAgICovXG4gICAgc2hvdyA9IGZ1bmN0aW9uIChvcHRpb246IGFueSwgc3RydWN0dXJlOiBhbnkpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlKHRydWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIHZpc2liaWxpdHkgdG8gaGlkZGVuXG4gICAgICovXG4gICAgaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlKGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUHJveHkgdG8gdGhlIGNvcnJlY3QgcGFyZW50J3MgYWRkIGNvbHVtbiBmdW5jdGlvblxuICAgICAqL1xuICAgIGFkZENvbHVtbiA9IGZ1bmN0aW9uIChwYXJlbnRzOiBhbnksIGRhdGE6IGFueSkge1xuICAgICAgICAvLyBOZXN0IGEgY29sdW1uICh3aXRoaW4gYSBjb2x1bW4gb3Igb24gYSByb3cpXG4gICAgICAgIGlmICh0aGlzLnBvc2l0aW9uKCkgPT0gJ3RvcCcpIHtcbiAgICAgICAgICAgIHBhcmVudHNbMV0uYWRkQ29sdW1uKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWRkIHRvIGxlZnQgb3IgcmlnaHQgc2lkZSBvZiBjdXJyZW50IGNvbHVtblxuICAgICAgICAgICAgcGFyZW50c1sxXS5pbnNlcnRDb2x1bW5BdEluZGV4KHRoaXMucG9zaXRpb24oKSwgcGFyZW50c1sxXSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG59Il19
