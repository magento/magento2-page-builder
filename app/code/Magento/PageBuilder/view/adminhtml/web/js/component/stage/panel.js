/*eslint-disable */
define(["knockout", "ko-draggable", "ko-sortable", "uiComponent", "underscore", "../config", "../event-bus", "./panel/group", "./panel/group/block", "./previews"], function (_knockout, _koDraggable, _koSortable, _uiComponent, _underscore, _config, _eventBus, _group, _block, _previews) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Panel = _uiComponent.extend({
    componentTemplate: "Magento_PageBuilder/component/stage/panel.html",
    defaults: {
      groups: [],
      isCollapsed: false,
      isVisible: false,
      originalScrollTop: false,
      searchResults: [],
      searchValue: "",
      searching: false,
      stage: false
    },
    groups: _knockout.observableArray([]),
    isCollapsed: null,
    isVisible: null,
    stage: null,
    searchValue: _knockout.observable(""),
    searching: _knockout.observable(false),
    searchResults: _knockout.observableArray([]),
    originalScrollTop: 0,
    initialize: function initialize() {
      this._super();

      (0, _previews.load)();
    },
    bindStage: function bindStage(stage) {
      var _this = this;

      this.stage = stage;

      _eventBus.on("stage:ready", function (event, params) {
        if (_this.stage.id === params.stage.id) {
          _this.populateContentBlocks();

          _this.isVisible(true);
        }
      });
    },
    getTemplate: function getTemplate() {
      return this.componentTemplate;
    },
    initObservable: function initObservable() {
      this._super().observe("isVisible isCollapsed groups searchValue searching searchResults");

      return this;
    },
    search: function search(self, event) {
      this.searchValue(event.currentTarget.value.toLowerCase());

      if (this.searchValue() === "") {
        this.searching(false);
      } else {
        this.searching(true);
        this.searchResults(_underscore.map(_underscore.filter(_config.getInitConfig("content_types"), function (contentBlock) {
          var regEx = new RegExp("\\b" + self.searchValue(), "gi");
          var matches = !!contentBlock.label.toLowerCase().match(regEx);
          return matches && contentBlock.is_visible === true;
        }), function (contentBlock, identifier) {
          // Create a new instance of GroupBlock for each result
          return new _block.Block(identifier, contentBlock);
        }));
      }
    },
    populateContentBlocks: function populateContentBlocks() {
      var _this2 = this;

      var groups = _config.getInitConfig("groups");

      var contentBlocks = _config.getInitConfig("content_types"); // Verify the configuration contains the required information


      if (groups && contentBlocks) {
        // Iterate through the groups creating new instances with their associated content blocks
        _underscore.each(groups, function (group, id) {
          // Push the group instance into the observable array to update the UI
          _this2.groups.push(new _group.Group(id, group, _underscore.map(_underscore.where(contentBlocks, {
            group: id,
            is_visible: true
          }),
          /* Retrieve content blocks with group id */
          function (contentBlock, identifier) {
            var groupBlock = new _block.Block(identifier, contentBlock);
            return groupBlock;
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
    },
    fullScreen: function fullScreen() {
      var isFullScreen = this.stage.parent.isFullScreen();

      if (!isFullScreen) {
        this.originalScrollTop = jQuery(window).scrollTop();

        _underscore.defer(function () {
          jQuery(window).scrollTop(0);
        });
      }

      this.stage.parent.isFullScreen(!isFullScreen);

      if (isFullScreen) {
        jQuery(window).scrollTop(this.originalScrollTop);
      }
    },
    collapse: function collapse() {
      this.isCollapsed(!this.isCollapsed());
    },
    clearSearch: function clearSearch() {
      this.searchValue("");
      this.searching(false);
    }
  });

  return Panel;
});
//# sourceMappingURL=panel.js.map
