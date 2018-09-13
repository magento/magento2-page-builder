/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/utils/delay-until", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _translate, _events, _underscore, _config, _contentTypeFactory, _option, _delayUntil, _previewCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_PreviewCollection) {
    _inheritsLoose(Preview, _PreviewCollection);

    /**
     * Keeps track of number of button item to disable sortable if there is only 1.
     */

    /**
     * @param {ContentTypeCollectionInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(parent, config, observableUpdater) {
      var _this;

      _this = _PreviewCollection.call(this, parent, config, observableUpdater) || this; // Monitor focus tab to start / stop interaction on the stage, debounce to avoid duplicate calls

      _this.focusedButton = _knockout.observable();
      _this.disableSorting = _knockout.computed(function () {
        var sortableElement = (0, _jquery)(_this.wrapperElement).find(".buttons-container");

        if (_this.parent.children().length <= 1) {
          sortableElement.sortable("disable");
        } else {
          sortableElement.sortable("enable");
        }
      });
      _this.debouncedResizeHandler = _underscore.debounce(function () {
        _this.resizeChildButtons();
      }, 350);

      _this.focusedButton.subscribe(_underscore.debounce(function (index) {
        if (index !== null) {
          _events.trigger("stage:interactionStart");

          var focusedButton = _this.parent.children()[index];

          (0, _delayUntil)(function () {
            return (0, _jquery)(focusedButton.preview.wrapperElement).find("[contenteditable]").focus();
          }, function () {
            return typeof focusedButton.preview.wrapperElement !== "undefined";
          }, 10);
        } else {
          // We have to force the stop as the event firing is inconsistent for certain operations
          _events.trigger("stage:interactionStop", {
            force: true
          });
        }
      }, 1));

      return _this;
    }
    /**
     * Bind events
     */


    var _proto = Preview.prototype;

    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _PreviewCollection.prototype.bindEvents.call(this);

      _events.on("buttons:dropAfter", function (args) {
        if (args.id === _this2.parent.id && _this2.parent.children().length === 0) {
          _this2.addButton();
        }
      });

      _events.on("buttons:renderAfter", function (eventData) {
        if (eventData.contentType.id === _this2.parent.id) {
          _this2.debouncedResizeHandler();
        }
      });

      _events.on("button-item:renderAfter", function (eventData) {
        if (eventData.contentType.parent.id === _this2.parent.id) {
          _this2.debouncedResizeHandler();
        }
      });

      _events.on("stage:updateAfter", function (eventData) {
        _this2.debouncedResizeHandler();
      });

      _events.on("contentType:redrawAfter", function (eventData) {
        _this2.debouncedResizeHandler();
      }); // Capture when a content type is duplicated within the container


      var duplicatedButton;
      var duplicatedButtonIndex;

      _events.on("button-item:duplicateAfter", function (args) {
        if (_this2.parent.id === args.duplicateContentType.parent.id && args.direct) {
          duplicatedButton = args.duplicateContentType;
          duplicatedButtonIndex = args.index;
        }
      });

      _events.on("button-item:mountAfter", function (args) {
        if (duplicatedButton && args.id === duplicatedButton.id) {
          _this2.focusedButton(duplicatedButtonIndex);
        }
      });
    };
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _PreviewCollection.prototype.retrieveOptions.call(this);

      options.add = new _option({
        preview: this,
        icon: "<i class='icon-pagebuilder-add'></i>",
        title: (0, _translate)("Add Button"),
        action: this.addButton,
        classes: ["add-child"],
        sort: 10
      });
      return options;
    };
    /**
     * Add button-item to buttons children array
     */


    _proto.addButton = function addButton() {
      var _this3 = this;

      var createButtonItemPromise = (0, _contentTypeFactory)(_config.getContentTypeConfig("button-item"), this.parent, this.parent.stageId, {});
      createButtonItemPromise.then(function (button) {
        _this3.parent.addChild(button);

        _this3.focusedButton(_this3.parent.children().indexOf(button));

        return button;
      }).catch(function (error) {
        console.error(error);
      });
    };
    /**
     * Get the sortable options for the buttons sorting
     *
     * @param {string} orientation
     * @param {string} tolerance
     * @returns {JQueryUI.Sortable}
     */


    _proto.getSortableOptions = function getSortableOptions(orientation, tolerance) {
      if (orientation === void 0) {
        orientation = "width";
      }

      if (tolerance === void 0) {
        tolerance = "intersect";
      }

      return {
        handle: ".button-item-drag-handle",
        items: ".pagebuilder-content-type-wrapper",
        cursor: "grabbing",
        containment: "parent",
        tolerance: tolerance,
        revert: 200,
        disabled: this.parent.children().length <= 1,

        /**
         * Provide custom helper element
         *
         * @param {Event} event
         * @param {JQueryUI.Sortable} element
         * @returns {Element}
         */
        helper: function helper(event, element) {
          var helper = (0, _jquery)(element).clone().css({
            opacity: "0.7",
            width: "auto"
          });
          helper[0].querySelector(".pagebuilder-options").remove();
          return helper[0];
        },
        placeholder: {
          /**
           * Provide custom placeholder element
           *
           * @param {JQuery} item
           * @returns {JQuery}
           */
          element: function element(item) {
            var placeholder = item.clone().css({
              display: "inline-block",
              opacity: "0.3"
            }).removeClass("focused").addClass("sortable-placeholder");
            placeholder[0].querySelector(".pagebuilder-options").remove();
            return placeholder[0];
          },
          update: function update() {
            return;
          }
        },

        /**
         * Trigger interaction start on sort
         */
        start: function start() {
          _events.trigger("stage:interactionStart");
        },

        /**
         * Stop stage interaction on stop
         */
        stop: function stop() {
          _events.trigger("stage:interactionStop");
        }
      };
    };
    /**
     * Resize width of all child buttons. Dependently make them the same width if configured.
     */


    _proto.resizeChildButtons = function resizeChildButtons() {
      if (this.wrapperElement) {
        var buttonItems = (0, _jquery)(this.wrapperElement).find(".pagebuilder-button-item > a");
        var buttonResizeValue = 0;

        if (this.parent.dataStore.get("is_same_width") === "true") {
          if (buttonItems.length > 0) {
            var currentLargestButtonWidth = this.findLargestButtonWidth(buttonItems);
            var parentWrapperWidth = (0, _jquery)(this.wrapperElement).width();

            if (currentLargestButtonWidth === 0) {
              return;
            }

            buttonResizeValue = Math.min(currentLargestButtonWidth, parentWrapperWidth);
          }
        }

        buttonItems.css("min-width", buttonResizeValue);
      }
    };
    /**
     * Find the largest button width for calculating same size value.
     *
     * @param {JQuery} buttonItems
     * @returns {number}
     */


    _proto.findLargestButtonWidth = function findLargestButtonWidth(buttonItems) {
      var _this4 = this;

      return _underscore.max(_underscore.map(buttonItems, function (buttonItem) {
        return _this4.calculateButtonWidth((0, _jquery)(buttonItem));
      }));
    };
    /**
     * Manually calculate button width using content plus box widths (padding, border)
     *
     * @param {JQuery} buttonItem
     * @returns {number}
     */


    _proto.calculateButtonWidth = function calculateButtonWidth(buttonItem) {
      if (buttonItem.is(":visible") === false) {
        return 0;
      }

      var widthProperties = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
      return widthProperties.reduce(function (accumulatedWidth, widthProperty) {
        return accumulatedWidth + (parseInt(buttonItem.css(widthProperty), 10) || 0);
      }, buttonItem.find("[data-element='link_text']").width());
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
