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
                this.searchResults(_underscore2.default.map(_underscore2.default.filter(_config2.default.getInitConfig('contentBlocks'), function (contentBlock) {
                    return contentBlock.name.toLowerCase().indexOf(searchValue) > -1 && contentBlock.visible === true;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9wYW5lbC50cyJdLCJuYW1lcyI6WyJjb21wb25lbnRUZW1wbGF0ZSIsInNlYXJjaGluZyIsIm9ic2VydmFibGUiLCJzZWFyY2hSZXN1bHRzIiwib2JzZXJ2YWJsZUFycmF5IiwiZ3JvdXBzIiwib3JpZ2luYWxTY3JvbGxUb3AiLCJkZWZhdWx0cyIsImlzVmlzaWJsZSIsImlzQ29sbGFwc2VkIiwic3RhZ2UiLCJvbiIsInBvcHVsYXRlQ29udGVudEJsb2NrcyIsIm9ic2VydmUiLCJzZWxmIiwiZXZlbnQiLCJzZWFyY2hWYWx1ZSIsImN1cnJlbnRUYXJnZXQiLCJ2YWx1ZSIsInRvTG93ZXJDYXNlIiwibWFwIiwiZmlsdGVyIiwiZ2V0SW5pdENvbmZpZyIsImNvbnRlbnRCbG9jayIsIm5hbWUiLCJpbmRleE9mIiwidmlzaWJsZSIsImNvbnRlbnRCbG9ja3MiLCJlYWNoIiwiZ3JvdXAiLCJpZCIsInB1c2giLCJ3aGVyZSIsImNvbnNvbGUiLCJ3YXJuIiwiaXNGdWxsU2NyZWVuIiwicGFyZW50IiwialF1ZXJ5Iiwid2luZG93Iiwic2Nyb2xsVG9wIiwiZGVmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CSUEseUIsRUFBNEIsMEM7QUFFNUJDLGlCLEVBQXlDLG1CQUFHQyxVQUFILENBQWMsS0FBZCxDO0FBQ3pDQyxxQixFQUE4QyxtQkFBR0MsZUFBSCxDQUFtQixFQUFuQixDO0FBQzlDQyxjLEVBQXVDLG1CQUFHRCxlQUFILENBQW1CLEVBQW5CLEM7QUFDdkNFLHlCLEVBQTRCLEM7QUFDNUJDLGdCLEVBQW1CO0FBQ2ZDLHVCQUFXLEtBREk7QUFFZkMseUJBQWEsS0FGRTtBQUdmSixvQkFBUSxFQUhPO0FBSWZKLHVCQUFXLEtBSkk7QUFLZkUsMkJBQWUsRUFMQTtBQU1mTyxtQkFBTyxLQU5RO0FBT2ZKLCtCQUFtQjtBQVBKLFM7Z0NBY25CO0FBQ0k7O0FBRUE7QUFDSCxTOzZCQU9TSSxLLEVBQXFCO0FB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IGZyb20gJ3VpQ29tcG9uZW50JztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IGtvIGZyb20gJ2tub2Nrb3V0JztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSBcIi4uL3N0YWdlLmRcIjtcbmltcG9ydCBDb25maWcgIGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCB7IEdyb3VwIH0gZnJvbSBcIi4vcGFuZWwvZ3JvdXBcIjtcbmltcG9ydCB7IEJsb2NrIGFzIEdyb3VwQmxvY2sgfSBmcm9tIFwiLi9wYW5lbC9ncm91cC9ibG9ja1wiO1xuaW1wb3J0IHsgUGFuZWxJbnRlcmZhY2UgfSBmcm9tIFwiLi9wYW5lbC5kXCI7XG5pbXBvcnQgeyBsb2FkIGFzIGxvYWRQcmV2aWV3cyB9IGZyb20gXCIuL3ByZXZpZXdzXCI7XG5cbmltcG9ydCBcImtvLWRyYWdnYWJsZVwiO1xuaW1wb3J0IFwia28tc29ydGFibGVcIjtcblxuLyoqXG4gKiBQYW5lbCBDb21wb25lbnRcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGhlbGxvQGRhdmVtYWNhbGF5LmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWwgZXh0ZW5kcyB1aUNvbXBvbmVudCBpbXBsZW1lbnRzIFBhbmVsSW50ZXJmYWNlIHtcbiAgICBjb21wb25lbnRUZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3BhbmVsLmh0bWwnO1xuICAgIHN0YWdlOiBTdGFnZUludGVyZmFjZTtcbiAgICBzZWFyY2hpbmc6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIHNlYXJjaFJlc3VsdHM6IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4gPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICAgIGdyb3VwczogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgb3JpZ2luYWxTY3JvbGxUb3A6IG51bWJlciA9IDA7XG4gICAgZGVmYXVsdHM6IG9iamVjdCA9IHtcbiAgICAgICAgaXNWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgaXNDb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgICBncm91cHM6IFtdLFxuICAgICAgICBzZWFyY2hpbmc6IGZhbHNlLFxuICAgICAgICBzZWFyY2hSZXN1bHRzOiBbXSxcbiAgICAgICAgc3RhZ2U6IGZhbHNlLFxuICAgICAgICBvcmlnaW5hbFNjcm9sbFRvcDogZmFsc2VcbiAgICB9O1xuXG4gICAgLy8gT2JzZXJ2YWJsZSdzXG4gICAgaXNWaXNpYmxlOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgaXNDb2xsYXBzZWQ6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGxvYWRQcmV2aWV3cygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmQgdGhlIHN0YWdlIHRvIHRoZSBwYW5lbFxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICovXG4gICAgYmluZFN0YWdlKHN0YWdlOiBTdGFnZUludGVyZmFjZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgIHN0YWdlLm9uKCdzdGFnZVJlYWR5JywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUNvbnRlbnRCbG9ja3MoKTtcbiAgICAgICAgICAgIHRoaXMuaXNWaXNpYmxlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIHRlbXBsYXRlIHN0cmluZ1xuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBvYnNlcnZhYmxlIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TW9kZWx9IENoYWluYWJsZS5cbiAgICAgKi9cbiAgICBpbml0T2JzZXJ2YWJsZSgpOiB0aGlzIHtcbiAgICAgICAgc3VwZXIub2JzZXJ2ZSgnaXNWaXNpYmxlIGlzQ29sbGFwc2VkIGdyb3VwcyBzZWFyY2hpbmcgc2VhcmNoUmVzdWx0cycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbmR1Y3QgYSBzZWFyY2ggb24gdGhlIGF2YWlsYWJsZSBjb250ZW50IGJsb2Nrc1xuICAgICAqXG4gICAgICogQHBhcmFtIHNlbGZcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBzZWFyY2goc2VsZjogUGFuZWwsIGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgbGV0IHNlYXJjaFZhbHVlID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaGluZyhmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaGluZyh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyhfLm1hcChcbiAgICAgICAgICAgICAgICBfLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlnLmdldEluaXRDb25maWcoJ2NvbnRlbnRCbG9ja3MnKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGNvbnRlbnRCbG9jazogQ29udGVudEJsb2NrQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudEJsb2NrLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaFZhbHVlKSA+IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEJsb2NrLnZpc2libGUgPT09IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjb250ZW50QmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEdyb3VwQmxvY2sgZm9yIGVhY2ggcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXBCbG9jayhjb250ZW50QmxvY2spO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9wdWxhdGUgdGhlIHBhbmVsIHdpdGggdGhlIGNvbnRlbnQgYmxvY2tzXG4gICAgICovXG4gICAgcG9wdWxhdGVDb250ZW50QmxvY2tzKCk6IHZvaWQge1xuICAgICAgICBsZXQgZ3JvdXBzID0gQ29uZmlnLmdldEluaXRDb25maWcoJ2dyb3VwcycpLFxuICAgICAgICAgICAgY29udGVudEJsb2NrcyA9IENvbmZpZy5nZXRJbml0Q29uZmlnKCdjb250ZW50QmxvY2tzJyk7XG5cbiAgICAgICAgLy8gVmVyaWZ5IHRoZSBjb25maWd1cmF0aW9uIGNvbnRhaW5zIHRoZSByZXF1aXJlZCBpbmZvcm1hdGlvblxuICAgICAgICBpZiAoZ3JvdXBzICYmIGNvbnRlbnRCbG9ja3MpIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCB0aGUgZ3JvdXBzIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXMgd2l0aCB0aGVpciBhc3NvY2lhdGVkIGNvbnRlbnQgYmxvY2tzXG4gICAgICAgICAgICBfLmVhY2goZ3JvdXBzLCAoZ3JvdXAsIGlkKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gUHVzaCB0aGUgZ3JvdXAgaW5zdGFuY2UgaW50byB0aGUgb2JzZXJ2YWJsZSBhcnJheSB0byB1cGRhdGUgdGhlIFVJXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cHMucHVzaChuZXcgR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICBncm91cCxcbiAgICAgICAgICAgICAgICAgICAgXy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBfLndoZXJlKGNvbnRlbnRCbG9ja3MsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cDogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIC8qIFJldHJpZXZlIGNvbnRlbnQgYmxvY2tzIHdpdGggZ3JvdXAgaWQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIChjb250ZW50QmxvY2s6IENvbnRlbnRCbG9ja0NvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXBCbG9jayhjb250ZW50QmxvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRGlzcGxheSB0aGUgcGFuZWxcbiAgICAgICAgICAgIHRoaXMuaXNWaXNpYmxlKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb25maWd1cmF0aW9uIGlzIG5vdCBwcm9wZXJseSBpbml0aWFsaXplZCwgcGxlYXNlIGNoZWNrIHRoZSBBamF4IHJlc3BvbnNlLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhdmVyc2UgdXAgdG8gdGhlIFdZU0lXWUcgY29tcG9uZW50IGFuZCBzZXQgYXMgZnVsbCBzY3JlZW5cbiAgICAgKi9cbiAgICBmdWxsU2NyZWVuKCk6IHZvaWQge1xuICAgICAgICBsZXQgaXNGdWxsU2NyZWVuID0gdGhpcy5zdGFnZS5wYXJlbnQuaXNGdWxsU2NyZWVuKCk7XG4gICAgICAgIGlmICghaXNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsU2Nyb2xsVG9wID0galF1ZXJ5KHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICBfLmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnkod2luZG93KS5zY3JvbGxUb3AoMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhZ2UucGFyZW50LmlzRnVsbFNjcmVlbighaXNGdWxsU2NyZWVuKTtcbiAgICAgICAgaWYgKGlzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgalF1ZXJ5KHdpbmRvdykuc2Nyb2xsVG9wKHRoaXMub3JpZ2luYWxTY3JvbGxUb3ApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29sbGFwc2UgdGhlIHBhbmVsIGludG8gdGhlIHNpZGUgb2YgdGhlIFVJXG4gICAgICovXG4gICAgY29sbGFwc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQoIXRoaXMuaXNDb2xsYXBzZWQoKSk7XG4gICAgfVxufSJdfQ==
