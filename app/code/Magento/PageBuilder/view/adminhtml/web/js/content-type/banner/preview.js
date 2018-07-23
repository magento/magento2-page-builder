/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/uploader"], function (_translate, _events, _preview, _uploader) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.uploader = void 0, _this.buttonPlaceholder = (0, _translate)("Edit Button Text"), _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    _proto.getUploader = function getUploader() {
      return this.uploader;
    };
    /**
     * Set state based on overlay mouseover event for the preview
     */


    _proto.onMouseOverWrapper = function onMouseOverWrapper() {
      if (this.data.main.attributes()["data-show-overlay"] === "hover") {
        this.data.overlay.attributes(Object.assign(this.data.overlay.attributes(), {
          "data-background-color-orig": this.data.overlay.style().backgroundColor
        }));
        this.data.overlay.style(Object.assign(this.data.overlay.style(), {
          backgroundColor: this.data.overlay.attributes()["data-overlay-color"]
        }));
      }

      if (this.data.main.attributes()["data-show-button"] === "hover") {
        this.data.button.style(Object.assign(this.data.button.style(), {
          opacity: 1,
          visibility: "visible"
        }));
      }
    };
    /**
     * Set state based on overlay mouseout event for the preview
     */


    _proto.onMouseOutWrapper = function onMouseOutWrapper() {
      if (this.data.main.attributes()["data-show-overlay"] === "hover") {
        this.data.overlay.style(Object.assign(this.data.overlay.style(), {
          backgroundColor: this.data.overlay.attributes()["data-background-color-orig"]
        }));
      }

      if (this.data.main.attributes()["data-show-button"] === "hover") {
        this.data.button.style(Object.assign(this.data.button.style(), {
          opacity: 0,
          visibility: "hidden"
        }));
      }
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this2.parent.dataStore.get();

        var imageObject = dataStore[_this2.config.additional_data.uploaderConfig.dataScope][0] || {};

        _events.trigger("image:" + _this2.parent.id + ":assignAfter", imageObject);
      });

      _events.on(this.config.name + ":mountAfter", function () {
        var dataStore = _this2.parent.dataStore.get();

        var initialImageValue = dataStore[_this2.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

        _this2.uploader = new _uploader("imageuploader_" + _this2.parent.id, _this2.config.additional_data.uploaderConfig, _this2.parent.id, _this2.parent.dataStore, initialImageValue);
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
