/*eslint-disable */
define(["jquery", "knockout", "uiEvents", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/panel/registry", "Magento_PageBuilder/js/interactions/drop-indicators", "Magento_PageBuilder/js/interactions/matrix", "Magento_PageBuilder/js/interactions/move-content-type"], function (_jquery, _knockout, _uiEvents, _contentTypeFactory, _registry, _dropIndicators, _matrix, _moveContentType) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Return the sortable options for an instance which requires sorting / dropping functionality
   *
   * @param {Preview} preview
   * @returns {JQueryUI.SortableOptions | any}
   */
  function getSortableOptions(preview) {
    return {
      cursor: "-webkit-grabbing",
      tolerance: "pointer",
      helper: function helper(event, item) {
        var helper = (0, _jquery)(item).clone();
        helper.css({
          pointerEvents: "none"
        });
        return helper[0];
      },
      appendTo: document.body,
      containment: "document",
      placeholder: {
        element: function element() {
          return (0, _jquery)("<div />").addClass("pagebuilder-sortable-placeholder")[0];
        },
        update: function update() {
          return;
        }
      },
      handle: ".move-structural",
      items: "> .pagebuilder-content-type-wrapper",
      start: function start() {
        onSortStart.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      },
      sort: function sort() {
        onSort.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      },
      receive: function receive() {
        onSortReceive.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      },
      update: function update() {
        onSortUpdate.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      },
      stop: function stop() {
        onSortStop.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      }
    };
  }
  /**
   * Get the stage ID from the preview
   *
   * @param {Preview | Stage} preview
   * @returns {string}
   */


  function getPreviewStageIdProxy(preview) {
    if (preview.config.name === "stage") {
      return preview.id;
    }

    return preview.parent.stageId;
  }
  /**
   * Retrieve the parent from the preview
   *
   * @param {Preview | Stage} preview
   * @returns {any}
   */


  function getPreviewParentProxy(preview) {
    if (preview.config.name === "stage") {
      // @todo our usage of types for Stage are wrong, this requires refactoring outside of the scope of this story
      return preview;
    }

    return preview.parent;
  }

  var sortedContentType;
  /**
   * On sort start record the item being sorted
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */

  function onSortStart(preview, event, ui) {
    // Verify we're sorting an already created item
    if (ui.item.hasClass("pagebuilder-content-type-wrapper")) {
      var contentTypeInstance = _knockout.dataFor(ui.item[0]);

      if (contentTypeInstance) {
        // Ensure the original item is displayed but with reduced opacity
        ui.item.show().addClass("pagebuilder-sorting-original");
        sortedContentType = contentTypeInstance;
        (0, _dropIndicators.showDropIndicators)(contentTypeInstance.config.name); // Dynamically change the connect with option to restrict content types

        (0, _jquery)(this).sortable("option", "connectWith", (0, _matrix.getAllowedContainersClasses)(contentTypeInstance.config.name));
        (0, _jquery)(this).sortable("refresh");
      }
    }
  }
  /**
   * On a sort action hide the placeholder if disabled
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */


  function onSort(preview, event, ui) {
    if ((0, _jquery)(this).sortable("option", "disabled")) {
      ui.placeholder.hide();
    } else {
      ui.placeholder.show();
    }
  }
  /**
   * On sort stop hide any indicators
   */


  function onSortStop(preview, event, ui) {
    sortedContentType = null;
    ui.item.removeClass("pagebuilder-sorting-original");
    (0, _dropIndicators.hideDropIndicators)();
    (0, _registry.setDraggedBlockConfig)(null);
  }
  /**
   * Handle receiving a block from the left panel
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */


  function onSortReceive(preview, event, ui) {
    if ((0, _jquery)(event.target)[0] !== this) {
      return;
    } // If the sortable instance is disabled don't complete this operation


    if ((0, _jquery)(this).sortable("option", "disabled")) {
      return;
    } // If the parent can't receive drops we need to cancel the operation


    if (!preview.canReceiveDrops()) {
      (0, _jquery)(this).sortable("cancel");
      return;
    }

    var blockConfig = (0, _registry.getDraggedBlockConfig)();

    if (blockConfig) {
      // jQuery's index method doesn't work correctly here, so use Array.findIndex instead
      var index = (0, _jquery)(event.target).children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-block").toArray().findIndex(function (element) {
        return element.classList.contains("pagebuilder-draggable-block");
      }); // Create the new content type and insert it into the parent

      (0, _contentTypeFactory)(blockConfig, getPreviewParentProxy(preview), getPreviewStageIdProxy(preview)).then(function (block) {
        getPreviewParentProxy(preview).addChild(block, index);

        _uiEvents.trigger("block:dropped:create", {
          id: block.id,
          block: block
        });

        _uiEvents.trigger(blockConfig.name + ":block:dropped:create", {
          id: block.id,
          block: block
        });

        return block;
      }); // Remove the DOM element, as this is a drop event we can't just remove the ui.item

      (0, _jquery)(event.target).find(".pagebuilder-draggable-block").remove();
    }
  }
  /**
   * On sort update handle sorting the underlying children knockout list
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */


  function onSortUpdate(preview, event, ui) {
    // If the sortable instance is disabled don't complete this operation
    if ((0, _jquery)(this).sortable("option", "disabled")) {
      ui.item.remove();
      return;
    }

    if (sortedContentType && this === ui.item.parent()[0]) {
      var el = ui.item[0];

      var contentTypeInstance = _knockout.dataFor(el);

      var target = _knockout.dataFor(ui.item.parents(".content-type-container")[0]);

      if (target && contentTypeInstance) {
        // Calculate the source and target index
        var sourceParent = contentTypeInstance.parent;
        var targetParent = target.parent;
        var targetIndex = (0, _jquery)(event.target).children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-block").toArray().findIndex(function (element) {
          return element === el;
        });

        if (sourceParent) {
          (0, _jquery)(sourceParent === targetParent ? this : ui.sender || this).sortable("cancel");
        } else {
          (0, _jquery)(el).remove();
        }

        (0, _moveContentType.moveContentType)(contentTypeInstance, targetIndex, targetParent);

        if (contentTypeInstance.parent !== targetParent) {
          ui.item.remove();
        }
      }
    }
  }

  return {
    getSortableOptions: getSortableOptions
  };
});
//# sourceMappingURL=sortable.js.map
