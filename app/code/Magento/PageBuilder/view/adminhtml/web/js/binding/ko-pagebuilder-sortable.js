/*eslint-disable */
define(["jquery", "jquery/ui", "knockout", "Magento_Ui/js/lib/knockout/template/renderer", "uiEvents", "underscore"], function (_jquery, _ui, _knockout, _renderer, _uiEvents, _underscore) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _renderer = _interopRequireDefault(_renderer);
  _uiEvents = _interopRequireDefault(_uiEvents);
  _underscore = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * The sortable binding is an adapter for the jQuery UI Sortable widget.
   * Source: <Magento_Pagebuilder_module_dir>/view/adminhtml/web/js/resource/sortable/ko-pagebuilder-sortable.
   * See on Github.
   * Value type: Object.
   * Configuration for the sortable widget.
   * Aliases: [ko-pagebuilder-sortable]
   * Usage example:
   * <div ko-pagebuilder-sortable="{
   *      sortableClass: 'stage-container',
   *      handle: '.move-structural',
   *      items: '.pagebuilder-row-wrapper',
   *      connectWith: '.pagebuilder-canvas'
   * }"></div>
   */

  /**
   * Retrieve the view model for an element
   *
   * @param {any} ui
   * @returns {Object}
   */
  function getViewModelFromUi(ui) {
    return _knockout.default.dataFor(ui.item[0]) || {};
  } // Listen for the dragged component from the event bus


  var draggedComponent;

  _uiEvents.default.on("drag:start", function (args) {
    draggedComponent = args.component;
  });

  _uiEvents.default.on("drag:stop", function () {
    draggedComponent = false;
  });

  var Sortable = {
    defaults: {
      tolerance: "pointer",
      cursor: "-webkit-grabbing",
      connectWith: ".pagebuilder-sortable",
      helper: function helper(event, element) {
        return element.css("opacity", 0.5);
      },
      appendTo: document.body,
      placeholder: {
        element: function element(clone) {
          if (clone.hasClass("pagebuilder-draggable-block")) {
            return (0, _jquery.default)("<div />").addClass("pagebuilder-draggable-block pagebuilder-placeholder").append(clone.html());
          }

          return (0, _jquery.default)("<div />").addClass("pagebuilder-placeholder-sortable");
        },
        update: function update() {
          return;
        }
      },
      sortableClass: "pagebuilder-sortable"
    },

    /**
     * Init draggable on the elements
     *
     * @param {HTMLElement} element
     * @param {Object} extendedConfig
     */
    init: function init(element, extendedConfig) {
      var config = this._getConfig(extendedConfig); // Init sortable on our element with necessary event handlers


      element.addClass(config.sortableClass).sortable(config).on("sortstart", this.onSortStart).on("sortstop", this.onSortStop).on("sortupdate", this.onSortUpdate).on("sortchange", this.onSortChange).on("sortbeforestop", this.onSortBeforeStop).on("sortreceive", this.onSortReceive);
    },

    /**
     * Return the draggable config
     *
     * @param extendedConfig
     * @returns {Sortable.defaults|{scroll, revert, revertDuration, helper, zIndex}}
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
    },

    /**
     * Handle sort start
     *
     * @param {Event} event
     * @param {any} ui
     */
    onSortStart: function onSortStart(event, ui) {
      var block = getViewModelFromUi(ui); // Store the original parent for use in the update call

      block.originalParent = block.parent || false; // ui.helper.data('sorting') is appended to the helper of sorted items

      if (block && (0, _jquery.default)(ui.helper).data("sorting")) {
        var eventData = {
          block: block,
          event: event,
          helper: ui.helper,
          placeholder: ui.placeholder,
          originalEle: ui.item,
          stageId: block.stageId
        }; // ui.position to ensure we're only reacting to sorting events

        _uiEvents.default.trigger("block:sortStart", eventData);
      }
    },

    /**
     * Handle sort stop
     *
     * @param {Event} event
     * @param {any} ui
     */
    onSortStop: function onSortStop(event, ui) {
      // Always remove the sorting original class from an element
      ui.item.removeClass("pagebuilder-sorting-original");
      var block = getViewModelFromUi(ui); // ui.helper.data('sorting') is appended to the helper of sorted items

      if (block && (0, _jquery.default)(ui.helper).data("sorting")) {
        var eventData = {
          block: block,
          event: event,
          helper: ui.helper,
          placeholder: ui.placeholder,
          originalEle: ui.item,
          stageId: block.stageId
        }; // ui.position to ensure we're only reacting to sorting events

        _uiEvents.default.trigger("block:sortStop", eventData);
      }

      ui.item.css("opacity", 1);
    },

    /**
     * Handle a sort update event, this occurs when a sortable item is sorted
     *
     * @param {Event} event
     * @param {any} ui
     */
    onSortUpdate: function onSortUpdate(event, ui) {
      var blockEl = ui.item;
      var newParentEl = blockEl.parent()[0];
      var newIndex = blockEl.index();

      if (blockEl && newParentEl && newParentEl === this) {
        var block = _knockout.default.dataFor(blockEl[0]);

        var newParent = _knockout.default.dataFor(newParentEl); // @todo to be refactored under MAGETWO-86953


        if ((block.config.name === "column-group" || block.config.name === "column") && (0, _jquery.default)(event.currentTarget).hasClass("column-container")) {
          return;
        }

        var parentContainerName = _knockout.default.dataFor((0, _jquery.default)(event.target)[0]).config.name;

        var allowedParents = getViewModelFromUi(ui).config.allowed_parents;

        if (parentContainerName && Array.isArray(allowedParents)) {
          if (allowedParents.indexOf(parentContainerName) === -1) {
            (0, _jquery.default)(this).sortable("cancel");
            (0, _jquery.default)(ui.item).remove(); // Force refresh of the parent

            var data = getViewModelFromUi(ui).parent.children().slice(0);
            getViewModelFromUi(ui).parent.children([]);
            getViewModelFromUi(ui).parent.children(data);
            return;
          }
        } // Detect if we're sorting items within the stage


        if (typeof newParent.stageId === "function" && newParent.stageId()) {
          newParent = newParent.stage;
        } // Fire our events on the letious parents of the operation


        if (block !== newParent) {
          ui.item.remove();

          if (block.originalParent === newParent) {
            _uiEvents.default.trigger("block:sorted", {
              parent: newParent,
              block: block,
              index: newIndex,
              stageId: block.stageId
            });
          } else {
            block.originalParent.removeChild(block);

            _uiEvents.default.trigger("block:instanceDropped", {
              parent: newParent,
              blockInstance: block,
              index: newIndex,
              stageId: block.stageId
            });
          }

          block.originalParent = false;
          (0, _jquery.default)(this).sortable("refresh");
        }
      }
    },

    /**
     * Hide or show the placeholder based on the elements allowed parents
     *
     * @param {Event} event
     * @param {any} ui
     */
    onSortChange: function onSortChange(event, ui) {
      var parentContainerName = _knockout.default.dataFor((0, _jquery.default)(event.target)[0]).config.name;

      var currentInstance = getViewModelFromUi(ui); // If the registry contains a reference to the drag element view model use that instead

      if (draggedComponent) {
        currentInstance = draggedComponent;
      }

      var allowedParents = currentInstance.config.allowed_parents; // Verify if the currently dragged block is accepted by the hovered parent

      if (parentContainerName && Array.isArray(allowedParents)) {
        if (allowedParents.indexOf(parentContainerName) === -1) {
          ui.placeholder.hide();
        } else {
          ui.placeholder.show();
        }
      }
    },

    /**
     * Handle capturing the dragged item just before the sorting stops
     *
     * @param {Event} event
     * @param {any} ui
     */
    onSortBeforeStop: function onSortBeforeStop(event, ui) {
      this.draggedItem = ui.item;
    },

    /**
     * Handle recieving a block from the panel
     *
     * @param {Event} event
     * @param {any} ui
     */
    onSortReceive: function onSortReceive(event, ui) {
      if ((0, _jquery.default)(event.target)[0] === this) {
        var block = getViewModelFromUi(ui);

        var target = _knockout.default.dataFor((0, _jquery.default)(event.target)[0]); // Don't run sortable when dropping on a placeholder
        // @todo to be refactored under MAGETWO-86953


        if (block.config.name === "column" && (0, _jquery.default)(event.srcElement).parents(".ui-droppable").length > 0) {
          return;
        }

        if (block.droppable) {
          event.stopPropagation(); // Emit the blockDropped event upon the target
          // Detect if the target is the parent UI component, if so swap the target to the stage

          var stageId = typeof target.parent.preview !== "undefined" ? target.parent.stageId : target.id;
          target = typeof target.parent.preview !== "undefined" ? target.parent : target;

          _uiEvents.default.trigger("block:dropped", {
            parent: target,
            stageId: stageId,
            block: block,
            index: this.draggedItem.index()
          });

          this.draggedItem.remove();
        }
      } else if (!ui.helper && ui.item) {
        _underscore.default.defer(function () {
          (0, _jquery.default)(ui.item).remove();
        });
      }
    }
  }; // Create a new sortable Knockout binding

  _knockout.default.bindingHandlers.sortable = {
    /**
     * Init the draggable binding on an element
     *
     * @param {any} element
     * @param {() => any} valueAccessor
     */
    init: function init(element, valueAccessor) {
      // Initialize draggable on all children of the element
      Sortable.init((0, _jquery.default)(element), valueAccessor);
    }
  };

  _renderer.default.addAttribute("sortable", {
    name: "ko-pagebuilder-sortable"
  });
});
//# sourceMappingURL=ko-pagebuilder-sortable.js.map
