define(["./block", "knockout", "../../config"], function (_block, _knockout, _config) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var PreviewImageBlock =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(PreviewImageBlock, _PreviewBlock);

    function PreviewImageBlock() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewBlock.call.apply(_PreviewBlock, [this].concat(args)) || this, _this.loading = _knockout.observable(false), _temp) || _this;
    }

    var _proto = PreviewImageBlock.prototype;

    // imageUrl: KnockoutComputed<string> = ko.computed(() => {
    //     if (this.data.image()) {
    //         return Config.getInitConfig('media_url') + this.data.image().replace('/media/', '');
    //     }
    //     return '';
    // });

    /**
     * Retrieve the upload URL from the configuration
     */
    _proto.uploadUrl = function uploadUrl() {
      return _config.getPluginConfig('gene_widget_upload', 'upload_url');
    };
    /**
     * Update data when an attachment is successful
     */


    _proto.attachmentSuccess = function attachmentSuccess() {
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
    /**
     * Handle an attachment being dropped
     */


    _proto.attachmentDrop = function attachmentDrop() {
      var _this3 = this;

      return function (event) {
        jQuery(event.target).parents('.dz-drag-hover').removeClass('dz-drag-hover');

        _this3.loading(true);
      };
    };
    /**
     * Handle an attachment error
     */


    _proto.attachmentError = function attachmentError() {
      this.loading(false);
      alert($t("Your image could not be uploaded"));
    };

    return PreviewImageBlock;
  }(_block);

  return PreviewImageBlock;
});
//# sourceMappingURL=image.js.map
