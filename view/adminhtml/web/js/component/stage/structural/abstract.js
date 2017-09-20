define(["exports", "./editable-area", "./options", "./options/option", "mage/translate", "knockout", "mageUtils"], function (exports, _editableArea, _options, _option, _translate, _knockout, _mageUtils) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AbstractStructural = undefined;

    var _editableArea2 = _interopRequireDefault(_editableArea);

    var _translate2 = _interopRequireDefault(_translate);

    var ko = _interopRequireWildcard(_knockout);

    var _mageUtils2 = _interopRequireDefault(_mageUtils);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

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
            _this.wrapperStyle = ko.observable({ width: '100%' });
            _this.options = [new _option.Option(_this, 'move', '<i></i>', (0, _translate2.default)('Move'), false, ['move-structural'], 10), new _option.Option(_this, 'edit', '<i></i>', (0, _translate2.default)('Edit'), _this.onOptionEdit.bind(_this), ['edit-block'], 50), new _option.Option(_this, 'duplicate', '<i></i>', (0, _translate2.default)('Duplicate'), _this.onOptionDuplicate.bind(_this), ['duplicate-structural'], 60), new _option.Option(_this, 'remove', '<i></i>', (0, _translate2.default)('Remove'), _this.onOptionRemove.bind(_this), ['remove-structural'], 100)];
            _this.optionsInstance = new _options.Options(_this, _this.options);
            _this.data = ko.observable({});
            _this.children = ko.observableArray([]);
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
        }, {
            key: "onOptionDuplicate",
            value: function onOptionDuplicate() {}
        }, {
            key: "onOptionRemove",
            value: function onOptionRemove($data, structural) {
                structural.stage.parent.confirmationDialog({
                    title: 'Confirm Item Removal',
                    content: 'Are you sure you want to remove this item? The data within this item is not recoverable once removed.',
                    actions: {
                        confirm: function () {
                            // Call the parent to remove the child element
                            structural.parent.emit('blockRemoved', {
                                block: this
                            });
                        }.bind(this)
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LnRzIl0sIm5hbWVzIjpbImtvIiwiQWJzdHJhY3RTdHJ1Y3R1cmFsIiwicGFyZW50Iiwic3RhZ2UiLCJpZCIsInVuaXF1ZWlkIiwid3JhcHBlclN0eWxlIiwib2JzZXJ2YWJsZSIsIndpZHRoIiwib3B0aW9ucyIsIm9uT3B0aW9uRWRpdCIsImJpbmQiLCJvbk9wdGlvbkR1cGxpY2F0ZSIsIm9uT3B0aW9uUmVtb3ZlIiwib3B0aW9uc0luc3RhbmNlIiwiZGF0YSIsImNoaWxkcmVuIiwib2JzZXJ2YWJsZUFycmF5IiwidGVtcGxhdGUiLCJjaGlsZFRlbXBsYXRlIiwiJGRhdGEiLCJzdHJ1Y3R1cmFsIiwiY29uZmlybWF0aW9uRGlhbG9nIiwidGl0bGUiLCJjb250ZW50IiwiYWN0aW9ucyIsImNvbmZpcm0iLCJlbWl0IiwiYmxvY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztRQVNZQSxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBU05DLGtCLFdBQUFBLGtCOzs7QUFrQkY7Ozs7OztBQU1BLG9DQUFZQyxNQUFaLEVBQTJDQyxLQUEzQyxFQUFnRTtBQUFBOztBQUFBLGdKQUN0REEsS0FEc0Q7O0FBckJoRSxrQkFBQUMsRUFBQSxHQUFhLG9CQUFVQyxRQUFWLEVBQWI7QUFFQSxrQkFBQUMsWUFBQSxHQUEyQ04sR0FBR08sVUFBSCxDQUFjLEVBQUNDLE9BQU8sTUFBUixFQUFkLENBQTNDO0FBQ08sa0JBQUFDLE9BQUEsR0FBa0MsQ0FDckMsMEJBQWlCLE1BQWpCLEVBQXlCLFVBQXpCLEVBQXFDLHlCQUFHLE1BQUgsQ0FBckMsRUFBaUQsS0FBakQsRUFBd0QsQ0FBQyxpQkFBRCxDQUF4RCxFQUE2RSxFQUE3RSxDQURxQyxFQUVyQywwQkFBaUIsTUFBakIsRUFBeUIsVUFBekIsRUFBcUMseUJBQUcsTUFBSCxDQUFyQyxFQUFpRCxNQUFLQyxZQUFMLENBQWtCQyxJQUFsQixPQUFqRCxFQUErRSxDQUFDLFlBQUQsQ0FBL0UsRUFBK0YsRUFBL0YsQ0FGcUMsRUFHckMsMEJBQWlCLFdBQWpCLEVBQThCLFVBQTlCLEVBQTBDLHlCQUFHLFdBQUgsQ0FBMUMsRUFBMkQsTUFBS0MsaUJBQUwsQ0FBdUJELElBQXZCLE9BQTNELEVBQThGLENBQUMsc0JBQUQsQ0FBOUYsRUFBd0gsRUFBeEgsQ0FIcUMsRUFJckMsMEJBQWlCLFFBQWpCLEVBQTJCLFVBQTNCLEVBQXVDLHlCQUFHLFFBQUgsQ0FBdkMsRUFBcUQsTUFBS0UsY0FBTCxDQUFvQkYsSUFBcEIsT0FBckQsRUFBcUYsQ0FBQyxtQkFBRCxDQUFyRixFQUE0RyxHQUE1RyxDQUpxQyxDQUFsQztBQU1QLGtCQUFBRyxlQUFBLEdBQTJCLDRCQUFrQixNQUFLTCxPQUF2QixDQUEzQjtBQUNBLGtCQUFBTSxJQUFBLEdBQW1DZixHQUFHTyxVQUFILENBQWMsRUFBZCxDQUFuQztBQUNBLGtCQUFBUyxRQUFBLEdBQXlEaEIsR0FBR2lCLGVBQUgsQ0FBbUIsRUFBbkIsQ0FBekQ7QUFDQSxrQkFBQUMsUUFBQSxHQUFtQix3REFBbkI7QUFDQSxrQkFBQUMsYUFBQSxHQUF3Qix3REFBeEI7QUFVSSxrSkFBa0IsTUFBS0gsUUFBdkI7QUFFQSxrQkFBS2QsTUFBTCxHQUFjQSxNQUFkO0FBQ0Esa0JBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUw0RDtBQU0vRDs7OzsyQ0FFVyxDQUVYOzs7Z0RBRWdCLENBRWhCOzs7MkNBRWNpQixLLEVBQWVDLFUsRUFBK0I7QUFDekRBLDJCQUFXbEIsS0FBWCxDQUFpQkQsTUFBakIsQ0FBd0JvQixrQkFBeEIsQ0FBMkM7QUFDdkNDLDJCQUFPLHNCQURnQztBQUV2Q0MsNkJBQVMsdUdBRjhCO0FBR3ZDQyw2QkFBUztBQUNMQyxpQ0FBUyxZQUFBO0FBQ0w7QUFDQUwsdUNBQVduQixNQUFYLENBQWtCeUIsSUFBbEIsQ0FBdUIsY0FBdkIsRUFBdUM7QUFDbkNDLHVDQUFPO0FBRDRCLDZCQUF2QztBQUdILHlCQUxRLENBS1BqQixJQUxPLENBS0YsSUFMRTtBQURKO0FBSDhCLGlCQUEzQztBQVlIO0FBRUQ7Ozs7Ozs7OzswQ0FNVztBQUNQLHVCQUFPLEtBQUtPLFFBQVo7QUFDSDtBQUVEOzs7Ozs7Ozs7K0NBTWdCO0FBQ1osdUJBQU8sS0FBS0MsYUFBWjtBQUNIIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9zdGFnZS5kJztcbmltcG9ydCBFZGl0YWJsZUFyZWEgZnJvbSAnLi9lZGl0YWJsZS1hcmVhJztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCB7IFN0cnVjdHVyYWwgYXMgU3RydWN0dXJhbEludGVyZmFjZSB9IGZyb20gXCIuL2Fic3RyYWN0LmRcIjtcbmltcG9ydCB7IE9wdGlvbnMgfSBmcm9tIFwiLi9vcHRpb25zXCI7XG5pbXBvcnQgeyBPcHRpb24gfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvblwiO1xuaW1wb3J0IHsgT3B0aW9uSW50ZXJmYWNlIH0gZnJvbSBcIi4vb3B0aW9ucy9vcHRpb24uZFwiO1xuXG5pbXBvcnQgJHQgZnJvbSAnbWFnZS90cmFuc2xhdGUnO1xuaW1wb3J0ICogYXMga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQgbWFnZVV0aWxzIGZyb20gJ21hZ2VVdGlscyc7XG5cbi8qKlxuICogQWJzdHJhY3RTdHJ1Y3R1cmFsIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBBYnN0cmFjdFN0cnVjdHVyYWwgZXh0ZW5kcyBFZGl0YWJsZUFyZWEgaW1wbGVtZW50cyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIHtcbiAgICBwYXJlbnQ6IGFueTtcbiAgICBzdGFnZTogYW55O1xuICAgIGlkOiBzdHJpbmcgPSBtYWdlVXRpbHMudW5pcXVlaWQoKTtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIHdyYXBwZXJTdHlsZTogS25vY2tvdXRPYnNlcnZhYmxlPG9iamVjdD4gPSBrby5vYnNlcnZhYmxlKHt3aWR0aDogJzEwMCUnfSk7XG4gICAgcHVibGljIG9wdGlvbnM6IEFycmF5PE9wdGlvbkludGVyZmFjZT4gPSBbXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ21vdmUnLCAnPGk+7piXPC9pPicsICR0KCdNb3ZlJyksIGZhbHNlLCBbJ21vdmUtc3RydWN0dXJhbCddLCAxMCksXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2VkaXQnLCAnPGk+7piQPC9pPicsICR0KCdFZGl0JyksIHRoaXMub25PcHRpb25FZGl0LmJpbmQodGhpcyksIFsnZWRpdC1ibG9jayddLCA1MCksXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ2R1cGxpY2F0ZScsICc8aT7umLo8L2k+JywgJHQoJ0R1cGxpY2F0ZScpLCB0aGlzLm9uT3B0aW9uRHVwbGljYXRlLmJpbmQodGhpcyksIFsnZHVwbGljYXRlLXN0cnVjdHVyYWwnXSwgNjApLFxuICAgICAgICBuZXcgT3B0aW9uKHRoaXMsICdyZW1vdmUnLCAnPGk+7piwPC9pPicsICR0KCdSZW1vdmUnKSwgdGhpcy5vbk9wdGlvblJlbW92ZS5iaW5kKHRoaXMpLCBbJ3JlbW92ZS1zdHJ1Y3R1cmFsJ10sIDEwMClcbiAgICBdO1xuICAgIG9wdGlvbnNJbnN0YW5jZTogT3B0aW9ucyA9IG5ldyBPcHRpb25zKHRoaXMsIHRoaXMub3B0aW9ucyk7XG4gICAgZGF0YTogS25vY2tvdXRPYnNlcnZhYmxlPG9iamVjdD4gPSBrby5vYnNlcnZhYmxlKHt9KTtcbiAgICBjaGlsZHJlbjogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8U3RydWN0dXJhbEludGVyZmFjZT4gPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICAgIHRlbXBsYXRlOiBzdHJpbmcgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9hYnN0cmFjdC5odG1sJztcbiAgICBjaGlsZFRlbXBsYXRlOiBzdHJpbmcgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9jaGlsZHJlbi5odG1sJztcblxuICAgIC8qKlxuICAgICAqIEFic3RyYWN0IHN0cnVjdHVyYWwgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSwgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlKSB7XG4gICAgICAgIHN1cGVyKHN0YWdlKTtcbiAgICAgICAgc3VwZXIuc2V0Q2hpbGRyZW4odGhpcy5jaGlsZHJlbik7XG5cbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcbiAgICB9XG5cbiAgICBvbk9wdGlvbkVkaXQoKSB7XG5cbiAgICB9XG5cbiAgICBvbk9wdGlvbkR1cGxpY2F0ZSgpIHtcblxuICAgIH1cblxuICAgIG9uT3B0aW9uUmVtb3ZlKCRkYXRhOiBvYmplY3QsIHN0cnVjdHVyYWw6IFN0cnVjdHVyYWxJbnRlcmZhY2UpIHtcbiAgICAgICAgc3RydWN0dXJhbC5zdGFnZS5wYXJlbnQuY29uZmlybWF0aW9uRGlhbG9nKHtcbiAgICAgICAgICAgIHRpdGxlOiAnQ29uZmlybSBJdGVtIFJlbW92YWwnLFxuICAgICAgICAgICAgY29udGVudDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgdGhpcyBpdGVtPyBUaGUgZGF0YSB3aXRoaW4gdGhpcyBpdGVtIGlzIG5vdCByZWNvdmVyYWJsZSBvbmNlIHJlbW92ZWQuJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBjb25maXJtOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBwYXJlbnQgdG8gcmVtb3ZlIHRoZSBjaGlsZCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHN0cnVjdHVyYWwucGFyZW50LmVtaXQoJ2Jsb2NrUmVtb3ZlZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrOiB0aGlzXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdGVtcGxhdGUgZnJvbSB0aGUgY2xhc3NcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIHVzZSB0aGlzLnRlbXBsYXRlIGluc3RlYWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBjaGlsZCB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldENoaWxkVGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRUZW1wbGF0ZTtcbiAgICB9XG59Il19
