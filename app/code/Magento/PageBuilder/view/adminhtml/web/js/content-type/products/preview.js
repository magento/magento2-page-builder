/*eslint-disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "knockout", "mage/translate", "slick", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _slick, _underscore, _config, _hideShowOption, _preview) {
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
     * Define keys which when changed should not trigger the slider to be rebuilt
     *
     * @type {string[]}
     */

    /**
     * @inheritdoc
     */
    function Preview(contentType, config, observableUpdater) {
      var _this;

      _this = _preview2.call(this, contentType, config, observableUpdater) || this;
      _this.displayPreview = _knockout.observable(false);
      _this.widgetHtml = _knockout.observable();
      _this.messages = {
        EMPTY: (0, _translate)("Empty Products"),
        NO_RESULTS: (0, _translate)("No products were found matching your condition"),
        LOADING: (0, _translate)("Loading..."),
        UNKNOWN_ERROR: (0, _translate)("An unknown error occurred. Please try again.")
      };
      _this.ignoredKeysForBuild = ["margins_and_padding", "border", "border_color", "border_radius", "border_width", "css_classes", "text_align"];
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
     * On afterRender callback.
     *
     * @param {Element} element
     */
    ;

    _proto.onAfterRender = function onAfterRender(element) {
      this.element = element;
      this.initSlider();
    }
    /**
     * @inheritdoc
     */
    ;

    _proto.afterObservablesUpdated = function afterObservablesUpdated() {
      var _this2 = this;

      _preview2.prototype.afterObservablesUpdated.call(this);

      var data = this.contentType.dataStore.getState();

      if (this.hasDataChanged(this.previousData, data)) {
        this.displayPreview(false);

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
            _this2.widgetHtml(response.data.error);
          } else {
            _this2.widgetHtml(response.data.content);

            _this2.displayPreview(true);
          }
        }).fail(function () {
          _this2.placeholderText(_this2.messages.UNKNOWN_ERROR);
        });
      }

      this.previousData = Object.assign({}, data);
    };

    _proto.initSlider = function initSlider() {
      if (this.element && this.appearance() === "carousel") {
        (0, _jquery)(this.element.children).slick(this.buildSlickConfig());
      }
    }
    /**
     * Build the slick config object
     *
     * @returns {{autoplay: boolean; autoplay: number; infinite: boolean; arrows: boolean; dots: boolean;
     * centerMode: boolean; slidesToScroll: number, slidesToShow: number}}
     */
    ;

    _proto.buildSlickConfig = function buildSlickConfig() {
      var attributes = this.data.main.attributes();
      return {
        slidesToShow: 5,
        slidesToScroll: attributes["data-slide-all"] === "true" ? 5 : 1,
        centerMode: attributes["data-center-mode"] === "true",
        dots: attributes["data-show-dots"] === "true",
        arrows: attributes["data-show-arrows"] === "true",
        infinite: attributes["data-infinite-loop"] === "true",
        autoplay: attributes["data-autoplay"] === "true",
        autoplaySpeed: parseFloat(attributes["data-autoplay-speed"])
      };
    }
    /**
     * Determine if the data has changed, whilst ignoring certain keys which don't require a rebuild
     *
     * @param {DataObject} previousData
     * @param {DataObject} newData
     * @returns {boolean}
     */
    ;

    _proto.hasDataChanged = function hasDataChanged(previousData, newData) {
      previousData = _underscore.omit(previousData, this.ignoredKeysForBuild);
      newData = _underscore.omit(newData, this.ignoredKeysForBuild);
      return !_underscore.isEqual(previousData, newData);
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map