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

    var ColumnBuilder = exports.ColumnBuilder = function () {
        /**
         * ColumnBuilder constructor
         */
        function ColumnBuilder() {
            _classCallCheck(this, ColumnBuilder);

            this.position = _knockout2.default.observable('');
            this.visible = _knockout2.default.observable(false);
            this.sizes = _knockout2.default.observableArray([]);
            this.template = 'Gene_BlueFoot/component/stage/structural/column/builder.html';
            var columnOptions = _config2.default.getInitConfig("column_definitions");
            for (var i = 0; i < columnOptions.length; i++) {
                if (columnOptions[i].displayed === true) {
                    this.sizes.push({
                        label: columnOptions[i].label,
                        className: columnOptions[i].className
                    });
                }
            }
        }
        /**
         * Show the builder from the column options scope
         */


        ColumnBuilder.prototype.showFromOption = function showFromOption() {
            this.position('top');
            this.visible(true);
        };

        /**
         * Change the visibility to visible
         */
        ColumnBuilder.prototype.show = function show() {
            this.visible(true);
        };

        /**
         * Change the visibility to hidden
         */
        ColumnBuilder.prototype.hide = function hide() {
            this.visible(false);
        };

        /**
         * Proxy to the correct parent's add column function
         */
        ColumnBuilder.prototype.addColumn = function addColumn(parents, data) {
            // Nest a column (within a column or on a row)
            if (this.position() == 'top') {
                parents[1].addColumn(data);
            } else {
                // Add to left or right side of current column
                parents[1].insertColumnAtIndex(this.position(), parents[1], data);
            }
        };

        return ColumnBuilder;
    }();
});