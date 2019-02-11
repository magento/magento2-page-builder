/*eslint-disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _config, _hideShowOption, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    /**
     * @inheritdoc
     */
    function Preview(contentType, config, observableUpdater) {
      var _this;

      _this = _preview2.call(this, contentType, config, observableUpdater) || this;
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
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */


    var _proto = Preview.prototype;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _preview2.prototype.retrieveOptions.call(this);

      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    }
    /**
     * @inheritdoc
     */
    ;

    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      var _this2 = this;

      _preview2.prototype.afterObservablesUpdated.call(this);

      this.displayPreview(false);
      var data = this.contentType.dataStore.getState();

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
          _this2.placeholderText(_this2.messages.NO_RESULTS);

          return;
        }

        if (response.data.error) {
          _this2.data.main.html(response.data.error);
        } else {
          _this2.data.main.html(response.data.content);

          _this2.displayPreview(true);
        }
      }).fail(function () {
        _this2.placeholderText(_this2.messages.UNKNOWN_ERROR);
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map