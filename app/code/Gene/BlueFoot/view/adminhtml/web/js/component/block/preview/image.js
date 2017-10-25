define(["./block", "knockout", "../../config"], function (_block, _knockout, _config) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * PreviewImageBlock Class
   * 
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var PreviewImageBlock =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inherits(PreviewImageBlock, _PreviewBlock);

    function PreviewImageBlock() {
      var _ref;

      var _temp, _this;

      _classCallCheck(this, PreviewImageBlock);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = PreviewImageBlock.__proto__ || Object.getPrototypeOf(PreviewImageBlock)).call.apply(_ref, [this].concat(args))), Object.defineProperty(_this, "loading", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observable(false)
      }), _temp));
    }

    _createClass(PreviewImageBlock, [{
      key: "uploadUrl",
      // imageUrl: KnockoutComputed<string> = ko.computed(() => {
      //     if (this.data.image()) {
      //         return Config.getInitConfig('media_url') + this.data.image().replace('/media/', '');
      //     }
      //     return '';
      // });

      /**
       * Retrieve the upload URL from the configuration
       */
      value: function uploadUrl() {
        return _config.getPluginConfig('gene_widget_upload', 'upload_url');
      }
      /**
       * Update data when an attachment is successful
       */

    }, {
      key: "attachmentSuccess",
      value: function attachmentSuccess() {
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
      }
      /**
       * Handle an attachment being dropped
       */

    }, {
      key: "attachmentDrop",
      value: function attachmentDrop() {
        var _this3 = this;

        return function (event) {
          jQuery(event.target).parents('.dz-drag-hover').removeClass('dz-drag-hover');

          _this3.loading(true);
        };
      }
      /**
       * Handle an attachment error
       */

    }, {
      key: "attachmentError",
      value: function attachmentError() {
        this.loading(false);
        alert($t("Your image could not be uploaded"));
      }
    }]);

    return PreviewImageBlock;
  }(_block);

  return PreviewImageBlock;
});
//# sourceMappingURL=image.js.map
