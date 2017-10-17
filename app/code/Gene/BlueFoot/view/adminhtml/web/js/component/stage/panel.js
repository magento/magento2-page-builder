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
        searching: _knockout2.default.observable(false),
        searchResults: _knockout2.default.observableArray([]),
        groups: _knockout2.default.observableArray([]),
        originalScrollTop: 0,
        defaults: {
            isVisible: false,
            isCollapsed: false,
            groups: [],
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
            this._super().observe('isVisible isCollapsed groups searching searchResults');
            return this;
        },
        search: function (self, event) {
            var searchValue = event.currentTarget.value.toLowerCase();
            if (searchValue === '') {
                this.searching(false);
            } else {
                this.searching(true);
                this.searchResults(_underscore2.default.map(_underscore2.default.filter(_config2.default.getInitConfig('contentTypes'), function (contentBlock) {
                    return contentBlock.label.toLowerCase().indexOf(searchValue) > -1 && contentBlock.visible === true;
                }), function (contentBlock, identifier) {
                    // Create a new instance of GroupBlock for each result
                    return new _block.Block(identifier, contentBlock);
                }));
            }
        },
        populateContentBlocks: function () {
            var _this2 = this;

            var groups = _config2.default.getInitConfig('groups'),
                contentBlocks = _config2.default.getInitConfig('contentTypes');
            // Verify the configuration contains the required information
            if (groups && contentBlocks) {
                // Iterate through the groups creating new instances with their associated content blocks
                _underscore2.default.each(groups, function (group, id) {
                    // Push the group instance into the observable array to update the UI
                    _this2.groups.push(new _group.Group(id, group, _underscore2.default.map(_underscore2.default.where(contentBlocks, {
                        group: id,
                        visible: true
                    }), /* Retrieve content blocks with group id */function (contentBlock, identifier) {
                        return new _block.Block(identifier, contentBlock);
                    })));
                });
                // Display the panel
                this.isVisible(true);
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
        }
    });
});