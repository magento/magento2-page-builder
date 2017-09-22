define(['exports', './stage/structural/editable-area', './stage/structural/row', 'underscore'], function (exports, _editableArea, _row, _underscore) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _row2 = _interopRequireDefault(_row);

    var _underscore2 = _interopRequireDefault(_underscore);

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

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Stage = function (_EditableArea) {
        _inherits(Stage, _EditableArea);

        /**
         * Stage constructor
         *
         * @param parent
         * @param stageContent
         */
        function Stage(parent, stageContent) {
            _classCallCheck(this, Stage);

            var _this = _possibleConstructorReturn(this, _EditableArea.call(this));

            _this.active = true;
            _this.serializeRole = 'stage';
            _this.setChildren(stageContent);
            _this.stage = _this;
            _this.parent = parent;
            _this.showBorders = parent.showBorders;
            _this.userSelect = parent.userSelect;
            _this.loading = parent.loading;
            _underscore2.default.bindAll(_this, 'onSortingStart', 'onSortingStop');
            _this.on('sortingStart', _this.onSortingStart);
            _this.on('sortingStop', _this.onSortingStop);
            return _this;
        }

        Stage.prototype.build = function build() {
            // @todo
            this.ready();
        };

        Stage.prototype.ready = function ready() {
            this.emit('stageReady');
            this.children.valueHasMutated();
            this.loading(false);
        };

        Stage.prototype.addRow = function addRow(self, data) {
            var row = new _row2.default(self, self);
            row.data(data);
            this.addChild(row);
            return row;
        };

        Stage.prototype.openTemplateManager = function openTemplateManager() {
            // @todo
        };

        Stage.prototype.addComponent = function addComponent() {}
        // @todo

        /**
         * Event handler for any element being sorted in the stage
         */
        ;

        Stage.prototype.onSortingStart = function onSortingStart() {
            this.showBorders(true);
        };

        Stage.prototype.onSortingStop = function onSortingStop() {
            this.showBorders(false);
        };

        return Stage;
    }(_editableArea2.default);

    exports.default = Stage;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS50cyJdLCJuYW1lcyI6WyJTdGFnZSIsInBhcmVudCIsInN0YWdlQ29udGVudCIsImFjdGl2ZSIsInNlcmlhbGl6ZVJvbGUiLCJzZXRDaGlsZHJlbiIsInN0YWdlIiwic2hvd0JvcmRlcnMiLCJ1c2VyU2VsZWN0IiwibG9hZGluZyIsImJpbmRBbGwiLCJvbiIsIm9uU29ydGluZ1N0YXJ0Iiwib25Tb3J0aW5nU3RvcCIsImJ1aWxkIiwicmVhZHkiLCJlbWl0IiwiY2hpbGRyZW4iLCJ2YWx1ZUhhc011dGF0ZWQiLCJhZGRSb3ciLCJzZWxmIiwiZGF0YSIsInJvdyIsImFkZENoaWxkIiwib3BlblRlbXBsYXRlTWFuYWdlciIsImFkZENvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQVdjQSxLOzs7QUFTVjs7Ozs7O0FBTUEsdUJBQVlDLE1BQVosRUFBeUJDLFlBQXpCLEVBQW1GO0FBQUE7O0FBQUEseURBQy9FLHdCQUQrRTs7QUFabkYsa0JBQUFDLE1BQUEsR0FBa0IsSUFBbEI7QUFJQSxrQkFBQUMsYUFBQSxHQUF3QixPQUF4QjtBQVVJLGtCQUFLQyxXQUFMLENBQWlCSCxZQUFqQjtBQUNBLGtCQUFLSSxLQUFMO0FBQ0Esa0JBQUtMLE1BQUwsR0FBY0EsTUFBZDtBQUVBLGtCQUFLTSxXQUFMLEdBQW1CTixPQUFPTSxXQUExQjtBQUNBLGtCQUFLQyxVQUFMLEdBQWtCUCxPQUFPTyxVQUF6QjtBQUNBLGtCQUFLQyxPQUFMLEdBQWVSLE9BQU9RLE9BQXRCO0FBRUEsaUNBQUVDLE9BQUYsUUFFSSxnQkFGSixFQUdJLGVBSEo7QUFNQSxrQkFBS0MsRUFBTCxDQUFRLGNBQVIsRUFBd0IsTUFBS0MsY0FBN0I7QUFDQSxrQkFBS0QsRUFBTCxDQUFRLGFBQVIsRUFBdUIsTUFBS0UsYUFBNUI7QUFqQitFO0FBa0JsRjs7d0JBRURDLEssb0JBQUs7QUFDRDtBQUNBLGlCQUFLQyxLQUFMO0FBQ0gsUzs7d0JBS0RBLEssb0JBQUs7QUFDRCxpQkFBS0MsSUFBTCxDQUFVLFlBQVY7QUFDQSxpQkFBS0MsUUFBTCxDQUFjQyxlQUFkO0FBQ0EsaUJBQUtULE9BQUwsQ0FBYSxLQUFiO0FBQ0gsUzs7d0JBU0RVLE0sbUJBQU9DLEksRUFBc0JDLEksRUFBYTtBQUN0QyxnQkFBSUMsTUFBTSxrQkFBUUYsSUFBUixFQUFjQSxJQUFkLENBQVY7QUFDQUUsZ0JBQUlELElBQUosQ0FBU0EsSUFBVDtBQUNBLGlCQUFLRSxRQUFMLENBQWNELEdBQWQ7QUFFQSxtQkFBT0EsR0FBUDtBQUNILFM7O3dCQUVERSxtQixrQ0FBbUI7QUFDZjtBQUNILFM7O3dCQUVEQyxZLDJCQUFZLENBRVg7QUFERzs7QUFHSjs7Ozs7d0JBR0FiLGMsNkJBQWM7QUFDVixpQkFBS0wsV0FBTCxDQUFpQixJQUFqQjtBQUNILFM7O3dCQUtETSxhLDRCQUFhO0FBQ1QsaUJBQUtOLFdBQUwsQ0FBaUIsS0FBakI7QUFDSCxTOzs7OztzQkFwRlNQLEsiLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEVkaXRhYmxlQXJlYSBmcm9tICcuL3N0YWdlL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYSc7XG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBTdHJ1Y3R1cmFsIGFzIFN0cnVjdHVyYWxJbnRlcmZhY2UgfSBmcm9tICcuL3N0YWdlL3N0cnVjdHVyYWwvYWJzdHJhY3QuZCc7XG5pbXBvcnQgUm93IGZyb20gJy4vc3RhZ2Uvc3RydWN0dXJhbC9yb3cnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5cbi8qKlxuICogU3RhZ2UgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhZ2UgZXh0ZW5kcyBFZGl0YWJsZUFyZWEgaW1wbGVtZW50cyBTdGFnZUludGVyZmFjZSB7XG4gICAgcGFyZW50OiBhbnk7XG4gICAgc3RhZ2U6IFN0YWdlO1xuICAgIGFjdGl2ZTogYm9vbGVhbiA9IHRydWU7XG4gICAgc2hvd0JvcmRlcnM6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICB1c2VyU2VsZWN0OiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgbG9hZGluZzogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIHNlcmlhbGl6ZVJvbGU6IHN0cmluZyA9ICdzdGFnZSc7XG5cbiAgICAvKipcbiAgICAgKiBTdGFnZSBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZUNvbnRlbnRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGFueSwgc3RhZ2VDb250ZW50OiBLbm9ja291dE9ic2VydmFibGVBcnJheTxTdHJ1Y3R1cmFsSW50ZXJmYWNlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNldENoaWxkcmVuKHN0YWdlQ29udGVudCk7XG4gICAgICAgIHRoaXMuc3RhZ2UgPSB0aGlzO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblxuICAgICAgICB0aGlzLnNob3dCb3JkZXJzID0gcGFyZW50LnNob3dCb3JkZXJzO1xuICAgICAgICB0aGlzLnVzZXJTZWxlY3QgPSBwYXJlbnQudXNlclNlbGVjdDtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gcGFyZW50LmxvYWRpbmc7XG5cbiAgICAgICAgXy5iaW5kQWxsKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICdvblNvcnRpbmdTdGFydCcsXG4gICAgICAgICAgICAnb25Tb3J0aW5nU3RvcCdcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLm9uKCdzb3J0aW5nU3RhcnQnLCB0aGlzLm9uU29ydGluZ1N0YXJ0KTtcbiAgICAgICAgdGhpcy5vbignc29ydGluZ1N0b3AnLCB0aGlzLm9uU29ydGluZ1N0b3ApO1xuICAgIH1cblxuICAgIGJ1aWxkKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHN0YWdlIGhhcyBiZWVuIGluaXRpYXRlZCBmdWxseSBhbmQgaXMgcmVhZHlcbiAgICAgKi9cbiAgICByZWFkeSgpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzdGFnZVJlYWR5Jyk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4udmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgcm93IHRvIHRoZSBzdGFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHNlbGZcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtSb3d9XG4gICAgICovXG4gICAgYWRkUm93KHNlbGY6IFN0YWdlSW50ZXJmYWNlLCBkYXRhPzogb2JqZWN0KTogUm93IHtcbiAgICAgICAgbGV0IHJvdyA9IG5ldyBSb3coc2VsZiwgc2VsZik7XG4gICAgICAgIHJvdy5kYXRhKGRhdGEpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHJvdyk7XG5cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG5cbiAgICBvcGVuVGVtcGxhdGVNYW5hZ2VyKCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgIH1cblxuICAgIGFkZENvbXBvbmVudCgpIHtcbiAgICAgICAgLy8gQHRvZG9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciBhbnkgZWxlbWVudCBiZWluZyBzb3J0ZWQgaW4gdGhlIHN0YWdlXG4gICAgICovXG4gICAgb25Tb3J0aW5nU3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc2hvd0JvcmRlcnModHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBzb3J0aW5nIHN0b3BzXG4gICAgICovXG4gICAgb25Tb3J0aW5nU3RvcCgpIHtcbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyhmYWxzZSk7XG4gICAgfVxufSJdfQ==
