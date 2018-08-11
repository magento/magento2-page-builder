/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/widget-initializer", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _events, _widgetInitializer, _config, _preview) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
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
      _this.loading = _knockout.observable(false);
      _this.placeholderText = void 0;
      _this.lastBlockId = void 0;
      _this.lastTemplate = void 0;
      _this.lastRenderedHtml = void 0;
      _this.messages = {
        NOT_SELECTED: (0, _translate)("Empty Block"),
        UNKNOWN_ERROR: (0, _translate)("An unknown error occurred. Please try again.")
      };
      _this.placeholderText = _knockout.observable(_this.messages.NOT_SELECTED);
      return _this;
    }
    /**
     * Runs the widget initializer for each configured widget
     */


    var _proto = Preview.prototype;

    _proto.initializeWidgets = function initializeWidgets() {
      (0, _widgetInitializer)({
        config: _config.getConfig("widgets")
      });
    };
    /**
     * @inheritdoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a block type is dropped for the first time open the edit panel


      _events.on("block:dropAfter", function (args) {
        if (args.id === _this2.parent.id) {
          setTimeout(function () {
            _this2.openEdit();
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

      var data = this.parent.dataStore.get(); // Only load if something changed

      if (this.lastBlockId === data.block_id && this.lastTemplate === data.template) {
        // The mass converter will have transformed the HTML property into a directive
        if (this.lastRenderedHtml) {
          this.data.main.html(this.lastRenderedHtml);
          this.displayPreview(true);
        }
      } else {
        this.displayPreview(false);
        this.placeholderText("");
      }

      if (!data.block_id || data.template.length === 0) {
        this.displayPreview(false);
        this.placeholderText(this.messages.NOT_SELECTED);
        return;
      }

      this.loading(true);

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
          _this3.displayPreview(false);

          _this3.placeholderText(_this3.messages.UNKNOWN_ERROR);

          return;
        } // Update the stage content type label with the real block title if provided


        _this3.displayLabel(response.data.title ? response.data.title : _this3.config.label);

        if (response.data.content) {
          _this3.displayPreview(true);

          _this3.data.main.html(response.data.content);
        } else if (response.data.error) {
          _this3.displayPreview(false);

          _this3.placeholderText(response.data.error);
        }

        _this3.lastBlockId = parseInt(data.block_id.toString(), 10);
        _this3.lastTemplate = data.template.toString();
        _this3.lastRenderedHtml = response.data.content;
      }).fail(function () {
        _this3.displayPreview(false);

        _this3.placeholderText(_this3.messages.UNKNOWN_ERROR);
      }).always(function () {
        _this3.loading(false);
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
