define(['uiComponent', 'underscore', 'knockout', '../config', './panel/group', './panel/group/block', 'ko-draggable', 'ko-sortable'], function (_uiComponent, _underscore, _knockout, _config, _group, _block) {
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
            // Previews.load
            this._super();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9wYW5lbC50cyJdLCJuYW1lcyI6WyJjb21wb25lbnRUZW1wbGF0ZSIsInNlYXJjaGluZyIsIm9ic2VydmFibGUiLCJzZWFyY2hSZXN1bHRzIiwib2JzZXJ2YWJsZUFycmF5IiwiZ3JvdXBzIiwib3JpZ2luYWxTY3JvbGxUb3AiLCJkZWZhdWx0cyIsImlzVmlzaWJsZSIsImlzQ29sbGFwc2VkIiwic3RhZ2UiLCJvbiIsInBvcHVsYXRlQ29udGVudEJsb2NrcyIsIm9ic2VydmUiLCJzZWxmIiwiZXZlbnQiLCJzZWFyY2hWYWx1ZSIsImN1cnJlbnRUYXJnZXQiLCJ2YWx1ZSIsInRvTG93ZXJDYXNlIiwibWFwIiwiZmlsdGVyIiwiZ2V0SW5pdENvbmZpZyIsImNvbnRlbnRCbG9jayIsIm5hbWUiLCJpbmRleE9mIiwidmlzaWJsZSIsImNvbnRlbnRCbG9ja3MiLCJlYWNoIiwiZ3JvdXAiLCJpZCIsInB1c2giLCJ3aGVyZSIsImNvbnNvbGUiLCJ3YXJuIiwiaXNGdWxsU2NyZWVuIiwicGFyZW50IiwialF1ZXJ5Iiwid2luZG93Iiwic2Nyb2xsVG9wIiwiZGVmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCSUEseUIsRUFBNEIsMEM7QUFFNUJDLGlCLEVBQXlDLG1CQUFHQyxVQUFILENBQWMsS0FBZCxDO0FBQ3pDQyxxQixFQUE4QyxtQkFBR0MsZUFBSCxDQUFtQixFQUFuQixDO0FBQzlDQyxjLEVBQXVDLG1CQUFHRCxlQUFILENBQW1CLEVBQW5CLEM7QUFDdkNFLHlCLEVBQTRCLEM7QUFDNUJDLGdCLEVBQW1CO0FBQ2ZDLHVCQUFXLEtBREk7QUFFZkMseUJBQWEsS0FGRTtBQUdmSixvQkFBUSxFQUhPO0FBSWZKLHVCQUFXLEtBSkk7QUFLZkUsMkJBQWUsRUFMQTtBQU1mTyxtQkFBTyxLQU5RO0FBT2ZKLCtCQUFtQjtBQVBKLFM7Z0NBY25CO0FBR0k7QUFGQTtBQUdILFM7NkJBT1NJLEssRUFBcUI7QUFBQTs7QUFDM0IsaUJBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNBQSxrQkFBTUMsRUFBTixDQUFTLFlBQVQsRUFBdUIsWUFBQTtBQUNuQixzQkFBS0MscUJBQUw7QUFDQSxzQkFBS0osU0FBTCxDQUFlLElBQWY7QUFDSCxhQUhEO0FBSUgsUztpQ0FPVTtBQUNQLG1CQUFPLEtBQUtSLGlCQUFaO0FBQ0gsUztvQ0FPYTtBQUNWLDBCQUFNYSxPQUFOLENBQWMsc0RBQWQ7QUFFQSxtQkFBTyxJQUFQO0FBQ0gsUzswQkFRTUMsSSxFQUFhQyxLLEVBQVU7QUFDMUIsZ0JBQUlDLGNBQWNELE1BQU1FLGFBQU4sQ0FBb0JDLEtBQXBCLENBQTBCQyxXQUExQixFQUFsQjtBQUNBLGdCQUFJSCxnQkFBZ0IsRUFBcEIsRUFBd0I7QUFDcEIscUJBQUtmLFNBQUwsQ0FBZSxLQUFmO0FBQ0gsYUFGRCxNQUVPO0FBQ0gscUJBQUtBLFNBQUwsQ0FBZSxJQUFmO0FBQ0EscUJBQUtFLGFBQUwsQ0FBbUIscUJBQUVpQixHQUFGLENBQ2YscUJBQUVDLE1BQUYsQ0FDSSxpQkFBT0MsYUFBUCxDQUFxQixlQUFyQixDQURKLEVBRUksVUFBVUMsWUFBVixFQUEwQztBQUN0QywyQkFBT0EsYUFBYUMsSUFBYixDQUFrQkwsV0FBbEIsR0FBZ0NNLE9BQWhDLENBQXdDVCxXQUF4QyxJQUF1RCxDQUFDLENBQXhELElBQ0hPLGFBQWFHLE9BQWIsS0FBeUIsSUFEN0I7QUFFSCxpQkFMTCxDQURlLEVBUWYsVUFBVUgsWUFBVixFQUFzQjtBQUNsQjtBQUNBLDJCQUFPLGlCQUFlQSxZQUFmLENBQVA7QUFDSCxpQkFYYyxDQUFuQjtBQWFIO0FBQ0osUzsyQ0FLb0I7QUFBQTs7QUFDakIsZ0JBQUlsQixTQUFTLGlCQUFPaUIsYUFBUCxDQUFxQixRQUFyQixDQUFiO0FBQUEsZ0JBQ0lLLGdCQUFnQixpQkFBT0wsYUFBUCxDQUFxQixlQUFyQixDQURwQjtBQUdBO0FBQ0EsZ0JBQUlqQixVQUFVc0IsYUFBZCxFQUE2QjtBQUN6QjtBQUNBLHFDQUFFQyxJQUFGLENBQU92QixNQUFQLEVBQWUsVUFBQ3dCLEtBQUQsRUFBUUMsRUFBUixFQUFVO0FBQ3JCO0FBQ0EsMkJBQUt6QixNQUFMLENBQVkwQixJQUFaLENBQWlCLGlCQUNiRCxFQURhLEVBRWJELEtBRmEsRUFHYixxQkFBRVQsR0FBRixDQUNJLHFCQUFFWSxLQUFGLENBQVFMLGFBQVIsRUFBdUI7QUFDbkJFLCtCQUFPQyxFQURZO0FBRW5CSixpQ0FBUztBQUZVLHFCQUF2QixDQURKLEVBSVEsMkNBQ0osVUFBQ0gsWUFBRCxFQUFpQztBQUM3QiwrQkFBTyxpQkFBZUEsWUFBZixDQUFQO0FBQ0gscUJBUEwsQ0FIYSxDQUFqQjtBQWFILGlCQWZEO0FBaUJBO0FBQ0EscUJBQUtmLFNBQUwsQ0FBZSxJQUFmO0FBQ0gsYUFyQkQsTUFxQk87QUFDSHlCLHdCQUFRQyxJQUFSLENBQWEsNEVBQWI7QUFDSDtBQUNKLFM7Z0NBS1M7QUFDTixnQkFBSUMsZUFBZSxLQUFLekIsS0FBTCxDQUFXMEIsTUFBWCxDQUFrQkQsWUFBbEIsRUFBbkI7QUFDQSxnQkFBSSxDQUFDQSxZQUFMLEVBQW1CO0FBQ2YscUJBQUs3QixpQkFBTCxHQUF5QitCLE9BQU9DLE1BQVAsRUFBZUMsU0FBZixFQUF6QjtBQUNBLHFDQUFFQyxLQUFGLENBQVEsWUFBQTtBQUNKSCwyQkFBT0MsTUFBUCxFQUFlQyxTQUFmLENBQXlCLENBQXpCO0FBQ0gsaUJBRkQ7QUFHSDtBQUVELGlCQUFLN0IsS0FBTCxDQUFXMEIsTUFBWCxDQUFrQkQsWUFBbEIsQ0FBK0IsQ0FBQ0EsWUFBaEM7QUFDQSxnQkFBSUEsWUFBSixFQUFrQjtBQUNkRSx1QkFBT0MsTUFBUCxFQUFlQyxTQUFmLENBQXlCLEtBQUtqQyxpQkFBOUI7QUFDSDtBQUNKLFM7OEJBS087QUFDSixpQkFBS0csV0FBTCxDQUFpQixDQUFDLEtBQUtBLFdBQUwsRUFBbEI7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdWlDb21wb25lbnQgZnJvbSAndWlDb21wb25lbnQnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tIFwiLi4vc3RhZ2UuZFwiO1xuaW1wb3J0IENvbmZpZyAgZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tIFwiLi9wYW5lbC9ncm91cFwiO1xuaW1wb3J0IHsgQmxvY2sgYXMgR3JvdXBCbG9jayB9IGZyb20gXCIuL3BhbmVsL2dyb3VwL2Jsb2NrXCI7XG5pbXBvcnQgeyBQYW5lbEludGVyZmFjZSB9IGZyb20gXCIuL3BhbmVsLmRcIjtcblxuaW1wb3J0IFwia28tZHJhZ2dhYmxlXCI7XG5pbXBvcnQgXCJrby1zb3J0YWJsZVwiO1xuXG4vKipcbiAqIFBhbmVsIENvbXBvbmVudFxuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8aGVsbG9AZGF2ZW1hY2FsYXkuY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbCBleHRlbmRzIHVpQ29tcG9uZW50IGltcGxlbWVudHMgUGFuZWxJbnRlcmZhY2Uge1xuICAgIGNvbXBvbmVudFRlbXBsYXRlOiBzdHJpbmcgPSAnR2VuZV9CbHVlRm9vdC9jb21wb25lbnQvc3RhZ2UvcGFuZWwuaHRtbCc7XG4gICAgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlO1xuICAgIHNlYXJjaGluZzogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgc2VhcmNoUmVzdWx0czogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgZ3JvdXBzOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+ID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcbiAgICBvcmlnaW5hbFNjcm9sbFRvcDogbnVtYmVyID0gMDtcbiAgICBkZWZhdWx0czogb2JqZWN0ID0ge1xuICAgICAgICBpc1Zpc2libGU6IGZhbHNlLFxuICAgICAgICBpc0NvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgIGdyb3VwczogW10sXG4gICAgICAgIHNlYXJjaGluZzogZmFsc2UsXG4gICAgICAgIHNlYXJjaFJlc3VsdHM6IFtdLFxuICAgICAgICBzdGFnZTogZmFsc2UsXG4gICAgICAgIG9yaWdpbmFsU2Nyb2xsVG9wOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBPYnNlcnZhYmxlJ3NcbiAgICBpc1Zpc2libGU6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcbiAgICBpc0NvbGxhcHNlZDogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLy8gUHJldmlld3MubG9hZFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJpbmQgdGhlIHN0YWdlIHRvIHRoZSBwYW5lbFxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICovXG4gICAgYmluZFN0YWdlKHN0YWdlOiBTdGFnZUludGVyZmFjZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgIHN0YWdlLm9uKCdzdGFnZVJlYWR5JywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUNvbnRlbnRCbG9ja3MoKTtcbiAgICAgICAgICAgIHRoaXMuaXNWaXNpYmxlKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIHRlbXBsYXRlIHN0cmluZ1xuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBvYnNlcnZhYmxlIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TW9kZWx9IENoYWluYWJsZS5cbiAgICAgKi9cbiAgICBpbml0T2JzZXJ2YWJsZSgpOiB0aGlzIHtcbiAgICAgICAgc3VwZXIub2JzZXJ2ZSgnaXNWaXNpYmxlIGlzQ29sbGFwc2VkIGdyb3VwcyBzZWFyY2hpbmcgc2VhcmNoUmVzdWx0cycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbmR1Y3QgYSBzZWFyY2ggb24gdGhlIGF2YWlsYWJsZSBjb250ZW50IGJsb2Nrc1xuICAgICAqXG4gICAgICogQHBhcmFtIHNlbGZcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKi9cbiAgICBzZWFyY2goc2VsZjogUGFuZWwsIGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgbGV0IHNlYXJjaFZhbHVlID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoc2VhcmNoVmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaGluZyhmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaGluZyh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyhfLm1hcChcbiAgICAgICAgICAgICAgICBfLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlnLmdldEluaXRDb25maWcoJ2NvbnRlbnRCbG9ja3MnKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGNvbnRlbnRCbG9jazogQ29udGVudEJsb2NrQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudEJsb2NrLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaFZhbHVlKSA+IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudEJsb2NrLnZpc2libGUgPT09IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjb250ZW50QmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEdyb3VwQmxvY2sgZm9yIGVhY2ggcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXBCbG9jayhjb250ZW50QmxvY2spO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9wdWxhdGUgdGhlIHBhbmVsIHdpdGggdGhlIGNvbnRlbnQgYmxvY2tzXG4gICAgICovXG4gICAgcG9wdWxhdGVDb250ZW50QmxvY2tzKCk6IHZvaWQge1xuICAgICAgICBsZXQgZ3JvdXBzID0gQ29uZmlnLmdldEluaXRDb25maWcoJ2dyb3VwcycpLFxuICAgICAgICAgICAgY29udGVudEJsb2NrcyA9IENvbmZpZy5nZXRJbml0Q29uZmlnKCdjb250ZW50QmxvY2tzJyk7XG5cbiAgICAgICAgLy8gVmVyaWZ5IHRoZSBjb25maWd1cmF0aW9uIGNvbnRhaW5zIHRoZSByZXF1aXJlZCBpbmZvcm1hdGlvblxuICAgICAgICBpZiAoZ3JvdXBzICYmIGNvbnRlbnRCbG9ja3MpIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCB0aGUgZ3JvdXBzIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXMgd2l0aCB0aGVpciBhc3NvY2lhdGVkIGNvbnRlbnQgYmxvY2tzXG4gICAgICAgICAgICBfLmVhY2goZ3JvdXBzLCAoZ3JvdXAsIGlkKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gUHVzaCB0aGUgZ3JvdXAgaW5zdGFuY2UgaW50byB0aGUgb2JzZXJ2YWJsZSBhcnJheSB0byB1cGRhdGUgdGhlIFVJXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cHMucHVzaChuZXcgR3JvdXAoXG4gICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICBncm91cCxcbiAgICAgICAgICAgICAgICAgICAgXy5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICBfLndoZXJlKGNvbnRlbnRCbG9ja3MsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cDogaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksIC8qIFJldHJpZXZlIGNvbnRlbnQgYmxvY2tzIHdpdGggZ3JvdXAgaWQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIChjb250ZW50QmxvY2s6IENvbnRlbnRCbG9ja0NvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgR3JvdXBCbG9jayhjb250ZW50QmxvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRGlzcGxheSB0aGUgcGFuZWxcbiAgICAgICAgICAgIHRoaXMuaXNWaXNpYmxlKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb25maWd1cmF0aW9uIGlzIG5vdCBwcm9wZXJseSBpbml0aWFsaXplZCwgcGxlYXNlIGNoZWNrIHRoZSBBamF4IHJlc3BvbnNlLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhdmVyc2UgdXAgdG8gdGhlIFdZU0lXWUcgY29tcG9uZW50IGFuZCBzZXQgYXMgZnVsbCBzY3JlZW5cbiAgICAgKi9cbiAgICBmdWxsU2NyZWVuKCk6IHZvaWQge1xuICAgICAgICBsZXQgaXNGdWxsU2NyZWVuID0gdGhpcy5zdGFnZS5wYXJlbnQuaXNGdWxsU2NyZWVuKCk7XG4gICAgICAgIGlmICghaXNGdWxsU2NyZWVuKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsU2Nyb2xsVG9wID0galF1ZXJ5KHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICBfLmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnkod2luZG93KS5zY3JvbGxUb3AoMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhZ2UucGFyZW50LmlzRnVsbFNjcmVlbighaXNGdWxsU2NyZWVuKTtcbiAgICAgICAgaWYgKGlzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgalF1ZXJ5KHdpbmRvdykuc2Nyb2xsVG9wKHRoaXMub3JpZ2luYWxTY3JvbGxUb3ApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29sbGFwc2UgdGhlIHBhbmVsIGludG8gdGhlIHNpZGUgb2YgdGhlIFVJXG4gICAgICovXG4gICAgY29sbGFwc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXNDb2xsYXBzZWQoIXRoaXMuaXNDb2xsYXBzZWQoKSk7XG4gICAgfVxufSJdfQ==
