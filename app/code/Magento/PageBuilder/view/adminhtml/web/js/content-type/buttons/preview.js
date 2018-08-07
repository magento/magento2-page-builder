/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _translate, _events, _config, _contentTypeFactory, _option, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewCollection.call.apply(_PreviewCollection, [this].concat(args)) || this, _this.isLiveEditing = _knockout.observable(false), _temp) || _this;
    }

    var _proto = Preview.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _PreviewCollection.prototype.bindEvents.call(this);

      _events.on("buttons:dropAfter", function (args) {
        if (args.id === _this2.parent.id && _this2.parent.children().length === 0) {
          _this2.addButton();
        }
      });

      _events.on("previewData:updateAfter", function (eventData) {
        var contentTypePreview = eventData.preview;

        if (contentTypePreview.config.name === "button-item" && contentTypePreview.parent.parent.id === _this2.parent.id || contentTypePreview.config.name === "buttons" && contentTypePreview.parent.id === _this2.parent.id) {
          _this2.resizeChildButtons();
        }
      });

      _events.on("button-item:renderAfter", function (eventData) {
        if (eventData.contentType.parent.id === _this2.parent.id) {
          _this2.resizeChildButtons();
        }
      });

      _events.on("button-item:removeAfter", function (eventData) {
        if (eventData.parent.id === _this2.parent.id) {
          _this2.resizeChildButtons();
        }
      });
    };
    /**
     * Set state based on mouseover event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */


    _proto.onMouseOver = function onMouseOver(context, event) {
      // Only run the mouse over action when the active element is not a child of buttons
      if (!_jquery.contains(this.wrapperElement, document.activeElement)) {
        return _PreviewCollection.prototype.onMouseOver.call(this, context, event);
      }
    };
    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      options.push(new _option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add Button"), this.addButton, ["add-child"], 20));
      return options;
    };
    /**
     * Add button-item to buttons children array
     */


    _proto.addButton = function addButton() {
      var _this3 = this;

      var createButtonItemPromise = (0, _contentTypeFactory)(_config.getContentTypeConfig("button-item"), this.parent.parent, this.parent.stageId, {});
      createButtonItemPromise.then(function (button) {
        _this3.parent.addChild(button);

        _this3.isLiveEditing(_this3.parent.children().indexOf(button) !== -1);

        return button;
      }).catch(function (error) {
        console.error(error);
      });
    };
    /**
     * Resize width of all child buttons. Dependently make them the same width if configured.
     */


    _proto.resizeChildButtons = function resizeChildButtons() {
      if (this.wrapperElement) {
        var buttonItems = (0, _jquery)(this.wrapperElement).find(".pagebuilder-button-item > a");
        var buttonResizeValue = "";

        if (this.parent.dataStore.get("same_width") === "1") {
          if (buttonItems.length > 0) {
            var currentLargestButton = this.findLargestButton(buttonItems);
            buttonResizeValue = currentLargestButton.css("min-width", "").outerWidth();
          }
        }

        buttonItems.css("min-width", buttonResizeValue);
      }
    };
    /**
     * Find the largest button which will determine the button width we use for re-sizing.
     *
     * @param {JQuery} buttonItems
     * @returns {JQuery}
     */


    _proto.findLargestButton = function findLargestButton(buttonItems) {
      var _this4 = this;

      var largestButton = null;
      buttonItems.each(function (index, element) {
        var buttonElement = (0, _jquery)(element);

        if (largestButton === null || _this4.calculateButtonWidth(buttonElement) > _this4.calculateButtonWidth(largestButton)) {
          largestButton = buttonElement;
        }
      });
      return largestButton;
    };
    /**
     * Manually calculate button width using content plus box widths (padding, border)
     *
     * @param {JQuery} buttonItem
     * @returns {number}
     */


    _proto.calculateButtonWidth = function calculateButtonWidth(buttonItem) {
      var widthProperties = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
      var calculatedButtonWidth = widthProperties.reduce(function (accumulatedWidth, widthProperty) {
        return accumulatedWidth + (parseInt(buttonItem.css(widthProperty), 10) || 0);
      }, buttonItem.find("span").width());
      return calculatedButtonWidth;
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
