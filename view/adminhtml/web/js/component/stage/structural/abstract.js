define(["exports", "./editable-area", "./options", "./options/option", "./column/builder", "mage/translate", "knockout", "mageUtils"], function (exports, _editableArea, _options, _option, _builder, _translate, _knockout, _mageUtils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AbstractStructural = undefined;

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _translate2 = _interopRequireDefault(_translate);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _mageUtils2 = _interopRequireDefault(_mageUtils);

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

            _this.id = _mageUtils2.default.uniqueid();
            _this.wrapperStyle = _knockout2.default.observable({ width: '100%' });
            _this.options = [new _option.Option(_this, 'move', '<i></i>', (0, _translate2.default)('Move'), false, ['move-structural'], 10), new _option.Option(_this, 'edit', '<i></i>', (0, _translate2.default)('Edit'), _this.onOptionEdit.bind(_this), ['edit-block'], 50), new _option.Option(_this, 'duplicate', '<i></i>', (0, _translate2.default)('Duplicate'), _this.onOptionDuplicate.bind(_this), ['duplicate-structural'], 60), new _option.Option(_this, 'remove', '<i></i>', (0, _translate2.default)('Remove'), _this.onOptionRemove.bind(_this), ['remove-structural'], 100)];
            _this.optionsInstance = new _options.Options(_this, _this.options);
            _this.data = _knockout2.default.observable({});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LnRzIl0sIm5hbWVzIjpbIkFic3RyYWN0U3RydWN0dXJhbCIsInBhcmVudCIsInN0YWdlIiwiaWQiLCJ1bmlxdWVpZCIsIndyYXBwZXJTdHlsZSIsIm9ic2VydmFibGUiLCJ3aWR0aCIsIm9wdGlvbnMiLCJvbk9wdGlvbkVkaXQiLCJiaW5kIiwib25PcHRpb25EdXBsaWNhdGUiLCJvbk9wdGlvblJlbW92ZSIsIm9wdGlvbnNJbnN0YW5jZSIsImRhdGEiLCJjaGlsZHJlbiIsIm9ic2VydmFibGVBcnJheSIsInRlbXBsYXRlIiwiY2hpbGRUZW1wbGF0ZSIsImNvbHVtbkJ1aWxkZXIiLCJzZXRDaGlsZHJlbiIsImNvbmZpcm1hdGlvbkRpYWxvZyIsInRpdGxlIiwiY29udGVudCIsImFjdGlvbnMiLCJjb25maXJtIiwiZW1pdCIsImJsb2NrIiwiZ2V0VGVtcGxhdGUiLCJnZXRDaGlsZFRlbXBsYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBbUJNQSxrQixXQUFBQSxrQjs7O0FBbUJGOzs7Ozs7QUFNQSxvQ0FBWUMsTUFBWixFQUEyQ0MsS0FBM0MsRUFBZ0U7QUFBQTs7QUFBQSx5REFDNUQseUJBQU1BLEtBQU4sQ0FENEQ7O0FBdEJoRSxrQkFBQUMsRUFBQSxHQUFhLG9CQUFVQyxRQUFWLEVBQWI7QUFFQSxrQkFBQUMsWUFBQSxHQUEyQyxtQkFBR0MsVUFBSCxDQUFjLEVBQUNDLE9BQU8sTUFBUixFQUFkLENBQTNDO0FBQ08sa0JBQUFDLE9BQUEsR0FBa0MsQ0FDckMsMEJBQWlCLE1BQWpCLEVBQXlCLFVBQXpCLEVBQXFDLHlCQUFHLE1BQUgsQ0FBckMsRUFBaUQsS0FBakQsRUFBd0QsQ0FBQyxpQkFBRCxDQUF4RCxFQUE2RSxFQUE3RSxDQURxQyxFQUVyQywwQkFBaUIsTUFBakIsRUFBeUIsVUFBekIsRUFBcUMseUJBQUcsTUFBSCxDQUFyQyxFQUFpRCxNQUFLQyxZQUFMLENBQWtCQyxJQUFsQixPQUFqRCxFQUErRSxDQUFDLFlBQUQsQ0FBL0UsRUFBK0YsRUFBL0YsQ0FGcUMsRUFHckMsMEJBQWlCLFdBQWpCLEVBQThCLFVBQTlCLEVBQTBDLHlCQUFHLFdBQUgsQ0FBMUMsRUFBMkQsTUFBS0MsaUJBQUwsQ0FBdUJELElBQXZCLE9BQTNELEVBQThGLENBQUMsc0JBQUQsQ0FBOUYsRUFBd0gsRUFBeEgsQ0FIcUMsRUFJckMsMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLHlCQUFHLFFBQUgsQ0FBdkMsRUFBcUQsTUFBS0UsY0FBTCxDQUFvQkYsSUFBcEIsT0FBckQsRUFBcUYsQ0FBQyxtQkFBRCxDQUFyRixFQUE0RyxHQUE1RyxDQUpxQyxDQUFsQztBQU1QLGtCQUFBRyxlQUFBLEdBQTJCLDRCQUFrQixNQUFLTCxPQUF2QixDQUEzQjtBQUNBLGtCQUFBTSxJQUFBLEdBQW1DLG1CQUFHUixVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGtCQUFBUyxRQUFBLEdBQXlELG1CQUFHQyxlQUFILENBQW1CLEVBQW5CLENBQXpEO0FBQ0Esa0JBQUFDLFFBQUEsR0FBbUIsd0RBQW5CO0FBQ0Esa0JBQUFDLGFBQUEsR0FBd0Isd0RBQXhCO0FBQ0Esa0JBQUFDLGFBQUEsR0FBK0IsNEJBQS9CO0FBVUksb0NBQU1DLFdBQU4sYUFBa0IsTUFBS0wsUUFBdkI7QUFFQSxrQkFBS2QsTUFBTCxHQUFjQSxNQUFkO0FBQ0Esa0JBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUw0RDtBQU0vRDs7cUNBRURPLFksMkJBQVksQ0FFWCxDO0FBRUQ7Ozs7O3FDQUdBRSxpQixnQ0FBaUIsQ0FFaEI7QUFERzs7QUFHSjs7Ozs7cUNBR0FDLGMsNkJBQWM7QUFBQTs7QUFDVixpQkFBS1YsS0FBTCxDQUFXRCxNQUFYLENBQWtCb0Isa0JBQWxCLENBQXFDO0FBQ2pDQyx1QkFBTyxzQkFEMEI7QUFFakNDLHlCQUFTLHVHQUZ3QjtBQUdqQ0MseUJBQVM7QUFDTEMsNkJBQVMsbUJBQUE7QUFDTDtBQUNBLCtCQUFLeEIsTUFBTCxDQUFZeUIsSUFBWixDQUFpQixjQUFqQixFQUFpQztBQUM3QkM7QUFENkIseUJBQWpDO0FBR0g7QUFOSTtBQUh3QixhQUFyQztBQVlILFM7QUFFRDs7Ozs7Ozs7cUNBTUFDLFcsMEJBQVc7QUFDUCxtQkFBTyxLQUFLWCxRQUFaO0FBQ0gsUztBQUVEOzs7Ozs7OztxQ0FNQVksZ0IsK0JBQWdCO0FBQ1osbUJBQU8sS0FBS1gsYUFBWjtBQUNILFMiLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvYWJzdHJhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uLy4uL3N0YWdlLmQnO1xuaW1wb3J0IEVkaXRhYmxlQXJlYSBmcm9tICcuL2VkaXRhYmxlLWFyZWEnO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSBcIi4vYWJzdHJhY3QuZFwiO1xuaW1wb3J0IHsgT3B0aW9ucyB9IGZyb20gXCIuL29wdGlvbnNcIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uXCI7XG5pbXBvcnQgeyBPcHRpb25JbnRlcmZhY2UgfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvbi5kXCI7XG5pbXBvcnQgeyBDb2x1bW5CdWlsZGVyIH0gZnJvbSBcIi4vY29sdW1uL2J1aWxkZXJcIjtcblxuaW1wb3J0ICR0IGZyb20gJ21hZ2UvdHJhbnNsYXRlJztcbmltcG9ydCBrbyBmcm9tICdrbm9ja291dCc7XG5cbmltcG9ydCBtYWdlVXRpbHMgZnJvbSAnbWFnZVV0aWxzJztcblxuLyoqXG4gKiBBYnN0cmFjdFN0cnVjdHVyYWwgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIEFic3RyYWN0U3RydWN0dXJhbCBleHRlbmRzIEVkaXRhYmxlQXJlYSBpbXBsZW1lbnRzIFN0cnVjdHVyYWxJbnRlcmZhY2Uge1xuICAgIHBhcmVudDogYW55O1xuICAgIHN0YWdlOiBhbnk7XG4gICAgaWQ6IHN0cmluZyA9IG1hZ2VVdGlscy51bmlxdWVpZCgpO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgd3JhcHBlclN0eWxlOiBLbm9ja291dE9ic2VydmFibGU8b2JqZWN0PiA9IGtvLm9ic2VydmFibGUoe3dpZHRoOiAnMTAwJSd9KTtcbiAgICBwdWJsaWMgb3B0aW9uczogQXJyYXk8T3B0aW9uSW50ZXJmYWNlPiA9IFtcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnbW92ZScsICc8aT7umJc8L2k+JywgJHQoJ01vdmUnKSwgZmFsc2UsIFsnbW92ZS1zdHJ1Y3R1cmFsJ10sIDEwKSxcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnZWRpdCcsICc8aT7umJA8L2k+JywgJHQoJ0VkaXQnKSwgdGhpcy5vbk9wdGlvbkVkaXQuYmluZCh0aGlzKSwgWydlZGl0LWJsb2NrJ10sIDUwKSxcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnZHVwbGljYXRlJywgJzxpPu6YujwvaT4nLCAkdCgnRHVwbGljYXRlJyksIHRoaXMub25PcHRpb25EdXBsaWNhdGUuYmluZCh0aGlzKSwgWydkdXBsaWNhdGUtc3RydWN0dXJhbCddLCA2MCksXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ3JlbW92ZScsICc8aT7umLA8L2k+JywgJHQoJ1JlbW92ZScpLCB0aGlzLm9uT3B0aW9uUmVtb3ZlLmJpbmQodGhpcyksIFsncmVtb3ZlLXN0cnVjdHVyYWwnXSwgMTAwKVxuICAgIF07XG4gICAgb3B0aW9uc0luc3RhbmNlOiBPcHRpb25zID0gbmV3IE9wdGlvbnModGhpcywgdGhpcy5vcHRpb25zKTtcbiAgICBkYXRhOiBLbm9ja291dE9ic2VydmFibGU8b2JqZWN0PiA9IGtvLm9ic2VydmFibGUoe30pO1xuICAgIGNoaWxkcmVuOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxTdHJ1Y3R1cmFsSW50ZXJmYWNlPiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0Lmh0bWwnO1xuICAgIGNoaWxkVGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NoaWxkcmVuLmh0bWwnO1xuICAgIGNvbHVtbkJ1aWxkZXI6IENvbHVtbkJ1aWxkZXIgPSBuZXcgQ29sdW1uQnVpbGRlcigpO1xuXG4gICAgLyoqXG4gICAgICogQWJzdHJhY3Qgc3RydWN0dXJhbCBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UpIHtcbiAgICAgICAgc3VwZXIoc3RhZ2UpO1xuICAgICAgICBzdXBlci5zZXRDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcblxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgIH1cblxuICAgIG9uT3B0aW9uRWRpdCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBkdXBsaWNhdGUgb2YgaXRlbXNcbiAgICAgKi9cbiAgICBvbk9wdGlvbkR1cGxpY2F0ZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gQHRvZG8gZGlzY3VzcyBob3cgdG8gYmVzdCBkdXBsaWNhdGUgYSBibG9ja1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBibG9jayByZW1vdmFsXG4gICAgICovXG4gICAgb25PcHRpb25SZW1vdmUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhZ2UucGFyZW50LmNvbmZpcm1hdGlvbkRpYWxvZyh7XG4gICAgICAgICAgICB0aXRsZTogJ0NvbmZpcm0gSXRlbSBSZW1vdmFsJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHRoaXMgaXRlbT8gVGhlIGRhdGEgd2l0aGluIHRoaXMgaXRlbSBpcyBub3QgcmVjb3ZlcmFibGUgb25jZSByZW1vdmVkLicsXG4gICAgICAgICAgICBhY3Rpb25zOiB7XG4gICAgICAgICAgICAgICAgY29uZmlybTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBwYXJlbnQgdG8gcmVtb3ZlIHRoZSBjaGlsZCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmVtaXQoJ2Jsb2NrUmVtb3ZlZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrOiB0aGlzXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHRlbXBsYXRlIGZyb20gdGhlIGNsYXNzXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCB1c2UgdGhpcy50ZW1wbGF0ZSBpbnN0ZWFkXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgY2hpbGQgdGVtcGxhdGVcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRDaGlsZFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkVGVtcGxhdGU7XG4gICAgfVxufSJdfQ==
