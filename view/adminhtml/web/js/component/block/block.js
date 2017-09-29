define(["exports", "../stage/structural/abstract", "../stage/previews", "mage/translate", "underscore"], function (exports, _abstract, _previews, _translate, _underscore) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _previews2 = _interopRequireDefault(_previews);

    var _translate2 = _interopRequireDefault(_translate);

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

    var Block = function (_AbstractStructural) {
        _inherits(Block, _AbstractStructural);

        /**
         * AbstractBlock constructor
         *
         * @param parent
         * @param stage
         * @param config
         * @param formData
         */
        function Block(parent, stage, config, formData) {
            _classCallCheck(this, Block);

            var _this = _possibleConstructorReturn(this, _AbstractStructural.call(this, parent, stage));

            _this.editOnInsert = true;
            _this.childEntityKeys = [];
            _this.template = 'Gene_BlueFoot/component/block/abstract.html';
            // @todo temp for testing, remove after building edit capabilities
            _this.defaults = {
                heading_type: 'h2',
                title: (0, _translate2.default)('Type heading content here...')
            };
            _this.config = config;
            _this.preview = (0, _previews2.default)(_this, config);
            _this.stage.store.update(_this.id, _underscore2.default.extend(_this.defaults, formData));
            return _this;
        }
        /**
         * Retrieve the template from the preview or super
         *
         * @returns {string}
         */


        Block.prototype.getTemplate = function getTemplate() {
            if (this.preview.template) {
                return this.preview.template;
            }
            // Implement preview template system here
            return _AbstractStructural.prototype.getTemplate.call(this);
        };

        return Block;
    }(_abstract.AbstractStructural);

    exports.default = Block;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9ibG9jay50cyJdLCJuYW1lcyI6WyJCbG9jayIsInBhcmVudCIsInN0YWdlIiwiY29uZmlnIiwiZm9ybURhdGEiLCJlZGl0T25JbnNlcnQiLCJjaGlsZEVudGl0eUtleXMiLCJ0ZW1wbGF0ZSIsImRlZmF1bHRzIiwiaGVhZGluZ190eXBlIiwidGl0bGUiLCJwcmV2aWV3Iiwic3RvcmUiLCJ1cGRhdGUiLCJpZCIsImV4dGVuZCIsImdldFRlbXBsYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBY2NBLEs7OztBQWNWOzs7Ozs7OztBQVFBLHVCQUFZQyxNQUFaLEVBQTJDQyxLQUEzQyxFQUFrRUMsTUFBbEUsRUFBK0VDLFFBQS9FLEVBQTRGO0FBQUE7O0FBQUEseURBQ3hGLCtCQUFNSCxNQUFOLEVBQWNDLEtBQWQsQ0FEd0Y7O0FBbkI1RixrQkFBQUcsWUFBQSxHQUF3QixJQUF4QjtBQUVBLGtCQUFBQyxlQUFBLEdBQWlDLEVBQWpDO0FBQ0Esa0JBQUFDLFFBQUEsR0FBbUIsNkNBQW5CO0FBRUE7QUFDQSxrQkFBQUMsUUFBQSxHQUFtQjtBQUNmQyw4QkFBYyxJQURDO0FBRWZDLHVCQUFPLHlCQUFHLDhCQUFIO0FBRlEsYUFBbkI7QUFnQkksa0JBQUtQLE1BQUwsR0FBY0EsTUFBZDtBQUNBLGtCQUFLUSxPQUFMLEdBQWUsK0JBQXlCUixNQUF6QixDQUFmO0FBRUEsa0JBQUtELEtBQUwsQ0FBV1UsS0FBWCxDQUFpQkMsTUFBakIsQ0FDSSxNQUFLQyxFQURULEVBRUkscUJBQUVDLE1BQUYsQ0FBUyxNQUFLUCxRQUFkLEVBQXdCSixRQUF4QixDQUZKO0FBTndGO0FBVTNGO0FBRUQ7Ozs7Ozs7d0JBS0FZLFcsMEJBQVc7QUFDUCxnQkFBSSxLQUFLTCxPQUFMLENBQWFKLFFBQWpCLEVBQTJCO0FBQ3ZCLHVCQUFPLEtBQUtJLE9BQUwsQ0FBYUosUUFBcEI7QUFDSDtBQUVEO0FBQ0EsbUJBQU8sOEJBQU1TLFdBQU4sV0FBUDtBQUNILFM7Ozs7O3NCQTlDU2hCLEsiLCJmaWxlIjoiY29tcG9uZW50L2Jsb2NrL2Jsb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RTdHJ1Y3R1cmFsIH0gZnJvbSAnLi4vc3RhZ2Uvc3RydWN0dXJhbC9hYnN0cmFjdCc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuLi9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEuZCdcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBCbG9jayBhcyBCbG9ja0ludGVyZmFjZSB9IGZyb20gJy4vYmxvY2suZCc7XG5pbXBvcnQgZ2V0UHJldmlld0luc3RhbmNlIGZyb20gXCIuLi9zdGFnZS9wcmV2aWV3c1wiO1xuaW1wb3J0IFByZXZpZXdCbG9jayBmcm9tIFwiLi9wcmV2aWV3L2Jsb2NrXCI7XG5pbXBvcnQgJHQgZnJvbSBcIm1hZ2UvdHJhbnNsYXRlXCI7XG5pbXBvcnQgXyBmcm9tIFwidW5kZXJzY29yZVwiO1xuXG4vKipcbiAqIEFic3RyYWN0QmxvY2sgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxvY2sgZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwgaW1wbGVtZW50cyBCbG9ja0ludGVyZmFjZSB7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICBjb25maWc6IGFueTtcbiAgICBlZGl0T25JbnNlcnQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHByZXZpZXc6IFByZXZpZXdCbG9jaztcbiAgICBjaGlsZEVudGl0eUtleXM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICB0ZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L2Jsb2NrL2Fic3RyYWN0Lmh0bWwnO1xuXG4gICAgLy8gQHRvZG8gdGVtcCBmb3IgdGVzdGluZywgcmVtb3ZlIGFmdGVyIGJ1aWxkaW5nIGVkaXQgY2FwYWJpbGl0aWVzXG4gICAgZGVmYXVsdHM6IG9iamVjdCA9IHtcbiAgICAgICAgaGVhZGluZ190eXBlOiAnaDInLFxuICAgICAgICB0aXRsZTogJHQoJ1R5cGUgaGVhZGluZyBjb250ZW50IGhlcmUuLi4nKVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBYnN0cmFjdEJsb2NrIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqIEBwYXJhbSBmb3JtRGF0YVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlLCBzdGFnZTogU3RhZ2VJbnRlcmZhY2UsIGNvbmZpZzogYW55LCBmb3JtRGF0YTogYW55KSB7XG4gICAgICAgIHN1cGVyKHBhcmVudCwgc3RhZ2UpO1xuXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLnByZXZpZXcgPSBnZXRQcmV2aWV3SW5zdGFuY2UodGhpcywgY29uZmlnKTtcblxuICAgICAgICB0aGlzLnN0YWdlLnN0b3JlLnVwZGF0ZShcbiAgICAgICAgICAgIHRoaXMuaWQsXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLmRlZmF1bHRzLCBmb3JtRGF0YSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdGVtcGxhdGUgZnJvbSB0aGUgcHJldmlldyBvciBzdXBlclxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJldmlldy50ZW1wbGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmlldy50ZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEltcGxlbWVudCBwcmV2aWV3IHRlbXBsYXRlIHN5c3RlbSBoZXJlXG4gICAgICAgIHJldHVybiBzdXBlci5nZXRUZW1wbGF0ZSgpO1xuICAgIH1cbn0iXX0=
