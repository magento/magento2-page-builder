/*eslint-disable */
define(["jquery", "jquery/ui", "knockout", "Magento_Ui/js/lib/knockout/template/renderer", "uiEvents"], function (_jquery, _ui, _knockout, _renderer, _uiEvents) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _renderer = _interopRequireDefault(_renderer);
  _uiEvents = _interopRequireDefault(_uiEvents);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * The draggable binding is an adapter for the jQuery UI draggable widget.
   * Source: <Magento_Pagebuilder_module_dir>/view/adminhtml/web/js/resource/sortable/ko-pagebuilder-draggable.
   * See on Github.
   * Value type: Object.
   * Configuration for the draggable widget.
   * Aliases: [ko-pagebuilder-draggable]
   * Usage example:
   * <div ko-pagebuilder-draggable="{ connectToSortable: getDraggableConfig() }"></div>
   */

  /**
   * Retrieve the view model for an element
   *
   * @param {Event} event
   * @returns {Object}
   */
  function getViewModelFromEvent(event) {
    return _knockout.default.dataFor((0, _jquery.default)(event.target)[0]) || {};
  }

  var Draggable = {
    defaults: {
      scroll: true,
      revert: true,
      revertDuration: 0,
      zIndex: 500,
      containment: "body",
      connectToSortable: ".pagebuilder-sortable",
      appendTo: document.body,
      helper: function helper(event) {
        var clone = (0, _jquery.default)(event.currentTarget).clone();
        clone.css("pointerEvents", "none");
        return clone;
      }
    },

    /**
     * Init draggable on the elements
     *
     * @param {HTMLElement} elements
     * @param {Object} extendedConfig
     * @returns {HTMLElement}
     */
    init: function init(elements, extendedConfig) {
      return (0, _jquery.default)(elements).draggable(this._getConfig(extendedConfig)).on("dragstart", function (event, ui) {
        // Ensure the dimensions are retained on the element
        ui.helper.css({
          width: ui.helper.width(),
          height: ui.helper.height()
        });

        _uiEvents.default.trigger("drag:start", {
          event: event,
          ui: ui,
          component: getViewModelFromEvent(event)
        });

        _uiEvents.default.trigger("interaction:start", {
          stage: getViewModelFromEvent(event).stage
        });
      }).on("dragstop", function (event, ui) {
        _uiEvents.default.trigger("drag:stop", {
          event: event,
          ui: ui,
          component: getViewModelFromEvent(event)
        });

        _uiEvents.default.trigger("interaction:stop", {
          stage: getViewModelFromEvent(event).stage
        });
      });
    },

    /**
     * Return the draggable config
     *
     * @param {Object} extendedConfig
     * @returns {Draggable.defaults|{scroll, revert, revertDuration, helper, zIndex}}
     * @private
     */
    _getConfig: function _getConfig(extendedConfig) {
      var config = this.defaults; // Extend the config with any custom configuration

      if (extendedConfig) {
        if (typeof extendedConfig === "function") {
          extendedConfig = extendedConfig();
        }

        config = _knockout.default.utils.extend(config, extendedConfig);
      }

      return config;
    }
  }; // Create a new draggable Knockout binding

  _knockout.default.bindingHandlers.draggable = {
    /**
     * Init the draggable binding on an element
     *
     * @param {any} element
     * @param {() => any} valueAccessor
     * @param {KnockoutAllBindingsAccessor} allBindingsAccessor
     */
    init: function init(element, valueAccessor, allBindingsAccessor) {
      // Initialize draggable on all children of the element
      Draggable.init((0, _jquery.default)(element), valueAccessor); // Does the element contain a foreach element that could change overtime?

      if (allBindingsAccessor().foreach) {
        allBindingsAccessor().foreach.subscribe(function () {
          Draggable.init((0, _jquery.default)(element).children(), valueAccessor);
        });
      }
    }
  };

  _renderer.default.addAttribute("draggable", {
    name: "ko-pagebuilder-draggable"
  });
});
//# sourceMappingURL=ko-pagebuilder-draggable.js.map
