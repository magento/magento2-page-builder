define(['uiComponent', 'underscore', 'knockout', '../config', './panel/group', './panel/group/block'], function (_uiComponent, _underscore, _knockout, _config, _group, _block) {
    'use strict';

    var uiComponent = _interopRequireWildcard(_uiComponent);

    var _ = _interopRequireWildcard(_underscore);

    var ko = _interopRequireWildcard(_knockout);

    var _config2 = _interopRequireDefault(_config);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    return _uiComponent.extend({
        componentTemplate: 'Gene_BlueFoot/component/stage/panel.html',
        searching: ko.observable(false),
        searchResults: ko.observableArray([]),
        groups: ko.observableArray([]),
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
                this.searchResults(_.map(_.filter(_config2.default.getInitConfig('contentBlocks'), function (contentBlock) {
                    return contentBlock.name.toLowerCase().indexOf(searchValue) > -1 && contentBlock.visible === true;
                }), function (contentBlock) {
                    // Create a new instance of GroupBlock for each result
                    return new _block.Block(contentBlock);
                }));
            }
        },
        populateContentBlocks: function () {
            var _this2 = this;

            var self = this,
                groups = _config2.default.getInitConfig('groups'),
                contentBlocks = _config2.default.getInitConfig('contentBlocks');
            // Verify the configuration contains the required information
            if (groups && contentBlocks) {
                // Iterate through the groups creating new instances with their associated content blocks
                _.each(groups, function (group, id) {
                    // Push the group instance into the observable array to update the UI
                    _this2.groups.push(new _group.Group(id, group, _.map(_.where(contentBlocks, {
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
                _.defer(function () {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2UvcGFuZWwudHMiXSwibmFtZXMiOlsidWlDb21wb25lbnQiLCJfIiwia28iLCJ0ZW1wbGF0ZSIsInNlYXJjaGluZyIsIm9ic2VydmFibGUiLCJzZWFyY2hSZXN1bHRzIiwib2JzZXJ2YWJsZUFycmF5IiwiZ3JvdXBzIiwib3JpZ2luYWxTY3JvbGxUb3AiLCJkZWZhdWx0cyIsImlzVmlzaWJsZSIsImlzQ29sbGFwc2VkIiwic3RhZ2UiLCJvbiIsInBvcHVsYXRlQ29udGVudEJsb2NrcyIsIm9ic2VydmUiLCJzZWxmIiwiZXZlbnQiLCJzZWFyY2hWYWx1ZSIsImN1cnJlbnRUYXJnZXQiLCJ2YWx1ZSIsInRvTG93ZXJDYXNlIiwibWFwIiwiZmlsdGVyIiwiZ2V0SW5pdENvbmZpZyIsImNvbnRlbnRCbG9jayIsIm5hbWUiLCJpbmRleE9mIiwidmlzaWJsZSIsImNvbnRlbnRCbG9ja3MiLCJlYWNoIiwiZ3JvdXAiLCJpZCIsInB1c2giLCJ3aGVyZSIsImNvbnNvbGUiLCJ3YXJuIiwiaXNGdWxsU2NyZWVuIiwicGFyZW50IiwialF1ZXJ5Iiwid2luZG93Iiwic2Nyb2xsVG9wIiwiZGVmZXIiXSwibWFwcGluZ3MiOiI7OztRQUFZQSxXOztRQUNBQyxDOztRQUNBQyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJSQyxnQixFQUFtQiwwQztBQUVuQkMsaUIsRUFBeUNGLEdBQUdHLFVBQUgsQ0FBYyxLQUFkLEM7QUFDekNDLHFCLEVBQThDSixHQUFHSyxlQUFILENBQW1CLEVBQW5CLEM7QUFDOUNDLGMsRUFBdUNOLEdBQUdLLGVBQUgsQ0FBbUIsRUFBbkIsQztBQUN2Q0UseUIsRUFBNEIsQztBQUM1QkMsZ0IsRUFBbUI7QUFDZkMsdUJBQVcsS0FESTtBQUVmQyx5QkFBYSxLQUZFO0FBR2ZKLG9CQUFRLEVBSE87QUFJZkosdUJBQVcsS0FKSTtBQUtmRSwyQkFBZSxFQUxBO0FBTWZPLG1CQUFPLEtBTlE7QUFPZkosK0JB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LEVBQWxCO0FBQ0giLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3BhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdWlDb21wb25lbnQgZnJvbSAndWlDb21wb25lbnQnO1xuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCAqIGFzIGtvIGZyb20gJ2tub2Nrb3V0JztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSBcIi4uL3N0YWdlLmRcIjtcbmltcG9ydCBDb25maWcgIGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCB7IEdyb3VwIH0gZnJvbSBcIi4vcGFuZWwvZ3JvdXBcIjtcbmltcG9ydCB7IEJsb2NrIGFzIEdyb3VwQmxvY2sgfSBmcm9tIFwiLi9wYW5lbC9ncm91cC9ibG9ja1wiO1xuXG5pbnRlcmZhY2UgUGFuZWxJbnRlcmZhY2Uge1xuICAgIHRlbXBsYXRlOiBzdHJpbmc7XG4gICAgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlO1xuICAgIHNlYXJjaGluZzogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIHNlYXJjaFJlc3VsdHM6IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT47XG4gICAgZ3JvdXBzOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+O1xuICAgIG9yaWdpbmFsU2Nyb2xsVG9wOiBudW1iZXI7XG4gICAgZGVmYXVsdHM/OiBvYmplY3Q7XG5cbiAgICBpc1Zpc2libGU/OiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgaXNDb2xsYXBzZWQ/OiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG59XG5cbi8qKlxuICogUGFuZWwgQ29tcG9uZW50XG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxoZWxsb0BkYXZlbWFjYWxheS5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsIGV4dGVuZHMgdWlDb21wb25lbnQgaW1wbGVtZW50cyBQYW5lbEludGVyZmFjZSB7XG4gICAgdGVtcGxhdGU6IHN0cmluZyA9ICdHZW5lX0JsdWVGb290L2NvbXBvbmVudC9zdGFnZS9wYW5lbC5odG1sJztcbiAgICBzdGFnZTogU3RhZ2VJbnRlcmZhY2U7XG4gICAgc2VhcmNoaW5nOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj4gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICBzZWFyY2hSZXN1bHRzOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+ID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcbiAgICBncm91cHM6IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4gPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICAgIG9yaWdpbmFsU2Nyb2xsVG9wOiBudW1iZXIgPSAwO1xuICAgIGRlZmF1bHRzOiBvYmplY3QgPSB7XG4gICAgICAgIGlzVmlzaWJsZTogZmFsc2UsXG4gICAgICAgIGlzQ29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgZ3JvdXBzOiBbXSxcbiAgICAgICAgc2VhcmNoaW5nOiBmYWxzZSxcbiAgICAgICAgc2VhcmNoUmVzdWx0czogW10sXG4gICAgICAgIHN0YWdlOiBmYWxzZSxcbiAgICAgICAgb3JpZ2luYWxTY3JvbGxUb3A6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIE9ic2VydmFibGUnc1xuICAgIGlzVmlzaWJsZTogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIGlzQ29sbGFwc2VkOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAvLyBQcmV2aWV3cy5sb2FkXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmluZCB0aGUgc3RhZ2UgdG8gdGhlIHBhbmVsXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBiaW5kU3RhZ2Uoc3RhZ2U6IFN0YWdlSW50ZXJmYWNlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcbiAgICAgICAgc3RhZ2Uub24oJ3N0YWdlUmVhZHknLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVsYXRlQ29udGVudEJsb2NrcygpO1xuICAgICAgICAgICAgdGhpcy5pc1Zpc2libGUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgdGVtcGxhdGUgc3RyaW5nXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIG9ic2VydmFibGUgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtNb2RlbH0gQ2hhaW5hYmxlLlxuICAgICAqL1xuICAgIGluaXRPYnNlcnZhYmxlKCk6IHRoaXMge1xuICAgICAgICBzdXBlci5vYnNlcnZlKCdpc1Zpc2libGUgaXNDb2xsYXBzZWQgZ3JvdXBzIHNlYXJjaGluZyBzZWFyY2hSZXN1bHRzJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZHVjdCBhIHNlYXJjaCBvbiB0aGUgYXZhaWxhYmxlIGNvbnRlbnQgYmxvY2tzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VsZlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqL1xuICAgIHNlYXJjaChzZWxmOiBQYW5lbCwgZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICBsZXQgc2VhcmNoVmFsdWUgPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChzZWFyY2hWYWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoaW5nKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoaW5nKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hSZXN1bHRzKF8ubWFwKFxuICAgICAgICAgICAgICAgIF8uZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICBDb25maWcuZ2V0SW5pdENvbmZpZygnY29udGVudEJsb2NrcycpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY29udGVudEJsb2NrOiBDb250ZW50QmxvY2tDb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50QmxvY2submFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoVmFsdWUpID4gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50QmxvY2sudmlzaWJsZSA9PT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGNvbnRlbnRCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgR3JvdXBCbG9jayBmb3IgZWFjaCByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBHcm91cEJsb2NrKGNvbnRlbnRCbG9jayk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQb3B1bGF0ZSB0aGUgcGFuZWwgd2l0aCB0aGUgY29udGVudCBibG9ja3NcbiAgICAgKi9cbiAgICBwb3B1bGF0ZUNvbnRlbnRCbG9ja3MoKTogdm9pZCB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGdyb3VwcyA9IENvbmZpZy5nZXRJbml0Q29uZmlnKCdncm91cHMnKSxcbiAgICAgICAgICAgIGNvbnRlbnRCbG9ja3MgPSBDb25maWcuZ2V0SW5pdENvbmZpZygnY29udGVudEJsb2NrcycpO1xuXG4gICAgICAgIC8vIFZlcmlmeSB0aGUgY29uZmlndXJhdGlvbiBjb250YWlucyB0aGUgcmVxdWlyZWQgaW5mb3JtYXRpb25cbiAgICAgICAgaWYgKGdyb3VwcyAmJiBjb250ZW50QmxvY2tzKSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIGdyb3VwcyBjcmVhdGluZyBuZXcgaW5zdGFuY2VzIHdpdGggdGhlaXIgYXNzb2NpYXRlZCBjb250ZW50IGJsb2Nrc1xuICAgICAgICAgICAgXy5lYWNoKGdyb3VwcywgKGdyb3VwLCBpZCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFB1c2ggdGhlIGdyb3VwIGluc3RhbmNlIGludG8gdGhlIG9ic2VydmFibGUgYXJyYXkgdG8gdXBkYXRlIHRoZSBVSVxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBzLnB1c2gobmV3IEdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAsXG4gICAgICAgICAgICAgICAgICAgIF8ubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgXy53aGVyZShjb250ZW50QmxvY2tzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCAvKiBSZXRyaWV2ZSBjb250ZW50IGJsb2NrcyB3aXRoIGdyb3VwIGlkICovXG4gICAgICAgICAgICAgICAgICAgICAgICAoY29udGVudEJsb2NrOiBDb250ZW50QmxvY2tDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwQmxvY2soY29udGVudEJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgdGhlIHBhbmVsXG4gICAgICAgICAgICB0aGlzLmlzVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQ29uZmlndXJhdGlvbiBpcyBub3QgcHJvcGVybHkgaW5pdGlhbGl6ZWQsIHBsZWFzZSBjaGVjayB0aGUgQWpheCByZXNwb25zZS4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlIHVwIHRvIHRoZSBXWVNJV1lHIGNvbXBvbmVudCBhbmQgc2V0IGFzIGZ1bGwgc2NyZWVuXG4gICAgICovXG4gICAgZnVsbFNjcmVlbigpOiB2b2lkIHtcbiAgICAgICAgbGV0IGlzRnVsbFNjcmVlbiA9IHRoaXMuc3RhZ2UucGFyZW50LmlzRnVsbFNjcmVlbigpO1xuICAgICAgICBpZiAoIWlzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFNjcm9sbFRvcCA9IGpRdWVyeSh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgXy5kZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KHdpbmRvdykuc2Nyb2xsVG9wKDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YWdlLnBhcmVudC5pc0Z1bGxTY3JlZW4oIWlzRnVsbFNjcmVlbik7XG4gICAgICAgIGlmIChpc0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIGpRdWVyeSh3aW5kb3cpLnNjcm9sbFRvcCh0aGlzLm9yaWdpbmFsU2Nyb2xsVG9wKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbGxhcHNlIHRoZSBwYW5lbCBpbnRvIHRoZSBzaWRlIG9mIHRoZSBVSVxuICAgICAqL1xuICAgIGNvbGxhcHNlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmlzQ29sbGFwc2VkKCF0aGlzLmlzQ29sbGFwc2VkKCkpO1xuICAgIH1cbn0iXX0=
