/*eslint-disable */
define(["jquery", "uiEvents", "Magento_PageBuilder/js/panel/registry"], function (_jquery, _uiEvents, _registry) {
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
    /**
     * @todo resolve issue with stage not conforming to the content type interface. e.g. not having a preview class
     * This corrects the paths to various things we require for the stage.
     */
    if (preview.config.name === "stage") {
      preview.stageId = preview.id;
      preview = {
        canReceiveDrops: preview.canReceiveDrops,
        parent: preview
      };
    }

    return {
      cursor: "-webkit-grabbing",
      helper: function helper(event, item) {
        return (0, _jquery)(item).clone()[0];
      },
      appendTo: document.body,
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

      /**
       * Pass receive event through to handler with additional preview argument
       */
      receive: function receive() {
        onSortReceive.apply(this, [preview].concat(Array.prototype.slice.call(arguments)));
      }
    };
  }
  /**
   * Handle receiving a block from the left panel
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */


  function onSortReceive(preview, event, ui) {
    // If the parent can't receive drops we need to cancel the operation
    if (!preview.canReceiveDrops()) {
      (0, _jquery)(this).sortable("cancel");
      return;
    }

    var blockConfig = (0, _registry.getDraggedBlockConfig)();

    if (blockConfig) {
      // jQuery's index method doesn't work correctly here, so use Array.findIndex instead
      var index = (0, _jquery)(event.target).children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-block").toArray().findIndex(function (element) {
        return element.classList.contains("pagebuilder-draggable-block");
      }); // Fire the event to be handled by the stage

      _uiEvents.trigger("block:dropped", {
        parent: preview.parent,
        stageId: preview.parent.stageId,
        blockConfig: blockConfig,
        index: index
      }); // Remove the DOM element, as this is a drop event we can't just remove the ui.item


      (0, _jquery)(event.target).find(".pagebuilder-draggable-block").remove();
    }
  }

  return {
    getSortableOptions: getSortableOptions
  };
});
//# sourceMappingURL=preview-sortable-options.js.map
