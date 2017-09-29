define(['exports', './stage/structural/editable-area', './stage/structural/row', 'underscore', './data-store'], function (exports, _editableArea, _row, _underscore, _dataStore) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _row2 = _interopRequireDefault(_row);

    var _underscore2 = _interopRequireDefault(_underscore);

    var _dataStore2 = _interopRequireDefault(_dataStore);

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
            // Create our state and store objects
            _this.store = new _dataStore2.default();
            window.store = _this.store;
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
            this.store.update(row.id, data);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS50cyJdLCJuYW1lcyI6WyJTdGFnZSIsInBhcmVudCIsInN0YWdlQ29udGVudCIsImFjdGl2ZSIsInNlcmlhbGl6ZVJvbGUiLCJzZXRDaGlsZHJlbiIsInN0YWdlIiwic2hvd0JvcmRlcnMiLCJ1c2VyU2VsZWN0IiwibG9hZGluZyIsInN0b3JlIiwid2luZG93IiwiYmluZEFsbCIsIm9uIiwib25Tb3J0aW5nU3RhcnQiLCJvblNvcnRpbmdTdG9wIiwiYnVpbGQiLCJyZWFkeSIsImVtaXQiLCJjaGlsZHJlbiIsInZhbHVlSGFzTXV0YXRlZCIsImFkZFJvdyIsInNlbGYiLCJkYXRhIiwicm93IiwidXBkYXRlIiwiaWQiLCJhZGRDaGlsZCIsIm9wZW5UZW1wbGF0ZU1hbmFnZXIiLCJhZGRDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWFjQSxLOzs7QUFVVjs7Ozs7O0FBTUEsdUJBQVlDLE1BQVosRUFBeUJDLFlBQXpCLEVBQW1GO0FBQUE7O0FBQUEseURBQy9FLHdCQUQrRTs7QUFibkYsa0JBQUFDLE1BQUEsR0FBa0IsSUFBbEI7QUFJQSxrQkFBQUMsYUFBQSxHQUF3QixPQUF4QjtBQVdJLGtCQUFLQyxXQUFMLENBQWlCSCxZQUFqQjtBQUNBLGtCQUFLSSxLQUFMO0FBQ0Esa0JBQUtMLE1BQUwsR0FBY0EsTUFBZDtBQUVBLGtCQUFLTSxXQUFMLEdBQW1CTixPQUFPTSxXQUExQjtBQUNBLGtCQUFLQyxVQUFMLEdBQWtCUCxPQUFPTyxVQUF6QjtBQUNBLGtCQUFLQyxPQUFMLEdBQWVSLE9BQU9RLE9BQXRCO0FBRUE7QUFDQSxrQkFBS0MsS0FBTCxHQUFhLHlCQUFiO0FBQ0FDLG1CQUFPRCxLQUFQLEdBQWUsTUFBS0EsS0FBcEI7QUFFQSxpQ0FBRUUsT0FBRixRQUVJLGdCQUZKLEVBR0ksZUFISjtBQU1BLGtCQUFLQyxFQUFMLENBQVEsY0FBUixFQUF3QixNQUFLQyxjQUE3QjtBQUNBLGtCQUFLRCxFQUFMLENBQVEsYUFBUixFQUF1QixNQUFLRSxhQUE1QjtBQXJCK0U7QUFzQmxGOzt3QkFFREMsSyxvQkFBSztBQUNEO0FBQ0EsaUJBQUtDLEtBQUw7QUFDSCxTOzt3QkFLREEsSyxvQkFBSztBQUNELGlCQUFLQyxJQUFMLENBQVUsWUFBVjtBQUNBLGlCQUFLQyxRQUFMLENBQWNDLGVBQWQ7QUFDQSxpQkFBS1gsT0FBTCxDQUFhLEtBQWI7QUFDSCxTOzt3QkFTRFksTSxtQkFBT0MsSSxFQUFzQkMsSSxFQUFpQjtBQUMxQyxnQkFBSUMsTUFBTSxrQkFBUUYsSUFBUixFQUFjQSxJQUFkLENBQVY7QUFDQSxpQkFBS1osS0FBTCxDQUFXZSxNQUFYLENBQWtCRCxJQUFJRSxFQUF0QixFQUEwQkgsSUFBMUI7QUFDQSxpQkFBS0ksUUFBTCxDQUFjSCxHQUFkO0FBRUEsbUJBQU9BLEdBQVA7QUFDSCxTOzt3QkFFREksbUIsa0NBQW1CO0FBQ2Y7QUFDSCxTOzt3QkFFREMsWSwyQkFBWSxDQUVYO0FBREc7O0FBR0o7Ozs7O3dCQUdBZixjLDZCQUFjO0FBQ1YsaUJBQUtQLFdBQUwsQ0FBaUIsSUFBakI7QUFDSCxTOzt3QkFLRFEsYSw0QkFBYTtBQUNULGlCQUFLUixXQUFMLENBQWlCLEtBQWpCO0FBQ0gsUzs7Ozs7c0JBekZTUCxLIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFZGl0YWJsZUFyZWEgZnJvbSAnLi9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuL3N0YWdlLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSAnLi9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LmQnO1xuaW1wb3J0IFJvdyBmcm9tICcuL3N0YWdlL3N0cnVjdHVyYWwvcm93JztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IERhdGFTdG9yZSBmcm9tIFwiLi9kYXRhLXN0b3JlXCI7XG5pbXBvcnQge0RhdGFPYmplY3R9IGZyb20gXCIuL2RhdGEtc3RvcmVcIjtcblxuLyoqXG4gKiBTdGFnZSBjbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFnZSBleHRlbmRzIEVkaXRhYmxlQXJlYSBpbXBsZW1lbnRzIFN0YWdlSW50ZXJmYWNlIHtcbiAgICBwYXJlbnQ6IGFueTtcbiAgICBzdGFnZTogU3RhZ2U7XG4gICAgYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcbiAgICBzaG93Qm9yZGVyczogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIHVzZXJTZWxlY3Q6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBsb2FkaW5nOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgc2VyaWFsaXplUm9sZTogc3RyaW5nID0gJ3N0YWdlJztcbiAgICBzdG9yZTogRGF0YVN0b3JlO1xuXG4gICAgLyoqXG4gICAgICogU3RhZ2UgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gc3RhZ2VDb250ZW50XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBhbnksIHN0YWdlQ29udGVudDogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8U3RydWN0dXJhbEludGVyZmFjZT4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zZXRDaGlsZHJlbihzdGFnZUNvbnRlbnQpO1xuICAgICAgICB0aGlzLnN0YWdlID0gdGhpcztcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG5cbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyA9IHBhcmVudC5zaG93Qm9yZGVycztcbiAgICAgICAgdGhpcy51c2VyU2VsZWN0ID0gcGFyZW50LnVzZXJTZWxlY3Q7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHBhcmVudC5sb2FkaW5nO1xuXG4gICAgICAgIC8vIENyZWF0ZSBvdXIgc3RhdGUgYW5kIHN0b3JlIG9iamVjdHNcbiAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBEYXRhU3RvcmUoKTtcbiAgICAgICAgd2luZG93LnN0b3JlID0gdGhpcy5zdG9yZTtcblxuICAgICAgICBfLmJpbmRBbGwoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgJ29uU29ydGluZ1N0YXJ0JyxcbiAgICAgICAgICAgICdvblNvcnRpbmdTdG9wJ1xuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMub24oJ3NvcnRpbmdTdGFydCcsIHRoaXMub25Tb3J0aW5nU3RhcnQpO1xuICAgICAgICB0aGlzLm9uKCdzb3J0aW5nU3RvcCcsIHRoaXMub25Tb3J0aW5nU3RvcCk7XG4gICAgfVxuXG4gICAgYnVpbGQoKSB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3RhZ2UgaGFzIGJlZW4gaW5pdGlhdGVkIGZ1bGx5IGFuZCBpcyByZWFkeVxuICAgICAqL1xuICAgIHJlYWR5KCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3N0YWdlUmVhZHknKTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSByb3cgdG8gdGhlIHN0YWdlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VsZlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHJldHVybnMge1Jvd31cbiAgICAgKi9cbiAgICBhZGRSb3coc2VsZjogU3RhZ2VJbnRlcmZhY2UsIGRhdGE/OiBEYXRhT2JqZWN0KTogUm93IHtcbiAgICAgICAgbGV0IHJvdyA9IG5ldyBSb3coc2VsZiwgc2VsZik7XG4gICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKHJvdy5pZCwgZGF0YSk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQocm93KTtcblxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cblxuICAgIG9wZW5UZW1wbGF0ZU1hbmFnZXIoKSB7XG4gICAgICAgIC8vIEB0b2RvXG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KCkge1xuICAgICAgICAvLyBAdG9kb1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIGFueSBlbGVtZW50IGJlaW5nIHNvcnRlZCBpbiB0aGUgc3RhZ2VcbiAgICAgKi9cbiAgICBvblNvcnRpbmdTdGFydCgpIHtcbiAgICAgICAgdGhpcy5zaG93Qm9yZGVycyh0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHNvcnRpbmcgc3RvcHNcbiAgICAgKi9cbiAgICBvblNvcnRpbmdTdG9wKCkge1xuICAgICAgICB0aGlzLnNob3dCb3JkZXJzKGZhbHNlKTtcbiAgICB9XG59Il19
