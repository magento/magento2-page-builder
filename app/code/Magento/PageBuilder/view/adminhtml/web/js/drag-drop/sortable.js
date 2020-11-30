/*eslint-disable */
/* jscs:disable */
define(["jquery", "knockout", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/drag-drop/drop-indicators", "Magento_PageBuilder/js/drag-drop/matrix", "Magento_PageBuilder/js/drag-drop/move-content-type", "Magento_PageBuilder/js/drag-drop/registry"], function (_jquery, _knockout, _events, _contentTypeFactory, _dropIndicators, _matrix, _moveContentType, _registry) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * The class used when hiding a content type
   * @type {string}
   */
  var hiddenClass = ".pagebuilder-content-type-hidden";
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
    return preview.contentType.stageId;
  }
  /**
   * Retrieve the contentType from the preview
   *
   * @param {Preview | Stage} instance
   * @returns {any}
   */


  function getcontentTypeProxy(instance) {
    return instance.contentType;
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
      _events.trigger("stage:interactionStart");

      var contentTypeInstance = _knockout.dataFor(ui.item[0]);

      if (contentTypeInstance) {
        // Ensure the original item is displayed but with reduced opacity
        ui.item.css("display", "block").addClass("pagebuilder-sorting-original");
        (0, _jquery)(".pagebuilder-drop-indicator.hidden-drop-indicator").css("display", "block").removeClass("hidden-drop-indicator"); // If we're the first item in the container we need to hide the first drop indicator

        if (contentTypeInstance.parentContentType.getChildren().indexOf(contentTypeInstance) === 0) {
          ui.item.prev(".pagebuilder-drop-indicator").css("display", "none").addClass("hidden-drop-indicator");
        }

        (0, _dropIndicators.showDropIndicators)(contentTypeInstance.config.name, preview.contentType.stageId);
        sortedContentType = contentTypeInstance; // Dynamically change the connect with option to restrict content types

        (0, _jquery)(this).sortable("option", "connectWith", (0, _matrix.getAllowedContainersClasses)(contentTypeInstance.config.name, preview.contentType.stageId));
        (0, _jquery)(this).sortable("refresh");
      }
    }
  }

  var placeholderContainer;
  /**
   * On a sort action hide the placeholder if disabled
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */

  function onSort(preview, event, ui) {
    if ((0, _jquery)(this).sortable("option", "disabled") || ui.placeholder.parents(hiddenClass).length > 0) {
      ui.placeholder.css("display", "none");
    } else {
      ui.placeholder.css("display", "block");
    }
    /**
     * We record the position of the placeholder on sort so we can ensure we place the content type in the correct place
     * as jQuery UI's events aren't reliable.
     */


    placeholderContainer = ui.placeholder.parents(".content-type-container")[0];
  }
  /**
   * On sort stop hide any indicators
   */


  function onSortStop(preview, event, ui) {
    ui.item.removeClass("pagebuilder-sorting-original");
    (0, _dropIndicators.hideDropIndicators)();
    (0, _registry.setDraggedContentTypeConfig)(null); // Only trigger stop if we triggered start

    if (ui.item.hasClass("pagebuilder-content-type-wrapper")) {
      _events.trigger("stage:interactionStop");
    }

    if (ui.item && !sortedContentType) {
      ui.item.remove();
    }

    sortedContentType = null;
  }
  /**
   * Handle receiving a content type from the left panel
   *
   * @param {Preview} preview
   * @param {Event} event
   * @param {JQueryUI.SortableUIParams} ui
   */


  function onSortReceive(preview, event, ui) {
    var contentTypeConfig = (0, _registry.getDraggedContentTypeConfig)();
    (0, _registry.setDraggedContentTypeConfig)(null);

    if ((0, _jquery)(event.target)[0] !== this) {
      return;
    } // If the container content type can't receive drops we need to cancel the operation


    if (!preview.isContainer()) {
      (0, _jquery)(this).sortable("cancel");
      return;
    }

    if (contentTypeConfig) {
      // If the sortable instance is disabled don't complete this operation
      if ((0, _jquery)(this).sortable("option", "disabled") || (0, _jquery)(this).parents(hiddenClass).length > 0) {
        return;
      } // jQuery's index method doesn't work correctly here, so use Array.findIndex instead


      var index = (0, _jquery)(event.target).children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-content-type").toArray().findIndex(function (element) {
        return element.classList.contains("pagebuilder-draggable-content-type");
      }); // Create the new content type and insert it into the parent

      (0, _contentTypeFactory)(contentTypeConfig, getcontentTypeProxy(preview), getPreviewStageIdProxy(preview)).then(function (contentType) {
        // Set the content type instance as "dropped", as it was dropped from the left panel
        contentType.dropped = true;
        getcontentTypeProxy(preview).addChild(contentType, index);

        _events.trigger("contentType:dropAfter", {
          id: contentType.id,
          contentType: contentType
        });

        _events.trigger(contentTypeConfig.name + ":dropAfter", {
          id: contentType.id,
          contentType: contentType
        });

        return contentType;
      }); // Remove the DOM element, as this is a drop event we can't just remove the ui.item

      (0, _jquery)(event.target).find(".pagebuilder-draggable-content-type").remove();
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
    if ((0, _jquery)(this).hasClass("ui-sortable") && (0, _jquery)(this).sortable("option", "disabled") || ui.item.parents(hiddenClass).length > 0) {
      ui.item.remove();
      (0, _jquery)(this).sortable("cancel"); // jQuery tries to reset the state but kills KO's bindings, so we'll force a re-render on the content type

      if (ui.item.length > 0 && typeof _knockout.dataFor(ui.item[0]) !== "undefined") {
        var data = _knockout.dataFor(ui.item[0]);

        var contentType = data.contentType && data.contentType.getChildren ? data.contentType : data.parentContentType;
        var children = contentType.getChildren()().splice(0);
        contentType.getChildren()([]);
        contentType.getChildren()(children);
      }

      return;
    }
    /**
     * Validate the event is coming from the exact instance or a child instance, we validate on the child instance
     * as the event is sometimes annoyingly caught by the parent rather than the child it's dropped into. Combining this
     * with placeholderContainer logic we can ensure we always do the right operation.
     */


    if (sortedContentType && (this === ui.item.parent()[0] || placeholderContainer && (0, _jquery)(this).find(ui.item.parent()).length > 0)) {
      var el = ui.item[0];

      var contentTypeInstance = _knockout.dataFor(el);

      var target = _knockout.dataFor(placeholderContainer);

      if (target && contentTypeInstance) {
        // Calculate the source and target index
        var sourceParent = contentTypeInstance.parentContentType;
        var targetParent = getcontentTypeProxy(target);
        var targetIndex = (0, _jquery)(placeholderContainer).children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-content-type").toArray().findIndex(function (element) {
          return element === el;
        });

        if (sourceParent) {
          (0, _jquery)(sourceParent === targetParent ? this : ui.sender || this).sortable("cancel");
        } else {
          (0, _jquery)(el).remove();
        }

        (0, _moveContentType.moveContentType)(contentTypeInstance, targetIndex, targetParent);

        if (contentTypeInstance.parentContentType !== targetParent) {
          ui.item.remove();
        }
      }
    }
  }

  return {
    getSortableOptions: getSortableOptions,
    hiddenClass: hiddenClass
  };
});
//# sourceMappingURL=sortable.js.map