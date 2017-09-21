define(['exports', '../stage/structural/abstract', '../stage/previews'], function (exports, _abstract, _previews) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _previews2 = _interopRequireDefault(_previews);

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
            _this.config = config;
            _this.preview = (0, _previews2.default)(_this, config);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9ibG9jay50cyJdLCJuYW1lcyI6WyJCbG9jayIsInBhcmVudCIsInN0YWdlIiwiY29uZmlnIiwiZm9ybURhdGEiLCJlZGl0T25JbnNlcnQiLCJjaGlsZEVudGl0eUtleXMiLCJ0ZW1wbGF0ZSIsInByZXZpZXciLCJnZXRUZW1wbGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBWWNBLEs7OztBQVFWOzs7Ozs7OztBQVFBLHVCQUFZQyxNQUFaLEVBQTJDQyxLQUEzQyxFQUFrRUMsTUFBbEUsRUFBK0VDLFFBQS9FLEVBQTRGO0FBQUE7O0FBQUEseURBQ3hGLCtCQUFNSCxNQUFOLEVBQWNDLEtBQWQsQ0FEd0Y7O0FBYjVGLGtCQUFBRyxZQUFBLEdBQXdCLElBQXhCO0FBRUEsa0JBQUFDLGVBQUEsR0FBaUMsRUFBakM7QUFDQSxrQkFBQUMsUUFBQSxHQUFtQiw2Q0FBbkI7QUFhSSxrQkFBS0osTUFBTCxHQUFjQSxNQUFkO0FBQ0Esa0JBQUtLLE9BQUwsR0FBZSwrQkFBeUJMLE1BQXpCLENBQWY7QUFKd0Y7QUFLM0Y7QUFFRDs7Ozs7Ozt3QkFLQU0sVywwQkFBVztBQUNQLGdCQUFJLEtBQUtELE9BQUwsQ0FBYUQsUUFBakIsRUFBMkI7QUFDdkIsdUJBQU8sS0FBS0MsT0FBTCxDQUFhRCxRQUFwQjtBQUNIO0FBRUQ7QUFDQSxtQkFBTyw4QkFBTUUsV0FBTixXQUFQO0FBQ0gsUzs7Ozs7c0JBbkNTVCxLIiwiZmlsZSI6ImNvbXBvbmVudC9ibG9jay9ibG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0U3RydWN0dXJhbCB9IGZyb20gJy4uL3N0YWdlL3N0cnVjdHVyYWwvYWJzdHJhY3QnO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi4vc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmQnXG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uL3N0YWdlLmQnO1xuaW1wb3J0IHsgQmxvY2sgYXMgQmxvY2tJbnRlcmZhY2UgfSBmcm9tICcuL2Jsb2NrLmQnO1xuaW1wb3J0IGdldFByZXZpZXdJbnN0YW5jZSBmcm9tIFwiLi4vc3RhZ2UvcHJldmlld3NcIjtcbmltcG9ydCBQcmV2aWV3QmxvY2sgZnJvbSBcIi4vcHJldmlldy9ibG9ja1wiO1xuXG4vKipcbiAqIEFic3RyYWN0QmxvY2sgY2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxvY2sgZXh0ZW5kcyBBYnN0cmFjdFN0cnVjdHVyYWwgaW1wbGVtZW50cyBCbG9ja0ludGVyZmFjZSB7XG4gICAgdGl0bGU6IHN0cmluZztcbiAgICBjb25maWc6IGFueTtcbiAgICBlZGl0T25JbnNlcnQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHByZXZpZXc6IFByZXZpZXdCbG9jaztcbiAgICBjaGlsZEVudGl0eUtleXM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICB0ZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L2Jsb2NrL2Fic3RyYWN0Lmh0bWwnO1xuXG4gICAgLyoqXG4gICAgICogQWJzdHJhY3RCbG9jayBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKiBAcGFyYW0gZm9ybURhdGFcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSwgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlLCBjb25maWc6IGFueSwgZm9ybURhdGE6IGFueSkge1xuICAgICAgICBzdXBlcihwYXJlbnQsIHN0YWdlKTtcblxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5wcmV2aWV3ID0gZ2V0UHJldmlld0luc3RhbmNlKHRoaXMsIGNvbmZpZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHRlbXBsYXRlIGZyb20gdGhlIHByZXZpZXcgb3Igc3VwZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXZpZXcudGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZpZXcudGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbXBsZW1lbnQgcHJldmlldyB0ZW1wbGF0ZSBzeXN0ZW0gaGVyZVxuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0VGVtcGxhdGUoKTtcbiAgICB9XG59Il19
