/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _events, _config, _preview) {
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
      _this.messages = {
        EMPTY: (0, _translate)("Empty Products"),
        NO_RESULTS: (0, _translate)("No products were found matching your condition"),
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
        if (typeof response.data !== "object" || !Boolean(response.data.content)) {
          _this3.placeholderText(_this3.messages.NO_RESULTS);

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

  return _extends(Preview, {
    __esModule: true
  });
});
//# sourceMappingURL=preview.js.map
