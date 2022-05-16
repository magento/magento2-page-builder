/*eslint-disable */
/* jscs:disable */

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

define(["jquery", "mage/adminhtml/wysiwyg/events", "mage/adminhtml/wysiwyg/tiny_mce/setup", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/utils/check-stage-full-screen", "Magento_PageBuilder/js/utils/delay-until", "Magento_PageBuilder/js/utils/pagebuilder-header-height"], function (_jquery, _events, _setup, _events2, _underscore, _checkStageFullScreen, _delayUntil, _pagebuilderHeaderHeight) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Inline editing wysiwyg component
   *
   * @api
   */
  var Wysiwyg = /*#__PURE__*/function () {
    "use strict";

    /**
     * The id of the editor element
     */

    /**
     * The supplied wysiwyg configuration
     */

    /**
     * Id of content type
     */

    /**
     * Id of the stage
     */

    /**
     * Wysiwyg adapter instance
     */

    /**
     * Content type's data store
     */

    /**
     * Field name in data store reflecting value held in wysiwyg
     */

    /**
     * Create a debounce to save the content into the data store
     */

    /**
     * @param {String} contentTypeId The ID in the registry of the content type.
     * @param {String} elementId The ID of the editor element in the DOM.
     * @param {AdditionalDataConfigInterface} config The configuration for the wysiwyg.
     * @param {DataStore} dataStore The datastore to store the content in.
     * @param {String} fieldName The key in the provided datastore to set the data.
     * @param {String} stageId The ID in the registry of the stage containing the content type.
     */
    function Wysiwyg(contentTypeId, elementId, config, dataStore, fieldName, stageId) {
      this.saveContentDebounce = _underscore.debounce(this.saveContentFromWysiwygToDataStore.bind(this), 500);
      this.contentTypeId = contentTypeId;
      this.elementId = elementId;
      this.fieldName = fieldName;
      this.config = config;
      this.dataStore = dataStore;
      this.stageId = stageId;

      if (this.config.adapter_config.mode === "inline") {
        /**
         * Don't include content_css within the inline mode of TinyMCE, if any stylesheets are included here they're
         * appended to the head of the main page, and thus cause other styles to be modified.
         *
         * The styles for typography in the inline editor are scoped within _typography.less
         */
        this.config.adapter.tinymce.content_css = [];
      }

      var wysiwygSetup = new _setup(this.elementId, this.config.adapter);
      wysiwygSetup.setup(this.config.adapter_config.mode);
      this.wysiwygAdapter = wysiwygSetup.wysiwygInstance;

      if (this.config.adapter_config.mode === "inline") {
        this.wysiwygAdapter.eventBus.attachEventHandler(_events.afterFocus, this.onFocus.bind(this));
        this.wysiwygAdapter.eventBus.attachEventHandler(_events.afterBlur, this.onBlur.bind(this));
      } // Update content in our data store after our stage preview wysiwyg gets updated


      this.wysiwygAdapter.eventBus.attachEventHandler(_events.afterChangeContent, this.onChangeContent.bind(this)); // Update content in our stage preview wysiwyg after its slideout counterpart gets updated

      _events2.on("form:" + this.contentTypeId + ":saveAfter", this.setContentFromDataStoreToWysiwyg.bind(this));

      _events2.on("stage:" + this.stageId + ":fullScreenModeChangeAfter", this.toggleFullScreen.bind(this));
    }
    /**
     * Hide TinyMce inline toolbar options after fullscreen exit
     */


    var _proto = Wysiwyg.prototype;

    _proto.toggleFullScreen = function toggleFullScreen() {
      var _this = this;

      var $editor = (0, _jquery)("#" + this.elementId); // wait for fullscreen to close

      _underscore.defer(function () {
        if (!(0, _checkStageFullScreen)(_this.stageId) && _this.config.adapter_config.mode === "inline" && $editor.hasClass("mce-edit-focus")) {
          $editor.removeClass("mce-edit-focus");

          _this.onBlur();
        }
      });
    }
    /**
     * @returns {WysiwygInstanceInterface}
     */
    ;

    _proto.getAdapter = function getAdapter() {
      return this.wysiwygAdapter;
    }
    /**
     * Called for the onFocus event
     */
    ;

    _proto.onFocus = function onFocus() {
      var _this2 = this;

      this.getFixedToolbarContainer().addClass("pagebuilder-toolbar-active");

      _events2.trigger("stage:interactionStart");

      var element = document.querySelector("#" + this.elementId);

      if (!element) {
        return;
      } // Wait for everything else to finish


      _underscore.defer(function () {
        return (0, _delayUntil)(function () {
          var $inlineToolbar = _this2.getFixedToolbarContainer().find(".tox-tinymce-inline");

          var self = _this2;
          $inlineToolbar.css("min-width", _this2.config.adapter_config.minToolbarWidth + "px");

          _this2.invertInlineEditorToAccommodateOffscreenToolbar(); // Update toolbar when the height changes


          _this2.toolbarHeight = $inlineToolbar.height();

          if ($inlineToolbar.length) {
            _this2.resizeObserver = new ResizeObserver(function (entries) {
              for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done;) {
                var entry = _step.value;

                if (entry.target === $inlineToolbar.get(0) && entry.target.clientHeight !== self.toolbarHeight) {
                  self.invertInlineEditorToAccommodateOffscreenToolbar();
                  self.toolbarHeight = entry.target.clientHeight;
                }
              }
            });

            _this2.resizeObserver.observe($inlineToolbar.get(0));
          }

          var dialogContainer = document.querySelector("#" + _this2.elementId + " ~ .tox-tinymce-aux");

          if (!!dialogContainer) {
            dialogContainer.setAttribute("data-editor-aux", _this2.elementId);
            document.body.appendChild(dialogContainer);
          }
        }, function () {
          return element.classList.contains("mce-edit-focus");
        }, 10);
      });
    }
    /**
     * Called for the onChangeContent event
     */
    ;

    _proto.onChangeContent = function onChangeContent() {
      this.saveContentDebounce();
      this.invertInlineEditorToAccommodateOffscreenToolbar();
    }
    /**
     * Called for the onBlur events
     */
    ;

    _proto.onBlur = function onBlur() {
      this.getFixedToolbarContainer().removeClass("pagebuilder-toolbar-active").find(".tox-tinymce-inline").css("top", "");

      if (this.resizeObserver) {
        this.resizeObserver.unobserve(this.getFixedToolbarContainer().find(".tox-tinymce-inline").get(0));
      }

      this.toolbarHeight = 0;
      var dialogContainer = document.querySelector("[data-editor-aux=" + this.elementId + "]");

      if (!!dialogContainer) {
        dialogContainer.removeAttribute("data-editor-aux");
        document.querySelector("#" + this.elementId).parentNode.appendChild(dialogContainer);
      }

      _events2.trigger("stage:interactionStop");
    }
    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */
    ;

    _proto.saveContentFromWysiwygToDataStore = function saveContentFromWysiwygToDataStore() {
      this.dataStore.set(this.fieldName, this.getAdapter().getContent());
    }
    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */
    ;

    _proto.setContentFromDataStoreToWysiwyg = function setContentFromDataStoreToWysiwyg() {
      this.getAdapter().setContent(this.dataStore.get(this.fieldName));
    }
    /**
     * Adjust padding on stage if in fullscreen mode to accommodate inline wysiwyg toolbar overflowing fixed viewport
     */
    ;

    _proto.invertInlineEditorToAccommodateOffscreenToolbar = function invertInlineEditorToAccommodateOffscreenToolbar() {
      if (this.config.adapter_config.mode !== "inline") {
        return;
      }

      var $inlineToolbar = this.getFixedToolbarContainer().find(".tox-tinymce-inline");

      if (!$inlineToolbar.length) {
        return;
      }

      var inlineWysiwygClientRectTop = this.getFixedToolbarContainer().get(0).getBoundingClientRect().top - (0, _pagebuilderHeaderHeight)(this.stageId);

      if (!(0, _checkStageFullScreen)(this.stageId) || $inlineToolbar.height() < inlineWysiwygClientRectTop) {
        var extraHeight = 0;

        if ($inlineToolbar.parents(".pagebuilder-slide[data-appearance='collage-left']").length || $inlineToolbar.parents(".pagebuilder-slide[data-appearance='collage-right']").length || $inlineToolbar.parents(".pagebuilder-slide[data-appearance='collage-centered']").length) {
          extraHeight = 29;
        }

        $inlineToolbar.css("top", ($inlineToolbar.height() - extraHeight) * -1);
        return;
      }

      $inlineToolbar.css("top", "");
    }
    /**
     * Get fixed toolbar container element referenced as selector in wysiwyg adapter settings
     *
     * @returns {jQuery}
     */
    ;

    _proto.getFixedToolbarContainer = function getFixedToolbarContainer() {
      return (0, _jquery)("#" + this.elementId).closest("" + this.config.adapter.settings.fixed_toolbar_container);
    };

    return Wysiwyg;
  }();

  return Wysiwyg;
});
//# sourceMappingURL=tinymce.js.map