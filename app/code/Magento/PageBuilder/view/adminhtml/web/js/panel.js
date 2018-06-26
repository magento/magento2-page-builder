/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "uiEvents", "underscore", "Magento_PageBuilder/js/binding/draggable", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/drag-drop/drop-indicators", "Magento_PageBuilder/js/drag-drop/registry", "Magento_PageBuilder/js/panel/group", "Magento_PageBuilder/js/panel/group/content-type"], function (_jquery, _knockout, _translate, _uiEvents, _underscore, _draggable, _config, _dropIndicators, _registry, _group, _contentType) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Panel =
  /*#__PURE__*/
  function () {
    function Panel(parent) {
      this.groups = _knockout.observableArray([]);
      this.searchResults = _knockout.observableArray([]);
      this.isCollapsed = _knockout.observable(false);
      this.isVisible = _knockout.observable(false);
      this.searching = _knockout.observable(false);
      this.searchValue = _knockout.observable("");
      this.searchPlaceholder = (0, _translate)("Find items");
      this.searchNoResult = (0, _translate)("Nothing found");
      this.fullScreenTitle = (0, _translate)("Full Screen");
      this.searchTitle = (0, _translate)("Clear Search");
      this.parent = void 0;
      this.id = void 0;
      this.template = "Magento_PageBuilder/panel";
      this.parent = parent;
      this.id = this.parent.id;
      this.initListeners();
    }
    /**
     * Init listeners
     */


    var _proto = Panel.prototype;

    _proto.initListeners = function initListeners() {
      var _this = this;

      _uiEvents.on("stage:" + this.id + ":readyAfter", function () {
        _this.populateContentTypes();

        _this.isVisible(true);
      });
    };
    /**
     * Return the template string
     *
     * @returns {string}
     */


    _proto.getTemplate = function getTemplate() {
      return this.template;
    };
    /**
     * Conduct a search on the available content types,
     * and find matches for beginning of words.
     *
     * @param self
     * @param event
     */


    _proto.search = function search(self, event) {
      this.searchValue(event.currentTarget.value.toLowerCase());

      if (this.searchValue() === "") {
        this.searching(false);
      } else {
        this.searching(true);
        this.searchResults(_underscore.map(_underscore.filter(_config.getConfig("content_types"), function (contentType) {
          var regEx = new RegExp("\\b" + self.searchValue(), "gi");
          var matches = !!contentType.label.toLowerCase().match(regEx);
          return matches && contentType.is_visible === true;
        }), function (contentType, identifier) {
          // Create a new instance of GroupContentType for each result
          return new _contentType.ContentType(identifier, contentType);
        }));
      }
    };
    /**
     * Traverse up to the WYSIWYG component and set as full screen
     */


    _proto.fullScreen = function fullScreen() {
      _uiEvents.trigger("stage:" + this.parent.id + ":toggleFullscreen");
    };
    /**
     * Collapse the panel into the side of the UI
     */


    _proto.collapse = function collapse() {
      this.isCollapsed(!this.isCollapsed());
    };
    /**
     * Clear Search Results
     */


    _proto.clearSearch = function clearSearch() {
      this.searchValue("");
      this.searching(false);
    };
    /**
     * Retrieve the draggable options for the panel items
     *
     * @returns {JQueryUI.DraggableOptions}
     */


    _proto.getDraggableOptions = function getDraggableOptions() {
      var self = this;
      return {
        appendTo: "body",
        cursor: "-webkit-grabbing",
        connectToSortable: ".content-type-drop",
        containment: "document",
        helper: function helper() {
          return (0, _jquery)(this).clone().css({
            width: (0, _jquery)(this).width(),
            height: (0, _jquery)(this).height(),
            zIndex: 10001,
            pointerEvents: "none"
          });
        },
        start: function start() {
          var block = _knockout.dataFor(this);

          if (block && block.config) {
            /**
             * Swap all sortable instances to use intersect, as the item from the left panel is a predictable
             * size this yields better results when dragging
             */
            (0, _jquery)(".content-type-container.ui-sortable").each(function () {
              if ((0, _jquery)(this).data("sortable")) {
                (0, _jquery)(this).sortable("option", "tolerance", "intersect");
              }
            });
            (0, _dropIndicators.showDropIndicators)(block.config.name);
            (0, _registry.setDraggedContentTypeConfig)(block.config);

            _uiEvents.trigger("stage:interactionStart", {
              stage: self.parent.stage
            });
          }
        },
        stop: function stop() {
          (0, _jquery)(".content-type-container.ui-sortable").each(function () {
            if ((0, _jquery)(this).data("sortable")) {
              (0, _jquery)(this).sortable("option", "tolerance", "pointer");
            }
          });
          (0, _dropIndicators.hideDropIndicators)();
          (0, _registry.setDraggedContentTypeConfig)(null);

          _uiEvents.trigger("stage:interactionStop", {
            stage: self.parent.stage
          });
        }
      };
    };
    /**
     * Populate the panel with the content types
     */


    _proto.populateContentTypes = function populateContentTypes() {
      var _this2 = this;

      var groups = _config.getConfig("groups");

      var contentTypes = _config.getConfig("content_types"); // Verify the configuration contains the required information


      if (groups && contentTypes) {
        // Iterate through the groups creating new instances with their associated content types
        _underscore.each(groups, function (group, id) {
          // Push the group instance into the observable array to update the UI
          _this2.groups.push(new _group.Group(id, group, _underscore.map(_underscore.where(contentTypes, {
            group: id,
            is_visible: true
          }),
          /* Retrieve content types with group id */
          function (contentType, identifier) {
            var groupContentType = new _contentType.ContentType(identifier, contentType);
            return groupContentType;
          })));
        }); // Display the panel


        this.isVisible(true); // Open first group

        var hasGroups = 0 in this.groups();

        if (hasGroups) {
          this.groups()[0].active(true);
        }
      } else {
        console.warn("Configuration is not properly initialized, please check the Ajax response.");
      }
    };

    return Panel;
  }();

  return Panel;
});
//# sourceMappingURL=panel.js.map
