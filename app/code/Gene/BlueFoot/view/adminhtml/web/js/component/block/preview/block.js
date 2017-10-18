define(["exports", "underscore", "knockout"], function (exports, _underscore, _knockout) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

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

    var PreviewBlock = function () {
        /**
         * PreviewBlock constructor
         *
         * @param {Block} parent
         * @param {Object} config
         */
        function PreviewBlock(parent, config) {
            var _this = this;

            _classCallCheck(this, PreviewBlock);

            this.template = '';
            this.data = {};
            this.parent = parent;
            this.config = config;
            if (typeof this.config.preview_template !== 'undefined' && this.config.preview_template) {
                this.template = this.config.preview_template;
            }
            // Subscribe to this blocks data in the store
            this.parent.stage.store.subscribe(function (data) {
                var missingFields = _underscore2.default.difference(_this.config.fields_list, _underscore2.default.keys(data));
                missingFields.forEach(function (key) {
                    _this.updateDataValue(key, '');
                });
                _underscore2.default.forEach(data, function (value, key) {
                    _this.updateDataValue(key, value);
                });
            }, this.parent.id);
        }
        /**
         * Update the data value of a part of our internal Knockout data store
         *
         * @param {string} key
         * @param value
         */


        PreviewBlock.prototype.updateDataValue = function updateDataValue(key, value) {
            if (typeof this.data[key] !== 'undefined' && _knockout2.default.isObservable(this.data[key])) {
                this.data[key](value);
            } else {
                this.data[key] = _knockout2.default.observable(value);
            }
        };

        PreviewBlock.prototype.getStyle = function getStyle() {
            var styleAttributes = ['min_height', 'background_color', 'background_image', 'background_size', 'background_attachment', 'background_repeat', 'border_style', 'border_width', 'border_color', 'border_radius', 'margin_top', 'margin_right', 'margin_bottom', 'margin_left', 'padding_top', 'padding_right', 'padding_bottom', 'padding_left'];
            var data = {};
            Object.keys(this.data).map(function (key) {
                if (Object.values(styleAttributes).indexOf(key) > -1) {
                    data[this.fromSnakeToCamelCase(key)] = this.data[key];
                }
            }.bind(this));
            console.log(data);
            return data;
        };

        PreviewBlock.prototype.fromSnakeToCamelCase = function fromSnakeToCamelCase(string) {
            var parts = string.split(/[_-]/);
            var newString = '';
            for (var i = 1; i < parts.length; i++) {
                newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
            }
            return parts[0] + newString;
        };

        return PreviewBlock;
    }();

    exports.default = PreviewBlock;
});