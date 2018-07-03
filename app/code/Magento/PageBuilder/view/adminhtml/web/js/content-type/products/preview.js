/*eslint-disable */
<<<<<<< HEAD
define(["jquery", "knockout", "mage/translate", "uiEvents", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _uiEvents, _config, _preview) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

=======
define(["jquery", "knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _events, _config, _preview) {
>>>>>>> develop
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
      _this.placeholderText = void 0;
      _this.messages = {
        EMPTY: (0, _translate)("Empty Products"),
        LOADING: (0, _translate)("Loading..."),
        UNKNOWN_ERROR: (0, _translate)("An unknown error occurred. Please try again.")
      };
      _this.placeholderText = _knockout.observable(_this.messages.EMPTY);
      return _this;
    }
    /**
     * @inheritdoc
     */


    var _proto = Preview.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this); // When a products type is dropped for the first time open the edit panel


      _events.on("products:dropAfter", function (args) {
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

<<<<<<< HEAD
=======
      _events.on("previewData:updateAfter", function (event, params) {
        if (event.preview.parent.id !== _this2.parent.id) {
          return;
        }
>>>>>>> develop

    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      var _this3 = this;

      _BasePreview.prototype.afterObservablesUpdated.call(this);

      this.displayPreview(false);
      var data = this.parent.dataStore.get();

      if (typeof data.conditions_encoded !== "string" || data.conditions_encoded.length === 0) {
        this.placeholderText(this.messages.EMPTY);
        return;
      }

      var url = _config.getConfig("preview_url");

      var requestConfig = {
        // Prevent caching
        method: "POST",
        data: {
          role: this.config.name,
          directive: this.data.main.html()
        }
      };
      this.placeholderText(this.messages.LOADING);

      _jquery.ajax(url, requestConfig).done(function (response) {
        if (_typeof(response.data) !== "object" || typeof response.data.content === "undefined") {
          _this3.placeholderText(_this3.messages.EMPTY);

          return;
        }

        if (response.data.error) {
          _this3.data.main.html(response.data.error);
        } else {
          _this3.data.main.html(response.data.content);

          _this3.displayPreview(true);
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
