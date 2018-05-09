/*eslint-disable */
define(["jquery", "uiEvents", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/panel/registry", "Magento_PageBuilder/js/utils/create-stylesheet"], function (_jquery, _uiEvents, _underscore, _config, _registry, _createStylesheet) {
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

  var headDropIndicatorStyles;
  /**
   * Show the drop indicators for a specific content type
   *
   * @param {string} contentType
   * @returns {HTMLStyleElement}
   */

  function showDropIndicators(contentType) {
    var acceptedContainers = getContainersFor(contentType);

    if (acceptedContainers.length > 0) {
      var _createStyleSheet;

      var classNames = acceptedContainers.map(function (container) {
        return ".content-type-container." + container + "-container > .pagebuilder-drop-indicator";
      });
      var styles = (0, _createStylesheet.createStyleSheet)((_createStyleSheet = {}, _createStyleSheet[classNames.join(", ")] = {
        opacity: 1,
        visibility: "visible"
      }, _createStyleSheet));
      document.head.appendChild(styles);
      headDropIndicatorStyles = styles;
      return styles;
    }
  }
  /**
   * Hide the drop indicators
   */


  function hideDropIndicators() {
    if (headDropIndicatorStyles) {
      headDropIndicatorStyles.remove();
    }
  }

  var acceptedMatrix = {};
  /**
   * Build a matrix of which containers each content type can go into, these are calculated by the type given to the
   * content type in it's declaration.
   *
   * Types:
   * static - can go into any container (not into restricted containers)
   * container - can contain any static item
   * restricted-static - can only go into containers which declare it <accepts /> them
   * restricted-container - can only contain items which it declares it <accepts />
   */

  function generateContainerAcceptedMatrix() {
    var contentTypes = [// @todo move stage config into XML
    {
      name: "stage",
      type: "restricted-container",
      accepts: ["row"]
    }].concat(_underscore.values(_config.getConfig("content_types"))); // Retrieve all containers

    var containers = contentTypes.filter(function (config) {
      return config.type === "container";
    }).map(function (config) {
      return config.name;
    });
    contentTypes.forEach(function (contentType) {
      // Iterate over restricted containers to calculate their allowed children first
      if (contentType.accepts && contentType.accepts.length > 0) {
        contentType.accepts.forEach(function (accepted) {
          if (!acceptedMatrix[accepted]) {
            acceptedMatrix[accepted] = [];
          }

          acceptedMatrix[accepted].push(contentType.name);
        });
      } // Any static / restricted-container content type can go in all unrestricted containers


      if (contentType.type === "static" || contentType.type === "restricted-container") {
        if (!acceptedMatrix[contentType.name]) {
          acceptedMatrix[contentType.name] = [];
        }

        acceptedMatrix[contentType.name] = acceptedMatrix[contentType.name].concat(containers);
      }
    });
  }
  /**
   * Retrieve the containers a specific content type can be contained in
   *
   * @param {string} contentType
   * @returns {any}
   */


  function getContainersFor(contentType) {
    if (acceptedMatrix[contentType]) {
      return acceptedMatrix[contentType];
    }

    return null;
  }

  return {
    getSortableOptions: getSortableOptions,
    showDropIndicators: showDropIndicators,
    hideDropIndicators: hideDropIndicators,
    generateContainerAcceptedMatrix: generateContainerAcceptedMatrix,
    getContainersFor: getContainersFor
  };
});
//# sourceMappingURL=preview-sortable-options.js.map
