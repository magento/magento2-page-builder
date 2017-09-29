define(["exports", "./editable-area", "./options", "./options/option", "./column/builder", "mage/translate", "knockout"], function (exports, _editableArea, _options, _option, _builder, _translate, _knockout) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AbstractStructural = undefined;

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _translate2 = _interopRequireDefault(_translate);

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

    var AbstractStructural = exports.AbstractStructural = function (_EditableArea) {
        _inherits(AbstractStructural, _EditableArea);

        /**
         * Abstract structural constructor
         *
         * @param parent
         * @param stage
         */
        function AbstractStructural(parent, stage) {
            _classCallCheck(this, AbstractStructural);

            var _this = _possibleConstructorReturn(this, _EditableArea.call(this, stage));

            _this.wrapperStyle = _knockout2.default.observable({ width: '100%' });
            _this.options = [new _option.Option(_this, 'move', '<i></i>', (0, _translate2.default)('Move'), false, ['move-structural'], 10), new _option.Option(_this, 'edit', '<i></i>', (0, _translate2.default)('Edit'), _this.onOptionEdit.bind(_this), ['edit-block'], 50), new _option.Option(_this, 'duplicate', '<i></i>', (0, _translate2.default)('Duplicate'), _this.onOptionDuplicate.bind(_this), ['duplicate-structural'], 60), new _option.Option(_this, 'remove', '<i></i>', (0, _translate2.default)('Remove'), _this.onOptionRemove.bind(_this), ['remove-structural'], 100)];
            _this.optionsInstance = new _options.Options(_this, _this.options);
            _this.children = _knockout2.default.observableArray([]);
            _this.template = 'Gene_BlueFoot/component/stage/structural/abstract.html';
            _this.childTemplate = 'Gene_BlueFoot/component/stage/structural/children.html';
            _this.columnBuilder = new _builder.ColumnBuilder();
            _EditableArea.prototype.setChildren.call(_this, _this.children);
            _this.parent = parent;
            _this.stage = stage;
            return _this;
        }

        AbstractStructural.prototype.onOptionEdit = function onOptionEdit() {};
        /**
         * Handle duplicate of items
         */


        AbstractStructural.prototype.onOptionDuplicate = function onOptionDuplicate() {}
        // @todo discuss how to best duplicate a block

        /**
         * Handle block removal
         */
        ;

        AbstractStructural.prototype.onOptionRemove = function onOptionRemove() {
            var _this2 = this;

            this.stage.parent.confirmationDialog({
                title: 'Confirm Item Removal',
                content: 'Are you sure you want to remove this item? The data within this item is not recoverable once removed.',
                actions: {
                    confirm: function confirm() {
                        // Call the parent to remove the child element
                        _this2.parent.emit('blockRemoved', {
                            block: _this2
                        });
                    }
                }
            });
        };
        /**
         * Retrieve the template from the class
         *
         * @deprecated use this.template instead
         * @returns {string}
         */


        AbstractStructural.prototype.getTemplate = function getTemplate() {
            return this.template;
        };
        /**
         * Retrieve the child template
         *
         * @deprecated
         * @returns {string}
         */


        AbstractStructural.prototype.getChildTemplate = function getChildTemplate() {
            return this.childTemplate;
        };

        return AbstractStructural;
    }(_editableArea2.default);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LnRzIl0sIm5hbWVzIjpbIkFic3RyYWN0U3RydWN0dXJhbCIsInBhcmVudCIsInN0YWdlIiwid3JhcHBlclN0eWxlIiwib2JzZXJ2YWJsZSIsIndpZHRoIiwib3B0aW9ucyIsIm9uT3B0aW9uRWRpdCIsImJpbmQiLCJvbk9wdGlvbkR1cGxpY2F0ZSIsIm9uT3B0aW9uUmVtb3ZlIiwib3B0aW9uc0luc3RhbmNlIiwiY2hpbGRyZW4iLCJvYnNlcnZhYmxlQXJyYXkiLCJ0ZW1wbGF0ZSIsImNoaWxkVGVtcGxhdGUiLCJjb2x1bW5CdWlsZGVyIiwic2V0Q2hpbGRyZW4iLCJjb25maXJtYXRpb25EaWFsb2ciLCJ0aXRsZSIsImNvbnRlbnQiLCJhY3Rpb25zIiwiY29uZmlybSIsImVtaXQiLCJibG9jayIsImdldFRlbXBsYXRlIiwiZ2V0Q2hpbGRUZW1wbGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFpQk1BLGtCLFdBQUFBLGtCOzs7QUFpQkY7Ozs7OztBQU1BLG9DQUFZQyxNQUFaLEVBQTJDQyxLQUEzQyxFQUFnRTtBQUFBOztBQUFBLHlEQUM1RCx5QkFBTUEsS0FBTixDQUQ0RDs7QUFuQmhFLGtCQUFBQyxZQUFBLEdBQTJDLG1CQUFHQyxVQUFILENBQWMsRUFBQ0MsT0FBTyxNQUFSLEVBQWQsQ0FBM0M7QUFDTyxrQkFBQUMsT0FBQSxHQUFrQyxDQUNyQywwQkFBaUIsTUFBakIsRUFBeUIsVUFBekIsRUFBcUMseUJBQUcsTUFBSCxDQUFyQyxFQUFpRCxLQUFqRCxFQUF3RCxDQUFDLGlCQUFELENBQXhELEVBQTZFLEVBQTdFLENBRHFDLEVBRXJDLDBCQUFpQixNQUFqQixFQUF5QixVQUF6QixFQUFxQyx5QkFBRyxNQUFILENBQXJDLEVBQWlELE1BQUtDLFlBQUwsQ0FBa0JDLElBQWxCLE9BQWpELEVBQStFLENBQUMsWUFBRCxDQUEvRSxFQUErRixFQUEvRixDQUZxQyxFQUdyQywwQkFBaUIsV0FBakIsRUFBOEIsVUFBOUIsRUFBMEMseUJBQUcsV0FBSCxDQUExQyxFQUEyRCxNQUFLQyxpQkFBTCxDQUF1QkQsSUFBdkIsT0FBM0QsRUFBOEYsQ0FBQyxzQkFBRCxDQUE5RixFQUF3SCxFQUF4SCxDQUhxQyxFQUlyQywwQkFBaUIsUUFBakIsRUFBMkIsVUFBM0IsRUFBdUMseUJBQUcsUUFBSCxDQUF2QyxFQUFxRCxNQUFLRSxjQUFMLENBQW9CRixJQUFwQixPQUFyRCxFQUFxRixDQUFDLG1CQUFELENBQXJGLEVBQTRHLEdBQTVHLENBSnFDLENBQWxDO0FBTVAsa0JBQUFHLGVBQUEsR0FBMkIsNEJBQWtCLE1BQUtMLE9BQXZCLENBQTNCO0FBQ0Esa0JBQUFNLFFBQUEsR0FBeUQsbUJBQUdDLGVBQUgsQ0FBbUIsRUFBbkIsQ0FBekQ7QUFDQSxrQkFBQUMsUUFBQSxHQUFtQix3REFBbkI7QUFDQSxrQkFBQUMsYUFBQSxHQUF3Qix3REFBeEI7QUFDQSxrQkFBQUMsYUFBQSxHQUErQiw0QkFBL0I7QUFVSSxvQ0FBTUMsV0FBTixhQUFrQixNQUFLTCxRQUF2QjtBQUVBLGtCQUFLWCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxrQkFBS0MsS0FBTCxHQUFhQSxLQUFiO0FBTDREO0FBTS9EOztxQ0FFREssWSwyQkFBWSxDQUVYLEM7QUFFRDs7Ozs7cUNBR0FFLGlCLGdDQUFpQixDQUVoQjtBQURHOztBQUdKOzs7OztxQ0FHQUMsYyw2QkFBYztBQUFBOztBQUNWLGlCQUFLUixLQUFMLENBQVdELE1BQVgsQ0FBa0JpQixrQkFBbEIsQ0FBcUM7QUFDakNDLHVCQUFPLHNCQUQwQjtBQUVqQ0MseUJBQVMsdUdBRndCO0FBR2pDQyx5QkFBUztBQUNMQyw2QkFBUyxtQkFBQTtBQUNMO0FBQ0EsK0JBQUtyQixNQUFMLENBQVlzQixJQUFaLENBQWlCLGNBQWpCLEVBQWlDO0FBQzdCQztBQUQ2Qix5QkFBakM7QUFHSDtBQU5JO0FBSHdCLGFBQXJDO0FBWUgsUztBQUVEOzs7Ozs7OztxQ0FNQUMsVywwQkFBVztBQUNQLG1CQUFPLEtBQUtYLFFBQVo7QUFDSCxTO0FBRUQ7Ozs7Ozs7O3FDQU1BWSxnQiwrQkFBZ0I7QUFDWixtQkFBTyxLQUFLWCxhQUFaO0FBQ0gsUyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9hYnN0cmFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5pbXBvcnQgRWRpdGFibGVBcmVhIGZyb20gJy4vZWRpdGFibGUtYXJlYSc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL2VkaXRhYmxlLWFyZWEuZCc7XG5pbXBvcnQgeyBTdHJ1Y3R1cmFsIGFzIFN0cnVjdHVyYWxJbnRlcmZhY2UgfSBmcm9tIFwiLi9hYnN0cmFjdC5kXCI7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSBcIi4vb3B0aW9uc1wiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbmltcG9ydCB7IE9wdGlvbkludGVyZmFjZSB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uLmRcIjtcbmltcG9ydCB7IENvbHVtbkJ1aWxkZXIgfSBmcm9tIFwiLi9jb2x1bW4vYnVpbGRlclwiO1xuXG5pbXBvcnQgJHQgZnJvbSAnbWFnZS90cmFuc2xhdGUnO1xuaW1wb3J0IGtvIGZyb20gJ2tub2Nrb3V0JztcblxuLyoqXG4gKiBBYnN0cmFjdFN0cnVjdHVyYWwgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIEFic3RyYWN0U3RydWN0dXJhbCBleHRlbmRzIEVkaXRhYmxlQXJlYSBpbXBsZW1lbnRzIFN0cnVjdHVyYWxJbnRlcmZhY2Uge1xuICAgIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlO1xuICAgIHN0YWdlOiBTdGFnZUludGVyZmFjZTtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHdyYXBwZXJTdHlsZTogS25vY2tvdXRPYnNlcnZhYmxlPG9iamVjdD4gPSBrby5vYnNlcnZhYmxlKHt3aWR0aDogJzEwMCUnfSk7XG4gICAgcHVibGljIG9wdGlvbnM6IEFycmF5PE9wdGlvbkludGVyZmFjZT4gPSBbXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ21vdmUnLCAnPGk+7piXPC9pPicsICR0KCdNb3ZlJyksIGZhbHNlLCBbJ21vdmUtc3RydWN0dXJhbCddLCAxMCksXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2VkaXQnLCAnPGk+7piQPC9pPicsICR0KCdFZGl0JyksIHRoaXMub25PcHRpb25FZGl0LmJpbmQodGhpcyksIFsnZWRpdC1ibG9jayddLCA1MCksXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2R1cGxpY2F0ZScsICc8aT7umLo8L2k+JywgJHQoJ0R1cGxpY2F0ZScpLCB0aGlzLm9uT3B0aW9uRHVwbGljYXRlLmJpbmQodGhpcyksIFsnZHVwbGljYXRlLXN0cnVjdHVyYWwnXSwgNjApLFxuICAgICAgICBuZXcgT3B0aW9uKHRoaXMsICdyZW1vdmUnLCAnPGk+7piwPC9pPicsICR0KCdSZW1vdmUnKSwgdGhpcy5vbk9wdGlvblJlbW92ZS5iaW5kKHRoaXMpLCBbJ3JlbW92ZS1zdHJ1Y3R1cmFsJ10sIDEwMClcbiAgICBdO1xuICAgIG9wdGlvbnNJbnN0YW5jZTogT3B0aW9ucyA9IG5ldyBPcHRpb25zKHRoaXMsIHRoaXMub3B0aW9ucyk7XG4gICAgY2hpbGRyZW46IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PFN0cnVjdHVyYWxJbnRlcmZhY2U+ID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcbiAgICB0ZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvYWJzdHJhY3QuaHRtbCc7XG4gICAgY2hpbGRUZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvY2hpbGRyZW4uaHRtbCc7XG4gICAgY29sdW1uQnVpbGRlcjogQ29sdW1uQnVpbGRlciA9IG5ldyBDb2x1bW5CdWlsZGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBBYnN0cmFjdCBzdHJ1Y3R1cmFsIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UsIHN0YWdlOiBTdGFnZUludGVyZmFjZSkge1xuICAgICAgICBzdXBlcihzdGFnZSk7XG4gICAgICAgIHN1cGVyLnNldENoaWxkcmVuKHRoaXMuY2hpbGRyZW4pO1xuXG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgfVxuXG4gICAgb25PcHRpb25FZGl0KCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGR1cGxpY2F0ZSBvZiBpdGVtc1xuICAgICAqL1xuICAgIG9uT3B0aW9uRHVwbGljYXRlKCk6IHZvaWQge1xuICAgICAgICAvLyBAdG9kbyBkaXNjdXNzIGhvdyB0byBiZXN0IGR1cGxpY2F0ZSBhIGJsb2NrXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGJsb2NrIHJlbW92YWxcbiAgICAgKi9cbiAgICBvbk9wdGlvblJlbW92ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGFnZS5wYXJlbnQuY29uZmlybWF0aW9uRGlhbG9nKHtcbiAgICAgICAgICAgIHRpdGxlOiAnQ29uZmlybSBJdGVtIFJlbW92YWwnLFxuICAgICAgICAgICAgY29udGVudDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhpcyBpdGVtPyBUaGUgZGF0YSB3aXRoaW4gdGhpcyBpdGVtIGlzIG5vdCByZWNvdmVyYWJsZSBvbmNlIHJlbW92ZWQuJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBjb25maXJtOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIHBhcmVudCB0byByZW1vdmUgdGhlIGNoaWxkIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuZW1pdCgnYmxvY2tSZW1vdmVkJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2s6IHRoaXNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdGVtcGxhdGUgZnJvbSB0aGUgY2xhc3NcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIHVzZSB0aGlzLnRlbXBsYXRlIGluc3RlYWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBjaGlsZCB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldENoaWxkVGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRUZW1wbGF0ZTtcbiAgICB9XG59Il19
