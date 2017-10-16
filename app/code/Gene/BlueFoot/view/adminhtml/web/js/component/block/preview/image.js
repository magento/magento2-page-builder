define(["exports", "./block", "knockout", "../../config"], function (exports, _block, _knockout, _config) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _block2 = _interopRequireDefault(_block);

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

    var PreviewImageBlock = function (_PreviewBlock) {
        _inherits(PreviewImageBlock, _PreviewBlock);

        function PreviewImageBlock() {
            _classCallCheck(this, PreviewImageBlock);

            var _this = _possibleConstructorReturn(this, _PreviewBlock.apply(this, arguments));

            _this.loading = _knockout2.default.observable(false);
            return _this;
        }
        // imageUrl: KnockoutComputed<string> = ko.computed(() => {
        //     if (this.data.image()) {
        //         return Config.getInitConfig('media_url') + this.data.image().replace('/media/', '');
        //     }
        //     return '';
        // });
        /**
         * Retrieve the upload URL from the configuration
         */


        PreviewImageBlock.prototype.uploadUrl = function uploadUrl() {
            return _config2.default.getPluginConfig('gene_widget_upload', 'upload_url');
        };

        PreviewImageBlock.prototype.attachmentSuccess = function attachmentSuccess() {
            var _this2 = this;

            return function (file, response, bindKey) {
                if (response.file) {
                    _this2.parent.stage.store.updateKey(_this2.parent.id, bindKey, response.file);
                    setTimeout(function () {
                        _this2.loading(false);
                    }, 50);
                } else {
                    alert($t("Your image could not be uploaded"));
                }
            };
        };

        PreviewImageBlock.prototype.attachmentDrop = function attachmentDrop() {
            var _this3 = this;

            return function (event) {
                jQuery(event.target).parents('.dz-drag-hover').removeClass('dz-drag-hover');
                _this3.loading(true);
            };
        };

        PreviewImageBlock.prototype.attachmentError = function attachmentError() {
            this.loading(false);
            alert($t("Your image could not be uploaded"));
        };

        return PreviewImageBlock;
    }(_block2.default);

    exports.default = PreviewImageBlock;
});