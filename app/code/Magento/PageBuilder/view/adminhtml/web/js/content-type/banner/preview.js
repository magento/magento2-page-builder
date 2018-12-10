/*eslint-disable */
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

<<<<<<< Updated upstream
define(["jquery", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/uploader", "Magento_PageBuilder/js/wysiwyg/factory", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _translate, _events, _config, _hideShowOption, _uploader, _factory, _preview) {
=======
define(["jquery", "mage/translate", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/modal/nest-link-dialog", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/uploader", "Magento_PageBuilder/js/wysiwyg/factory", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _translate, _events, _nestLinkDialog, _config, _uploader, _factory, _preview) {
>>>>>>> Stashed changes
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

    function Preview() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _preview2.call.apply(_preview2, [this].concat(args)) || this;
      _this.buttonPlaceholder = (0, _translate)("Edit Button Text");
      return _this;
    }

    var _proto = Preview.prototype;

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
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
    };
    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */


    _proto.getUploader = function getUploader() {
      var dataStore = this.parent.dataStore.get();
      var initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

      return new _uploader("imageuploader_" + this.parent.id, this.config.additional_data.uploaderConfig, this.parent.id, this.parent.dataStore, initialImageValue);
    };
    /**
     * Makes WYSIWYG active
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     */


    _proto.activateEditor = function activateEditor(preview, event) {
      var element = this.element || this.textarea;

      if (event.currentTarget !== event.target && event.target !== element && !element.contains(event.target)) {
        return;
      }

      element.focus();
    };
    /**
     * Stop event to prevent execution of action when editing textarea.
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */


    _proto.stopEvent = function stopEvent(preview, event) {
      event.stopPropagation();
      return true;
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
     * @returns {Boolean}
     */


    _proto.isWysiwygSupported = function isWysiwygSupported() {
      return _config.getConfig("can_use_inline_editing_on_stage");
    };
    /**
     * @param {HTMLElement} element
     */


    _proto.initWysiwyg = function initWysiwyg(element) {
      var _this2 = this;

      this.element = element;
      element.id = this.parent.id + "-editor";
      var config = this.config.additional_data.wysiwygConfig.wysiwygConfigData;
      config.adapter.settings.fixed_toolbar_container = "#" + this.parent.id + " .pagebuilder-banner-text-content";
      (0, _factory)(this.parent.id, element.id, this.config.name, config, this.parent.dataStore, "message").then(function (wysiwyg) {
        _this2.wysiwyg = wysiwyg;
      });
    };
    /**
     * @param {HTMLTextAreaElement} element
     */


    _proto.initTextarea = function initTextarea(element) {
      var _this3 = this;

      this.textarea = element; // set initial value of textarea based on data store

      this.textarea.value = this.parent.dataStore.get("message");
      this.adjustTextareaHeightBasedOnScrollHeight(); // Update content in our stage preview textarea after its slideout counterpart gets updated

      _events.on("form:" + this.parent.id + ":saveAfter", function () {
        _this3.textarea.value = _this3.parent.dataStore.get("message");

        _this3.adjustTextareaHeightBasedOnScrollHeight();
      });
    };
    /**
     * Save current value of textarea in data store
     */


    _proto.onTextareaKeyUp = function onTextareaKeyUp() {
      this.adjustTextareaHeightBasedOnScrollHeight();
      this.parent.dataStore.update(this.textarea.value, "message");
    };
    /**
     * Start stage interaction on textarea blur
     */


    _proto.onTextareaFocus = function onTextareaFocus() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-banner-text-content").addClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStart");
    };
    /**
     * Stop stage interaction on textarea blur
     */


    _proto.onTextareaBlur = function onTextareaBlur() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-banner-text-content").removeClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStop");
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this4 = this;

      _preview2.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this4.parent.dataStore.get();

        var imageObject = dataStore[_this4.config.additional_data.uploaderConfig.dataScope][0] || {};

        _events.trigger("image:" + _this4.parent.id + ":assignAfter", imageObject);

        var message = dataStore.message;
        var linkUrl = dataStore.link_url;
        var aLinkRegex = /<a.*?>|<\/a>/igm;

        if (message.match(aLinkRegex) && dataStore.link_url && (linkUrl.type === "page" && linkUrl.page && linkUrl.page.length !== 0 || linkUrl.type === "product" && linkUrl.product && linkUrl.product.length !== 0 || linkUrl.type === "category" && linkUrl.category && linkUrl.category.length !== 0 || linkUrl.type === "default" && linkUrl.default && linkUrl.default.length !== 0)) {
          (0, _nestLinkDialog)({
            actions: {
              confirm: function confirm() {
                var anchorLessMessage = message.replace(aLinkRegex, ""); // Call the parent to remove the child element

                _this4.parent.dataStore.update(anchorLessMessage, "message");

                (0, _jquery)("#" + _this4.wysiwyg.elementId).html(anchorLessMessage);
              }
            },
            content: (0, _translate)("Adding link in both contents and the outer element will result in nesting links. " + "This may break the structure of the page elements."),
            // tslint:disable-line:max-line-length
            title: (0, _translate)("Nesting links are not allowed"),
            buttonText: "Revert Link"
          });
        }
      });
    };
    /**
     * Adjust textarea's height based on scrollHeight
     */


    _proto.adjustTextareaHeightBasedOnScrollHeight = function adjustTextareaHeightBasedOnScrollHeight() {
      this.textarea.style.height = "";
      var scrollHeight = this.textarea.scrollHeight;
      var minHeight = parseInt((0, _jquery)(this.textarea).css("min-height"), 10);

      if (scrollHeight === minHeight) {
        // leave height at 'auto'
        return;
      }

      (0, _jquery)(this.textarea).height(scrollHeight);
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
