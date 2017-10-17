define(['uiComponent', 'underscore', 'knockout', '../config', './panel/group', './panel/group/block', './previews', 'ko-draggable', 'ko-sortable'], function (_uiComponent, _underscore, _knockout, _config, _group, _block, _previews) {
    'use strict';

    var _uiComponent2 = _interopRequireDefault(_uiComponent);

    var _underscore2 = _interopRequireDefault(_underscore);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _config2 = _interopRequireDefault(_config);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    return _uiComponent.extend({
        componentTemplate: 'Gene_BlueFoot/component/stage/panel.html',
        searchValue: _knockout2.default.observable(''),
        searching: _knockout2.default.observable(false),
        searchResults: _knockout2.default.observableArray([]),
        groups: _knockout2.default.observableArray([]),
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
        initialize: function () {
            this._super();

            (0, _previews.load)();
        },
        bindStage: function (stage) {
            var _this = this;

            this.stage = stage;
            stage.on('stageReady', function () {
                _this.populateContentBlocks();
                _this.isVisible(true);
            });
        },
        getTemplate: function () {
            return this.componentTemplate;
        },
        initObservable: function () {
            this._super().observe('isVisible isCollapsed groups searchValue searching searchResults');
            return this;
        },
        search: function (self, event) {
            this.searchValue(event.currentTarget.value.toLowerCase());
            if (this.searchValue() === '') {
                this.searching(false);
            } else {
                this.searching(true);
                this.searchResults(_underscore2.default.map(_underscore2.default.filter(_config2.default.getInitConfig('contentBlocks'), function (contentBlock) {
                    var regEx = new RegExp('\\b' + self.searchValue(), 'gi');
                    var matches = contentBlock.name.toLowerCase().match(regEx) ? true : false;
                    return matches && contentBlock.visible === true;
                }), function (contentBlock) {
                    // Create a new instance of GroupBlock for each result
                    return new _block.Block(contentBlock);
                }));
            }
        },
        populateContentBlocks: function () {
            var _this2 = this;

            var groups = _config2.default.getInitConfig('groups'),
                contentBlocks = _config2.default.getInitConfig('contentBlocks');
            // Verify the configuration contains the required information
            if (groups && contentBlocks) {
                // Iterate through the groups creating new instances with their associated content blocks
                _underscore2.default.each(groups, function (group, id) {
                    // Push the group instance into the observable array to update the UI
                    _this2.groups.push(new _group.Group(id, group, _underscore2.default.map(_underscore2.default.where(contentBlocks, {
                        group: id,
                        visible: true
                    }), /* Retrieve content blocks with group id */function (contentBlock) {
                        return new _block.Block(contentBlock);
                    })));
                });
                // Display the panel
                this.isVisible(true);
                // Open first group
                var hasGroups = 0 in this.groups();
                if (hasGroups) {
                    this.groups()[0].active(true);
                }
            } else {
                console.warn('Configuration is not properly initialized, please check the Ajax response.');
            }
        },
        fullScreen: function () {
            var isFullScreen = this.stage.parent.isFullScreen();
            if (!isFullScreen) {
                this.originalScrollTop = jQuery(window).scrollTop();
                _underscore2.default.defer(function () {
                    jQuery(window).scrollTop(0);
                });
            }
            this.stage.parent.isFullScreen(!isFullScreen);
            if (isFullScreen) {
                jQuery(window).scrollTop(this.originalScrollTop);
            }
        },
        collapse: function () {
            this.isCollapsed(!this.isCollapsed());
        },
        clearSearch: function () {
            this.searchValue('');
            this.searching(false);
        }
    });
});