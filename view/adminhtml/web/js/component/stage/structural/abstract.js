define(["exports", "./editable-area", "./options", "./options/option", "mage/translate", "knockout", "mageUtils"], function (exports, _editableArea, _options, _option, _translate, _knockout, _mageUtils) {
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

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

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

    var _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);

            if (parent === null) {
                return undefined;
            } else {
                return get(parent, property, receiver);
            }
        } else if ("value" in desc) {
            return desc.value;
        } else {
            var getter = desc.get;

            if (getter === undefined) {
                return undefined;
            }

            return getter.call(receiver);
        }
    };

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

            var _this = _possibleConstructorReturn(this, (AbstractStructural.__proto__ || Object.getPrototypeOf(AbstractStructural)).call(this, stage));

            _this.id = _mageUtils2.default.uniqueid();
            _this.wrapperStyle = _knockout2.default.observable({ width: '100%' });
            _this.options = [new _option.Option(_this, 'move', '<i></i>', (0, _translate2.default)('Move'), false, ['move-structural'], 10), new _option.Option(_this, 'edit', '<i></i>', (0, _translate2.default)('Edit'), _this.onOptionEdit.bind(_this), ['edit-block'], 50), new _option.Option(_this, 'duplicate', '<i></i>', (0, _translate2.default)('Duplicate'), _this.onOptionDuplicate.bind(_this), ['duplicate-structural'], 60), new _option.Option(_this, 'remove', '<i></i>', (0, _translate2.default)('Remove'), _this.onOptionRemove.bind(_this), ['remove-structural'], 100)];
            _this.optionsInstance = new _options.Options(_this, _this.options);
            _this.data = _knockout2.default.observable({});
            _this.children = _knockout2.default.observableArray([]);
            _this.template = 'Gene_BlueFoot/component/stage/structural/abstract.html';
            _this.childTemplate = 'Gene_BlueFoot/component/stage/structural/children.html';
            _get(AbstractStructural.prototype.__proto__ || Object.getPrototypeOf(AbstractStructural.prototype), "setChildren", _this).call(_this, _this.children);
            _this.parent = parent;
            _this.stage = stage;
            return _this;
        }

        _createClass(AbstractStructural, [{
            key: "onOptionEdit",
            value: function onOptionEdit() {}
            /**
             * Handle duplicate of items
             */

        }, {
            key: "onOptionDuplicate",
            value: function onOptionDuplicate() {
                var duplicate = Object.assign(Object.create(this), this);
                this.parent.addChild(duplicate);
            }
            /**
             * Handle block removal
             */

        }, {
            key: "onOptionRemove",
            value: function onOptionRemove() {
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
            }
            /**
             * Retrieve the template from the class
             *
             * @deprecated use this.template instead
             * @returns {string}
             */

        }, {
            key: "getTemplate",
            value: function getTemplate() {
                return this.template;
            }
            /**
             * Retrieve the child template
             *
             * @deprecated
             * @returns {string}
             */

        }, {
            key: "getChildTemplate",
            value: function getChildTemplate() {
                return this.childTemplate;
            }
        }]);

        return AbstractStructural;
    }(_editableArea2.default);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LnRzIl0sIm5hbWVzIjpbIkFic3RyYWN0U3RydWN0dXJhbCIsInBhcmVudCIsInN0YWdlIiwiaWQiLCJ1bmlxdWVpZCIsIndyYXBwZXJTdHlsZSIsIm9ic2VydmFibGUiLCJ3aWR0aCIsIm9wdGlvbnMiLCJvbk9wdGlvbkVkaXQiLCJiaW5kIiwib25PcHRpb25EdXBsaWNhdGUiLCJvbk9wdGlvblJlbW92ZSIsIm9wdGlvbnNJbnN0YW5jZSIsImRhdGEiLCJjaGlsZHJlbiIsIm9ic2VydmFibGVBcnJheSIsInRlbXBsYXRlIiwiY2hpbGRUZW1wbGF0ZSIsImR1cGxpY2F0ZSIsIk9iamVjdCIsImFzc2lnbiIsImNyZWF0ZSIsImFkZENoaWxkIiwiY29uZmlybWF0aW9uRGlhbG9nIiwidGl0bGUiLCJjb250ZW50IiwiYWN0aW9ucyIsImNvbmZpcm0iLCJlbWl0IiwiYmxvY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0JNQSxrQixXQUFBQSxrQjs7O0FBa0JGOzs7Ozs7QUFNQSxvQ0FBWUMsTUFBWixFQUEyQ0MsS0FBM0MsRUFBZ0U7QUFBQTs7QUFBQSxnSkFDdERBLEtBRHNEOztBQXJCaEUsa0JBQUFDLEVBQUEsR0FBYSxvQkFBVUMsUUFBVixFQUFiO0FBRUEsa0JBQUFDLFlBQUEsR0FBMkMsbUJBQUdDLFVBQUgsQ0FBYyxFQUFDQyxPQUFPLE1BQVIsRUFBZCxDQUEzQztBQUNPLGtCQUFBQyxPQUFBLEdBQWtDLENBQ3JDLDBCQUFpQixNQUFqQixFQUF5QixVQUF6QixFQUFxQyx5QkFBRyxNQUFILENBQXJDLEVBQWlELEtBQWpELEVBQXdELENBQUMsaUJBQUQsQ0FBeEQsRUFBNkUsRUFBN0UsQ0FEcUMsRUFFckMsMEJBQWlCLE1BQWpCLEVBQXlCLFVBQXpCLEVBQXFDLHlCQUFHLE1BQUgsQ0FBckMsRUFBaUQsTUFBS0MsWUFBTCxDQUFrQkMsSUFBbEIsT0FBakQsRUFBK0UsQ0FBQyxZQUFELENBQS9FLEVBQStGLEVBQS9GLENBRnFDLEVBR3JDLDBCQUFpQixXQUFqQixFQUE4QixVQUE5QixFQUEwQyx5QkFBRyxXQUFILENBQTFDLEVBQTJELE1BQUtDLGlCQUFMLENBQXVCRCxJQUF2QixPQUEzRCxFQUE4RixDQUFDLHNCQUFELENBQTlGLEVBQXdILEVBQXhILENBSHFDLEVBSXJDLDBCQUFpQixRQUFqQixFQUEyQixVQUEzQixFQUF1Qyx5QkFBRyxRQUFILENBQXZDLEVBQXFELE1BQUtFLGNBQUwsQ0FBb0JGLElBQXBCLE9BQXJELEVBQXFGLENBQUMsbUJBQUQsQ0FBckYsRUFBNEcsR0FBNUcsQ0FKcUMsQ0FBbEM7QUFNUCxrQkFBQUcsZUFBQSxHQUEyQiw0QkFBa0IsTUFBS0wsT0FBdkIsQ0FBM0I7QUFDQSxrQkFBQU0sSUFBQSxHQUFtQyxtQkFBR1IsVUFBSCxDQUFjLEVBQWQsQ0FBbkM7QUFDQSxrQkFBQVMsUUFBQSxHQUF5RCxtQkFBR0MsZUFBSCxDQUFtQixFQUFuQixDQUF6RDtBQUNBLGtCQUFBQyxRQUFBLEdBQW1CLHdEQUFuQjtBQUNBLGtCQUFBQyxhQUFBLEdBQXdCLHdEQUF4QjtBQVVJLGtKQUFrQixNQUFLSCxRQUF2QjtBQUVBLGtCQUFLZCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxrQkFBS0MsS0FBTCxHQUFhQSxLQUFiO0FBTDREO0FBTS9EOzs7OzJDQUVXLENBRVg7QUFFRDs7Ozs7O2dEQUdpQjtBQUNiLG9CQUFJaUIsWUFBWUMsT0FBT0MsTUFBUCxDQUFjRCxPQUFPRSxNQUFQLENBQWMsSUFBZCxDQUFkLEVBQW1DLElBQW5DLENBQWhCO0FBQ0EscUJBQUtyQixNQUFMLENBQVlzQixRQUFaLENBQXFCSixTQUFyQjtBQUNIO0FBRUQ7Ozs7Ozs2Q0FHYztBQUFBOztBQUNWLHFCQUFLakIsS0FBTCxDQUFXRCxNQUFYLENBQWtCdUIsa0JBQWxCLENBQXFDO0FBQ2pDQywyQkFBTyxzQkFEMEI7QUFFakNDLDZCQUFTLHVHQUZ3QjtBQUdqQ0MsNkJBQVM7QUFDTEMsaUNBQVMsbUJBQUE7QUFDTDtBQUNBLG1DQUFLM0IsTUFBTCxDQUFZNEIsSUFBWixDQUFpQixjQUFqQixFQUFpQztBQUM3QkM7QUFENkIsNkJBQWpDO0FBR0g7QUFOSTtBQUh3QixpQkFBckM7QUFZSDtBQUVEOzs7Ozs7Ozs7MENBTVc7QUFDUCx1QkFBTyxLQUFLYixRQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7OytDQU1nQjtBQUNaLHVCQUFPLEtBQUtDLGFBQVo7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9hYnN0cmFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5pbXBvcnQgRWRpdGFibGVBcmVhIGZyb20gJy4vZWRpdGFibGUtYXJlYSc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL2VkaXRhYmxlLWFyZWEuZCc7XG5pbXBvcnQgeyBTdHJ1Y3R1cmFsIGFzIFN0cnVjdHVyYWxJbnRlcmZhY2UgfSBmcm9tIFwiLi9hYnN0cmFjdC5kXCI7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSBcIi4vb3B0aW9uc1wiO1xuaW1wb3J0IHsgT3B0aW9uIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb25cIjtcbmltcG9ydCB7IE9wdGlvbkludGVyZmFjZSB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uLmRcIjtcblxuaW1wb3J0ICR0IGZyb20gJ21hZ2UvdHJhbnNsYXRlJztcbmltcG9ydCBrbyBmcm9tICdrbm9ja291dCc7XG5cbmltcG9ydCBtYWdlVXRpbHMgZnJvbSAnbWFnZVV0aWxzJztcblxuLyoqXG4gKiBBYnN0cmFjdFN0cnVjdHVyYWwgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGNsYXNzIEFic3RyYWN0U3RydWN0dXJhbCBleHRlbmRzIEVkaXRhYmxlQXJlYSBpbXBsZW1lbnRzIFN0cnVjdHVyYWxJbnRlcmZhY2Uge1xuICAgIHBhcmVudDogYW55O1xuICAgIHN0YWdlOiBhbnk7XG4gICAgaWQ6IHN0cmluZyA9IG1hZ2VVdGlscy51bmlxdWVpZCgpO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgd3JhcHBlclN0eWxlOiBLbm9ja291dE9ic2VydmFibGU8b2JqZWN0PiA9IGtvLm9ic2VydmFibGUoe3dpZHRoOiAnMTAwJSd9KTtcbiAgICBwdWJsaWMgb3B0aW9uczogQXJyYXk8T3B0aW9uSW50ZXJmYWNlPiA9IFtcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnbW92ZScsICc8aT7umJc8L2k+JywgJHQoJ01vdmUnKSwgZmFsc2UsIFsnbW92ZS1zdHJ1Y3R1cmFsJ10sIDEwKSxcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnZWRpdCcsICc8aT7umJA8L2k+JywgJHQoJ0VkaXQnKSwgdGhpcy5vbk9wdGlvbkVkaXQuYmluZCh0aGlzKSwgWydlZGl0LWJsb2NrJ10sIDUwKSxcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnZHVwbGljYXRlJywgJzxpPu6YujwvaT4nLCAkdCgnRHVwbGljYXRlJyksIHRoaXMub25PcHRpb25EdXBsaWNhdGUuYmluZCh0aGlzKSwgWydkdXBsaWNhdGUtc3RydWN0dXJhbCddLCA2MCksXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ3JlbW92ZScsICc8aT7umLA8L2k+JywgJHQoJ1JlbW92ZScpLCB0aGlzLm9uT3B0aW9uUmVtb3ZlLmJpbmQodGhpcyksIFsncmVtb3ZlLXN0cnVjdHVyYWwnXSwgMTAwKVxuICAgIF07XG4gICAgb3B0aW9uc0luc3RhbmNlOiBPcHRpb25zID0gbmV3IE9wdGlvbnModGhpcywgdGhpcy5vcHRpb25zKTtcbiAgICBkYXRhOiBLbm9ja291dE9ic2VydmFibGU8b2JqZWN0PiA9IGtvLm9ic2VydmFibGUoe30pO1xuICAgIGNoaWxkcmVuOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxTdHJ1Y3R1cmFsSW50ZXJmYWNlPiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0Lmh0bWwnO1xuICAgIGNoaWxkVGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NoaWxkcmVuLmh0bWwnO1xuXG4gICAgLyoqXG4gICAgICogQWJzdHJhY3Qgc3RydWN0dXJhbCBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UpIHtcbiAgICAgICAgc3VwZXIoc3RhZ2UpO1xuICAgICAgICBzdXBlci5zZXRDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcblxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgIH1cblxuICAgIG9uT3B0aW9uRWRpdCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBkdXBsaWNhdGUgb2YgaXRlbXNcbiAgICAgKi9cbiAgICBvbk9wdGlvbkR1cGxpY2F0ZSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGR1cGxpY2F0ZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZSh0aGlzKSwgdGhpcyk7XG4gICAgICAgIHRoaXMucGFyZW50LmFkZENoaWxkKGR1cGxpY2F0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGJsb2NrIHJlbW92YWxcbiAgICAgKi9cbiAgICBvbk9wdGlvblJlbW92ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGFnZS5wYXJlbnQuY29uZmlybWF0aW9uRGlhbG9nKHtcbiAgICAgICAgICAgIHRpdGxlOiAnQ29uZmlybSBJdGVtIFJlbW92YWwnLFxuICAgICAgICAgICAgY29udGVudDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhpcyBpdGVtPyBUaGUgZGF0YSB3aXRoaW4gdGhpcyBpdGVtIGlzIG5vdCByZWNvdmVyYWJsZSBvbmNlIHJlbW92ZWQuJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBjb25maXJtOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIHBhcmVudCB0byByZW1vdmUgdGhlIGNoaWxkIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuZW1pdCgnYmxvY2tSZW1vdmVkJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2s6IHRoaXNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdGVtcGxhdGUgZnJvbSB0aGUgY2xhc3NcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIHVzZSB0aGlzLnRlbXBsYXRlIGluc3RlYWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBjaGlsZCB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldENoaWxkVGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRUZW1wbGF0ZTtcbiAgICB9XG59Il19
