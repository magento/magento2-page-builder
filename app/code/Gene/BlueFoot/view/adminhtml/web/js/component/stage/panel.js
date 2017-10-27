define(["uiComponent", "underscore", "knockout", "../config", "./panel/group", "./panel/group/block", "./previews", "ko-draggable", "ko-sortable"], function (_uiComponent, _underscore, _knockout, _config, _group, _block, _previews, _koDraggable, _koSortable) {
  /**
   * Panel Component
   *
   * @author Dave Macaulay <hello@davemacalay.com>
   */
  var Panel = _uiComponent.extend({
    componentTemplate: 'Gene_BlueFoot/component/stage/panel.html',
    stage: null,
    searchValue: _knockout.observable(''),
    searching: _knockout.observable(false),
    searchResults: _knockout.observableArray([]),
    groups: _knockout.observableArray([]),
    originalScrollTop: 0,
    defaults: {
      isVisible: false,
      isCollapsed: false,
      groups: [],
      searchValue: '',
      searching: false,
      searchResults: [],
      stage: false,
      originalScrollTop: false
    },
    isVisible: null,
    isCollapsed: null,
    initialize: function initialize() {
      this._super();

      (0, _previews.load)();
    },
    bindStage: function bindStage(stage) {
      var _this = this;

      this.stage = stage;
      stage.on('stageReady', function () {
        _this.populateContentBlocks();

        _this.isVisible(true);
      });
    },
    getTemplate: function getTemplate() {
      return this.componentTemplate;
    },
    initObservable: function initObservable() {
      this._super().observe('isVisible isCollapsed groups searchValue searching searchResults');

      return this;
    },
    search: function search(self, event) {
      this.searchValue(event.currentTarget.value.toLowerCase());

      if (this.searchValue() === '') {
        this.searching(false);
      } else {
        this.searching(true);
        this.searchResults(_underscore.map(_underscore.filter(_config.getInitConfig('contentTypes'), function (contentBlock) {
          var regEx = new RegExp('\\b' + self.searchValue(), 'gi');
          var matches = contentBlock.label.toLowerCase().match(regEx) ? true : false;
          return matches && contentBlock.visible === true;
        }), function (contentBlock, identifier) {
          // Create a new instance of GroupBlock for each result
          return new _block.Block(identifier, contentBlock);
        }));
      }
    },
    populateContentBlocks: function populateContentBlocks() {
      var _this2 = this;

      var groups = _config.getInitConfig('groups'),
          contentBlocks = _config.getInitConfig('contentTypes'); // Verify the configuration contains the required information


      if (groups && contentBlocks) {
        // Iterate through the groups creating new instances with their associated content blocks
        _underscore.each(groups, function (group, id) {
          // Push the group instance into the observable array to update the UI
          _this2.groups.push(new _group.Group(id, group, _underscore.map(_underscore.where(contentBlocks, {
            group: id,
            visible: true
          }),
          /* Retrieve content blocks with group id */
          function (contentBlock, identifier) {
            return new _block.Block(identifier, contentBlock);
          })));
        }); // Display the panel


        this.isVisible(true); // Open first group

        var hasGroups = 0 in this.groups();

        if (hasGroups) {
          this.groups()[0].active(true);
        }
      } else {
        console.warn('Configuration is not properly initialized, please check the Ajax response.');
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
      this.searchValue('');
      this.searching(false);
    }
  });

  return Panel;
});
//# sourceMappingURL=panel.js.map
