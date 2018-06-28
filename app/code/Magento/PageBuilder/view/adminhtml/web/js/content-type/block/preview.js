/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _uiEvents, _config, _preview) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    /**
     * @inheritdoc
     */
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _BasePreview.call(this, parent, config, observableUpdater) || this;
      _this.displayPreview = _knockout.observable(false);
      _this.placeholderText = void 0;
      _this.messages = {
        NOT_SELECTED: (0, _translate)("Empty Block"),
        LOADING: (0, _translate)("Loading..."),
        UNKNOWN_ERROR: (0, _translate)("An unknown error occurred. Please try again.")
      };
      _this.placeholderText = _knockout.observable(_this.messages.NOT_SELECTED);
      return _this;
    }
    /**
     * @inheritdoc
     */


    var _proto = Preview.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a block type is dropped for the first time open the edit panel


      _uiEvents.on("block:contentType:dropped:create", function (args) {
        if (args.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.edit.open();
          }, 300);
        }
      });
    };
    /**
     * @inheritdoc
     */


    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      var _this3 = this;

      _BasePreview.prototype.afterObservablesUpdated.call(this);

      this.placeholderText(this.messages.LOADING);
      this.displayPreview(false);
      var data = this.parent.dataStore.get();

      if (!data.block_id || data.template.length === 0) {
        this.placeholderText(this.messages.NOT_SELECTED);
        return;
      }

      var url = _config.getConfig("preview_url");

      var requestConfig = {
        // Prevent caching
        method: "POST",
        data: {
          role: this.config.name,
          block_id: data.block_id,
          directive: this.data.main.html()
        }
      }; // Retrieve a state object representing the block from the preview controller and process it on the stage

      _jquery.ajax(url, requestConfig) // The state object will contain the block name and either html or a message why there isn't any.
      .done(function (response) {
        // Empty content means something bad happened in the controller that didn't trigger a 5xx
        if (_typeof(response.data) !== "object") {
          _this3.placeholderText(_this3.messages.UNKNOWN_ERROR);

          return;
        } // Update the stage content type label with the real block title if provided


        _this3.displayLabel(response.data.title ? response.data.title : _this3.config.label);

        if (response.data.content) {
          _this3.displayPreview(true);

          _this3.data.main.html(response.data.content);
        } else if (response.data.error) {
          _this3.placeholderText(response.data.error);
        }
      }).fail(function () {
        _this3.placeholderText(_this3.messages.UNKNOWN_ERROR);
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
