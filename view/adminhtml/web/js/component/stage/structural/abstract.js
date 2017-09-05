define(["exports", "./editable-area", "./options", "./options/option", "mage/translate"], function (exports, _editableArea, _options, _option, _translate) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AbstractStructural = undefined;

    var $t = _interopRequireWildcard(_translate);

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

            _this.options = [new _option.Option(_this, 'move', '<i></i>', $t('Move'), false, ['move-structural'], 10), new _option.Option(_this, 'edit', '<i></i>', $t('Edit'), _this.onOptionEdit.bind(_this), ['edit-block'], 50), new _option.Option(_this, 'duplicate', '<i></i>', $t('Duplicate'), _this.onOptionDuplicate.bind(_this), ['duplicate-structural'], 60), new _option.Option(_this, 'remove', '<i></i>', $t('Remove'), _this.onOptionRemove.bind(_this), ['remove-structural'], 100)];
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
            value: function onOptionRemove() {}
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
    }(_editableArea.EditableArea);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0LnRzIl0sIm5hbWVzIjpbIiR0IiwiQWJzdHJhY3RTdHJ1Y3R1cmFsIiwicGFyZW50Iiwic3RhZ2UiLCJvcHRpb25zIiwib25PcHRpb25FZGl0IiwiYmluZCIsIm9uT3B0aW9uRHVwbGljYXRlIiwib25PcHRpb25SZW1vdmUiLCJvcHRpb25zSW5zdGFuY2UiLCJkYXRhIiwia28iLCJvYnNlcnZhYmxlIiwiY2hpbGRyZW4iLCJvYnNlcnZhYmxlQXJyYXkiLCJ0ZW1wbGF0ZSIsImNoaWxkVGVtcGxhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBUVlBLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBUU5DLGtCLFdBQUFBLGtCOzs7QUFpQkY7Ozs7OztBQU1BLG9DQUFZQyxNQUFaLEVBQTJDQyxLQUEzQyxFQUFnRTtBQUFBOztBQUFBLGdKQUN0REEsS0FEc0Q7O0FBbEJ6RCxrQkFBQUMsT0FBQSxHQUFrQyxDQUNyQywwQkFBaUIsTUFBakIsRUFBeUIsVUFBekIsRUFBcUNKLEdBQUcsTUFBSCxDQUFyQyxFQUFpRCxLQUFqRCxFQUF3RCxDQUFDLGlCQUFELENBQXhELEVBQTZFLEVBQTdFLENBRHFDLEVBRXJDLDBCQUFpQixNQUFqQixFQUF5QixVQUF6QixFQUFxQ0EsR0FBRyxNQUFILENBQXJDLEVBQWlELE1BQUtLLFlBQUwsQ0FBa0JDLElBQWxCLE9BQWpELEVBQStFLENBQUMsWUFBRCxDQUEvRSxFQUErRixFQUEvRixDQUZxQyxFQUdyQywwQkFBaUIsV0FBakIsRUFBOEIsVUFBOUIsRUFBMENOLEdBQUcsV0FBSCxDQUExQyxFQUEyRCxNQUFLTyxpQkFBTCxDQUF1QkQsSUFBdkIsT0FBM0QsRUFBOEYsQ0FBQyxzQkFBRCxDQUE5RixFQUF3SCxFQUF4SCxDQUhxQyxFQUlyQywwQkFBaUIsUUFBakIsRUFBMkIsVUFBM0IsRUFBdUNOLEdBQUcsUUFBSCxDQUF2QyxFQUFxRCxNQUFLUSxjQUFMLENBQW9CRixJQUFwQixPQUFyRCxFQUFxRixDQUFDLG1CQUFELENBQXJGLEVBQTRHLEdBQTVHLENBSnFDLENBQWxDO0FBTVAsa0JBQUFHLGVBQUEsR0FBMkIsNEJBQWtCLE1BQUtMLE9BQXZCLENBQTNCO0FBQ0Esa0JBQUFNLElBQUEsR0FBbUNDLEdBQUdDLFVBQUgsQ0FBYyxFQUFkLENBQW5DO0FBQ0Esa0JBQUFDLFFBQUEsR0FBeURGLEdBQUdHLGVBQUgsQ0FBbUIsRUFBbkIsQ0FBekQ7QUFDQSxrQkFBQUMsUUFBQSxHQUFtQix3REFBbkI7QUFDQSxrQkFBQUMsYUFBQSxHQUF3Qix3REFBeEI7QUFVSSxrSkFBa0IsTUFBS0gsUUFBdkI7QUFFQSxrQkFBS1gsTUFBTCxHQUFjQSxNQUFkO0FBQ0Esa0JBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUw0RDtBQU0vRDs7OzsyQ0FFVyxDQUVYOzs7Z0RBRWdCLENBRWhCOzs7NkNBRWEsQ0FFYjtBQUVEOzs7Ozs7Ozs7MENBTVc7QUFDUCx1QkFBTyxLQUFLWSxRQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7OytDQU1nQjtBQUNaLHVCQUFPLEtBQUtDLGFBQVo7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9hYnN0cmFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWEgfSBmcm9tICcuL2VkaXRhYmxlLWFyZWEnO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSBcIi4vYWJzdHJhY3QuZFwiO1xuaW1wb3J0IHsgT3B0aW9ucyB9IGZyb20gXCIuL29wdGlvbnNcIjtcbmltcG9ydCB7IE9wdGlvbiB9IGZyb20gXCIuL29wdGlvbnMvb3B0aW9uXCI7XG5pbXBvcnQgeyBPcHRpb25JbnRlcmZhY2UgfSBmcm9tIFwiLi9vcHRpb25zL29wdGlvbi5kXCI7XG5cbmltcG9ydCAqIGFzICR0IGZyb20gJ21hZ2UvdHJhbnNsYXRlJztcbmltcG9ydCAqIGFzIHVpQ2xhc3MgZnJvbSAndWlDbGFzcyc7XG5cbi8qKlxuICogQWJzdHJhY3RTdHJ1Y3R1cmFsIGNsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBBYnN0cmFjdFN0cnVjdHVyYWwgZXh0ZW5kcyBFZGl0YWJsZUFyZWEgaW1wbGVtZW50cyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIHtcbiAgICBwYXJlbnQ6IGFueTtcbiAgICBzdGFnZTogYW55O1xuICAgIGlkOiBudW1iZXI7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICBwdWJsaWMgb3B0aW9uczogQXJyYXk8T3B0aW9uSW50ZXJmYWNlPiA9IFtcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnbW92ZScsICc8aT7umJc8L2k+JywgJHQoJ01vdmUnKSwgZmFsc2UsIFsnbW92ZS1zdHJ1Y3R1cmFsJ10sIDEwKSxcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnZWRpdCcsICc8aT7umJA8L2k+JywgJHQoJ0VkaXQnKSwgdGhpcy5vbk9wdGlvbkVkaXQuYmluZCh0aGlzKSwgWydlZGl0LWJsb2NrJ10sIDUwKSxcbiAgICAgICAgbmV3IE9wdGlvbih0aGlzLCAnZHVwbGljYXRlJywgJzxpPu6YujwvaT4nLCAkdCgnRHVwbGljYXRlJyksIHRoaXMub25PcHRpb25EdXBsaWNhdGUuYmluZCh0aGlzKSwgWydkdXBsaWNhdGUtc3RydWN0dXJhbCddLCA2MCksXG4gICAgICAgIG5ldyBPcHRpb24odGhpcywgJ3JlbW92ZScsICc8aT7umLA8L2k+JywgJHQoJ1JlbW92ZScpLCB0aGlzLm9uT3B0aW9uUmVtb3ZlLmJpbmQodGhpcyksIFsncmVtb3ZlLXN0cnVjdHVyYWwnXSwgMTAwKVxuICAgIF07XG4gICAgb3B0aW9uc0luc3RhbmNlOiBPcHRpb25zID0gbmV3IE9wdGlvbnModGhpcywgdGhpcy5vcHRpb25zKTtcbiAgICBkYXRhOiBLbm9ja291dE9ic2VydmFibGU8b2JqZWN0PiA9IGtvLm9ic2VydmFibGUoe30pO1xuICAgIGNoaWxkcmVuOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxTdHJ1Y3R1cmFsSW50ZXJmYWNlPiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2Fic3RyYWN0Lmh0bWwnO1xuICAgIGNoaWxkVGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2NoaWxkcmVuLmh0bWwnO1xuXG4gICAgLyoqXG4gICAgICogQWJzdHJhY3Qgc3RydWN0dXJhbCBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UpIHtcbiAgICAgICAgc3VwZXIoc3RhZ2UpO1xuICAgICAgICBzdXBlci5zZXRDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcblxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgIH1cblxuICAgIG9uT3B0aW9uRWRpdCgpIHtcblxuICAgIH1cblxuICAgIG9uT3B0aW9uRHVwbGljYXRlKCkge1xuXG4gICAgfVxuXG4gICAgb25PcHRpb25SZW1vdmUoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdGVtcGxhdGUgZnJvbSB0aGUgY2xhc3NcbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIHVzZSB0aGlzLnRlbXBsYXRlIGluc3RlYWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBjaGlsZCB0ZW1wbGF0ZVxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldENoaWxkVGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRUZW1wbGF0ZTtcbiAgICB9XG59Il19
