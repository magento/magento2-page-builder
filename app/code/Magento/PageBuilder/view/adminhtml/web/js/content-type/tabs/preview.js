/*eslint-disable */
/* jscs:disable */

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/events", "tabs", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-factory", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/content-type-menu/option", "Magento_PageBuilder/js/utils/delay-until", "Magento_PageBuilder/js/utils/promise-deferred", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _translate, _events, _tabs, _underscore, _config, _contentTypeFactory, _hideShowOption, _option, _delayUntil, _promiseDeferred, _previewCollection) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_previewCollection2) {
    "use strict";

    _inheritsLoose(Preview, _previewCollection2);

    /**
     * @param {ContentTypeCollectionInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(contentType, config, observableUpdater) {
      var _this;

      _this = _previewCollection2.call(this, contentType, config, observableUpdater) || this; // Wait for the tabs instance to mount and the container to be ready

      _this.focusedTab = _knockout.observable(null);
      _this.activeTab = _knockout.observable(0);
      _this.onContainerRenderDeferred = (0, _promiseDeferred)();
      _this.mountAfterDeferred = (0, _promiseDeferred)();
      Promise.all([_this.onContainerRenderDeferred.promise, _this.mountAfterDeferred.promise]).then(function (_ref) {
        var element = _ref[0],
            expectedChildren = _ref[1];
        // We always create 1 tab when dropping tabs into the instance
        expectedChildren = expectedChildren || 1; // Wait until all children's DOM elements are present before building the tabs instance

        (0, _delayUntil)(function () {
          _this.element = element;

          _this.buildTabs();
        }, function () {
          return (0, _jquery)(element).find(".pagebuilder-tab-item").length === expectedChildren;
        });
      }); // Resolve our deferred when the tabs item mounts with expect children

      _events.on("tabs:mountAfter", function (args) {
        if (args.contentType.id === _this.contentType.id && args.expectChildren !== undefined) {
          _this.mountAfterDeferred.resolve(args.expectChildren);
        }
      });

      _events.on("tab-item:mountAfter", function (args) {
        if (_this.element && args.contentType.parentContentType.id === _this.contentType.id) {
          _this.refreshTabs();
        }
      });

      _events.on("tab-item:renderAfter", function (args) {
        if (_this.element && args.contentType.parentContentType.id === _this.contentType.id) {
          _underscore.defer(function () {
            _this.refreshTabs();
          });
        }
      }); // Set the active tab to the new position of the sorted tab


      _events.on("tab-item:removeAfter", function (args) {
        if (args.parentContentType && args.parentContentType.id === _this.contentType.id) {
          _this.refreshTabs(); // We need to wait for the tabs to refresh before executing the focus


          _underscore.defer(function () {
            var newPosition = args.index > 0 ? args.index - 1 : 0;

            _this.setFocusedTab(newPosition, true);
          });
        }
      }); // Refresh tab contents and set the focus to the new position of the sorted tab


      _events.on("childContentType:sortUpdate", function (args) {
        if (args.instance.id === _this.contentType.id) {
          _this.refreshTabs(args.newPosition, true);
          /**
           * Update the default active tab if its position was affected by the sorting
           */


          var defaultActiveTab = +_this.activeTab();
          var newDefaultActiveTab = defaultActiveTab;

          if (args.originalPosition === defaultActiveTab) {
            newDefaultActiveTab = args.newPosition;
          } else if (args.originalPosition < defaultActiveTab && args.newPosition >= defaultActiveTab) {
            // a tab was moved from the left of the default active tab the right of it, changing its index
            newDefaultActiveTab--;
          } else if (args.originalPosition > defaultActiveTab && args.newPosition <= defaultActiveTab) {
            // a tab was moved from the right of the default active tab the left of it, changing its index
            newDefaultActiveTab++;
          }

          _this.updateData("default_active", newDefaultActiveTab.toString());
        }
      }); // Monitor focus tab to start / stop interaction on the stage, debounce to avoid duplicate calls


      _this.focusedTab.subscribe(_underscore.debounce(function (index) {
        if (index !== null) {
          _events.trigger("stage:interactionStart");

          (0, _delayUntil)(function () {
            return (0, _jquery)((0, _jquery)(_this.wrapperElement).find(".tab-header")[index]).find("[contenteditable]").focus();
          }, function () {
            return (0, _jquery)((0, _jquery)(_this.wrapperElement).find(".tab-header")[index]).find("[contenteditable]").length > 0;
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
     * Remove focused tab
     */


    var _proto = Preview.prototype;

    _proto.destroy = function destroy() {
      var _this2 = this;

      _previewCollection2.prototype.destroy.call(this);

      _underscore.defer(function () {
        return _this2.setFocusedTab(null);
      });
    }
    /**
     * Refresh the tabs instance when new content appears
     *
     * @param {number} focusIndex
     * @param {boolean} forceFocus
     * @param {number} activeIndex
     */
    ;

    _proto.refreshTabs = function refreshTabs(focusIndex, forceFocus, activeIndex) {
      try {
        (0, _jquery)(this.element).tabs("refresh");

        if (focusIndex >= 0) {
          this.setFocusedTab(focusIndex, forceFocus);
        } else if (activeIndex) {
          this.setActiveTab(activeIndex);
        } // update sortability of tabs


        var sortableElement = (0, _jquery)(this.element).find(".tabs-navigation");

        if (sortableElement.hasClass("ui-sortable")) {
          if (this.contentType.children().length <= 1) {
            sortableElement.sortable("disable");
          } else {
            sortableElement.sortable("enable");
          }
        }
      } catch (e) {
        this.buildTabs();
      }
    }
    /**
     * Set the active tab, we maintain a reference to it in an observable for when we rebuild the tab instance
     *
     * @param {number} index
     */
    ;

    _proto.setActiveTab = function setActiveTab(index) {
      var _this3 = this;

      if (index !== null) {
        // Added to prevent mismatched fragment error caused by not yet rendered tab-item
        index = parseInt(index.toString(), 10);
        (0, _delayUntil)(function () {
          (0, _jquery)(_this3.element).tabs("option", "active", index);

          _this3.activeTab(index);

          _events.trigger("contentType:redrawAfter", {
            id: _this3.contentType.id,
            contentType: _this3
          });
        }, function () {
          return (0, _jquery)(_this3.element).find(".pagebuilder-tab-item").length >= index + 1;
        });
      }
    }
    /**
     * Set the focused tab
     *
     * @param {number} index
     * @param {boolean} force
     */
    ;

    _proto.setFocusedTab = function setFocusedTab(index, force) {
      if (force === void 0) {
        force = false;
      }

      this.setActiveTab(index);

      if (force) {
        this.focusedTab(null);
      }

      this.focusedTab(index);
    }
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _previewCollection2.prototype.retrieveOptions.call(this);

      options.add = new _option({
        preview: this,
        icon: "<i class='icon-pagebuilder-add'></i>",
        title: (0, _translate)("Add"),
        action: this.addTab,
        classes: ["add-child"],
        sort: 10
      });
      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    }
    /**
     * Add a tab
     */
    ;

    _proto.addTab = function addTab() {
      var _this4 = this;

      (0, _contentTypeFactory)(_config.getContentTypeConfig("tab-item"), this.contentType, this.contentType.stageId).then(function (tab) {
        _events.on("tab-item:mountAfter", function (args) {
          if (args.id === tab.id) {
            _this4.setFocusedTab(_this4.contentType.children().length - 1);

            _events.off("tab-item:" + tab.id + ":mountAfter");
          }
        }, "tab-item:" + tab.id + ":mountAfter");

        _this4.contentType.addChild(tab, _this4.contentType.children().length); // Update the default tab title when adding a new tab


        tab.dataStore.set("tab_name", (0, _translate)("Tab") + " " + (_this4.contentType.children.indexOf(tab) + 1));
      });
    }
    /**
     * On render init the tabs widget
     *
     * @param {Element} element
     */
    ;

    _proto.onContainerRender = function onContainerRender(element) {
      this.element = element;
      this.onContainerRenderDeferred.resolve(element);
    }
    /**
     * Copy over border styles to the tab headers
     *
     * @returns {any}
     */
    ;

    _proto.getTabHeaderStyles = function getTabHeaderStyles() {
      var headerStyles = this.data.headers.style();
      return _extends({}, headerStyles, {
        marginBottom: "-" + headerStyles.borderWidth,
        marginLeft: "-" + headerStyles.borderWidth
      });
    }
    /**
     * Get the sortable options for the tab heading sorting
     *
     * @returns {JQueryUI.SortableOptions}
     */
    ;

    _proto.getSortableOptions = function getSortableOptions() {
      var self = this;
      var borderWidth;
      return {
        handle: ".tab-drag-handle",
        tolerance: "pointer",
        cursor: "grabbing",
        cursorAt: {
          left: 8,
          top: 25
        },

        /**
         * Provide custom helper element
         *
         * @param {Event} event
         * @param {JQueryUI.Sortable} element
         * @returns {Element}
         */
        helper: function helper(event, element) {
          var helper = (0, _jquery)(element).clone().css("opacity", "0.7");
          helper[0].querySelector(".pagebuilder-options").remove();
          return helper[0];
        },

        /**
         * Add a padding to the navigation UL to resolve issues of negative margins when sorting
         *
         * @param {Event} event
         * @param {JQueryUI.SortableUIParams} ui
         */
        start: function start(event, ui) {
          /**
           * Due to the way we use negative margins to overlap the borders we need to apply a padding to the
           * container when we're moving the first item to ensure the tabs remain in the same place.
           */
          if (ui.item.index() === 0) {
            borderWidth = parseInt(ui.item.css("borderWidth"), 10) || 1;
            (0, _jquery)(this).css("paddingLeft", borderWidth);
          }

          ui.helper.css("width", "");

          _events.trigger("stage:interactionStart");

          self.disableInteracting = true;
        },

        /**
         * Remove the padding once the operation is completed
         *
         * @param {Event} event
         * @param {JQueryUI.SortableUIParams} ui
         */
        stop: function stop(event, ui) {
          (0, _jquery)(this).css("paddingLeft", "");

          _events.trigger("stage:interactionStop");

          self.disableInteracting = false;
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
        }
      };
    }
    /**
     * Bind events
     */
    ;

    _proto.bindEvents = function bindEvents() {
      var _this5 = this;

      _previewCollection2.prototype.bindEvents.call(this); // ContentType being mounted onto container


      _events.on("tabs:dropAfter", function (args) {
        if (args.id === _this5.contentType.id && _this5.contentType.children().length === 0) {
          _this5.addTab();
        }
      }); // ContentType being removed from container


      _events.on("tab-item:removeAfter", function (args) {
        if (args.parentContentType && args.parentContentType.id === _this5.contentType.id) {
          // Mark the previous tab as active
          var newIndex = args.index - 1 >= 0 ? args.index - 1 : 0;

          _this5.refreshTabs(newIndex, true);
        }
      }); // Capture when a content type is duplicated within the container


      var duplicatedTab;
      var duplicatedTabIndex;

      _events.on("tab-item:duplicateAfter", function (args) {
        if (_this5.contentType.id === args.duplicateContentType.parentContentType.id && args.direct) {
          var tabData = args.duplicateContentType.dataStore.getState();
          args.duplicateContentType.dataStore.set("tab_name", tabData.tab_name.toString() + " copy");
          duplicatedTab = args.duplicateContentType;
          duplicatedTabIndex = args.index;
        }
      });

      _events.on("tab-item:mountAfter", function (args) {
        if (duplicatedTab && args.id === duplicatedTab.id) {
          _this5.refreshTabs(duplicatedTabIndex, true);

          duplicatedTab = duplicatedTabIndex = null;
        }

        if (_this5.contentType.id === args.contentType.parentContentType.id) {
          _this5.updateTabNamesInDataStore();

          args.contentType.dataStore.subscribe(function () {
            _this5.updateTabNamesInDataStore();
          });
        }
      });

      this.contentType.dataStore.subscribe(function (data) {
        _this5.activeTab(data.default_active);
      });
    }
    /**
     * Update data store with active options
     */
    ;

    _proto.updateTabNamesInDataStore = function updateTabNamesInDataStore() {
      var activeOptions = [];
      this.contentType.children().forEach(function (tab, index) {
        var tabData = tab.dataStore.getState();
        activeOptions.push({
          label: tabData.tab_name.toString(),
          labeltitle: tabData.tab_name.toString(),
          value: index
        });
      });
      this.contentType.dataStore.set("_default_active_options", activeOptions);
    }
    /**
     * Assign a debounce and delay to the init of tabs to ensure the DOM has updated
     *
     * @type {(() => void) & _.Cancelable}
     */
    ;

    _proto.buildTabs = function buildTabs(activeTabIndex) {
      var _this6 = this;

      if (activeTabIndex === void 0) {
        activeTabIndex = this.activeTab() || 0;
      }

      this.ready = false;

      if (this.element && this.element.children.length > 0) {
        var focusedTab = this.focusedTab();

        try {
          (0, _jquery)(this.element).tabs("destroy");
        } catch (e) {// We aren't concerned if this fails, tabs throws an Exception when we cannot destroy
        }

        (0, _jquery)(this.element).tabs({
          create: function create() {
            _this6.ready = true; // Ensure focus tab is restored after a rebuild cycle

            if (focusedTab !== null) {
              _this6.setFocusedTab(focusedTab, true);
            } else {
              _this6.setFocusedTab(null);

              if (activeTabIndex) {
                _this6.setActiveTab(activeTabIndex);
              }
            }
          },

          /**
           * Trigger redraw event since new content is being displayed
           */
          activate: function activate() {
            _events.trigger("contentType:redrawAfter", {
              element: _this6.element
            });
          }
        });
      }
    };

    return Preview;
  }(_previewCollection); // Resolve issue with jQuery UI tabs content typing events on content editable areas


  var originalTabKeyDown = _jquery.ui.tabs.prototype._tabKeydown;

  _jquery.ui.tabs.prototype._tabKeydown = function (event) {
    // If the target is content editable don't handle any events
    if ((0, _jquery)(event.target).attr("contenteditable")) {
      return;
    }

    originalTabKeyDown.call(this, event);
  };

  return Preview;
});
//# sourceMappingURL=preview.js.map