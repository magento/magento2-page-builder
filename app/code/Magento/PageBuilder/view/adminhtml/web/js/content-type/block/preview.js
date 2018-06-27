/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _uiEvents, _config, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _BasePreview.call(this, parent, config, observableUpdater) || this;
      _this.displayPreview = _knockout.observable(false);
      _this.placeholderText = void 0;
      _this.messages = {
        NOT_SELECTED: (0, _translate)("Block Not Selected"),
        LOADING: (0, _translate)("Loading..."),
        UNKNOWN_ERROR: (0, _translate)("An unknown error occurred. Please try again.")
      };
      _this.placeholderText = _knockout.observable(_this.messages.NOT_SELECTED);
      return _this;
    }
    /**
     * Bind events
     */


    var _proto = Preview.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a block type is dropped for the first time open the edit panel


      _uiEvents.on("block:contentType:dropped:create", function (event, params) {
        if (event.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.edit.open();
          }, 300);
        }
      });
    };

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
        method: "GET",
        data: {
          role: this.config.name,
          block_id: data.block_id,
          directive: this.data.main.html()
        }
      }; // Retrieve a state object representing the block from the preview controller and process it on the stage

      _jquery.ajax(url, requestConfig).done(function (response) {
        var content = response.content !== undefined ? response.content.trim() : ""; // Empty content means something bad happened in the controller that didn't trigger a 5xx

        if (content.length === 0) {
          _this3.placeholderText(_this3.messages.UNKNOWN_ERROR);

          return;
        } // The state object will contain the block name and either html or a message why there isn't any.


        var blockData = _jquery.parseJSON(content); // Update the stage content type label with the real block title if provided


        _this3.displayLabel(blockData.title ? blockData.title : _this3.config.label);

        if (blockData.html) {
          _this3.displayPreview(true);

          _this3.data.main.html(blockData.html);
        } else if (blockData.error_message) {
          _this3.placeholderText(blockData.error_message);
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
