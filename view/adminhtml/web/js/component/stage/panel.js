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

            var groups = _config2.default.getInitConfig('groups'),
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9wYW5lbC50cyJdLCJuYW1lcyI6WyJ1aUNvbXBvbmVudCIsIl8iLCJrbyIsImNvbXBvbmVudFRlbXBsYXRlIiwic2VhcmNoaW5nIiwib2JzZXJ2YWJsZSIsInNlYXJjaFJlc3VsdHMiLCJvYnNlcnZhYmxlQXJyYXkiLCJncm91cHMiLCJvcmlnaW5hbFNjcm9sbFRvcCIsImRlZmF1bHRzIiwiaXNWaXNpYmxlIiwiaXNDb2xsYXBzZWQiLCJzdGFnZSIsIm9uIiwicG9wdWxhdGVDb250ZW50QmxvY2tzIiwib2JzZXJ2ZSIsInNlbGYiLCJldmVudCIsInNlYXJjaFZhbHVlIiwiY3VycmVudFRhcmdldCIsInZhbHVlIiwidG9Mb3dlckNhc2UiLCJtYXAiLCJmaWx0ZXIiLCJnZXRJbml0Q29uZmlnIiwiY29udGVudEJsb2NrIiwibmFtZSIsImluZGV4T2YiLCJ2aXNpYmxlIiwiY29udGVudEJsb2NrcyIsImVhY2giLCJncm91cCIsImlkIiwicHVzaCIsIndoZXJlIiwiY29uc29sZSIsIndhcm4iLCJpc0Z1bGxTY3JlZW4iLCJwYXJlbnQiLCJqUXVlcnkiLCJ3aW5kb3ciLCJzY3JvbGxUb3AiLCJkZWZlciJdLCJtYXBwaW5ncyI6Ijs7O1FBQVlBLFc7O1FBQ0FDLEM7O1FBQ0FDLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhUkMseUIsRUFBNEIsMEM7QUFFNUJDLGlCLEVBQXlDRixHQUFHRyxVQUFILENBQWMsS0FBZCxDO0FBQ3pDQyxxQixFQUE4Q0osR0FBR0ssZUFBSCxDQUFtQixFQUFuQixDO0FBQzlDQyxjLEVBQXVDTixHQUFHSyxlQUFILENBQW1CLEVBQW5CLEM7QUFDdkNFLHlCLEVBQTRCLEM7QUFDNUJDLGdCLEVBQW1CO0FBQ2ZDLHVCQUFXLEtBREk7QUFFZkMseUJBQWEsS0FGRTtBQUdmSixvQkFBUSxFQUhPO0FBSWZKLHVCQUFXLEtBSkk7QUFLZkUsMkJBQWUsRUFMQTtBQU1mTyxtQkFBTyxLQU5RO0FB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ImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1aUNvbXBvbmVudCBmcm9tICd1aUNvbXBvbmVudCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0ICogYXMga28gZnJvbSAna25vY2tvdXQnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tIFwiLi4vc3RhZ2UuZFwiO1xuaW1wb3J0IENvbmZpZyAgZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tIFwiLi9wYW5lbC9ncm91cFwiO1xuaW1wb3J0IHsgQmxvY2sgYXMgR3JvdXBCbG9jayB9IGZyb20gXCIuL3BhbmVsL2dyb3VwL2Jsb2NrXCI7XG5pbXBvcnQgeyBQYW5lbEludGVyZmFjZSB9IGZyb20gXCIuL3BhbmVsLmRcIjtcblxuLyoqXG4gKiBQYW5lbCBDb21wb25lbnRcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGhlbGxvQGRhdmVtYWNhbGF5LmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWwgZXh0ZW5kcyB1aUNvbXBvbmVudCBpbXBsZW1lbnRzIFBhbmVsSW50ZXJmYWNlIHtcbiAgICBjb21wb25lbnRUZW1wbGF0ZTogc3RyaW5nID0gJ0dlbmVfQmx1ZUZvb3QvY29tcG9uZW50L3N0YWdlL3BhbmVsLmh0bWwnO1xuICAgIHN0YWdlOiBTdGFnZUludGVyZmFjZTtcbiAgICBzZWFyY2hpbmc6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIHNlYXJjaFJlc3VsdHM6IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4gPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICAgIGdyb3VwczogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PiA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG4gICAgb3JpZ2luYWxTY3JvbGxUb3A6IG51bWJlciA9IDA7XG4gICAgZGVmYXVsdHM6IG9iamVjdCA9IHtcbiAgICAgICAgaXNWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgaXNDb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgICBncm91cHM6IFtdLFxuICAgICAgICBzZWFyY2hpbmc6IGZhbHNlLFxuICAgICAgICBzZWFyY2hSZXN1bHRzOiBbXSxcbiAgICAgICAgc3RhZ2U6IGZhbHNlLFxuICAgICAgICBvcmlnaW5hbFNjcm9sbFRvcDogZmFsc2VcbiAgICB9O1xuXG4gICAgLy8gT2JzZXJ2YWJsZSdzXG4gICAgaXNWaXNpYmxlOiBLbm9ja291dE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgaXNDb2xsYXBzZWQ6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIC8vIFByZXZpZXdzLmxvYWRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kIHRoZSBzdGFnZSB0byB0aGUgcGFuZWxcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqL1xuICAgIGJpbmRTdGFnZShzdGFnZTogU3RhZ2VJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgICAgICBzdGFnZS5vbignc3RhZ2VSZWFkeScsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVDb250ZW50QmxvY2tzKCk7XG4gICAgICAgICAgICB0aGlzLmlzVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSB0ZW1wbGF0ZSBzdHJpbmdcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50VGVtcGxhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgb2JzZXJ2YWJsZSBwcm9wZXJ0aWVzLlxuICAgICAqXG4gICAgICogQHJldHVybnMge01vZGVsfSBDaGFpbmFibGUuXG4gICAgICovXG4gICAgaW5pdE9ic2VydmFibGUoKTogdGhpcyB7XG4gICAgICAgIHN1cGVyLm9ic2VydmUoJ2lzVmlzaWJsZSBpc0NvbGxhcHNlZCBncm91cHMgc2VhcmNoaW5nIHNlYXJjaFJlc3VsdHMnKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25kdWN0IGEgc2VhcmNoIG9uIHRoZSBhdmFpbGFibGUgY29udGVudCBibG9ja3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZWxmXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgc2VhcmNoKHNlbGY6IFBhbmVsLCBldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBzZWFyY2hWYWx1ZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHNlYXJjaFZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hpbmcoZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hpbmcodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdHMoXy5tYXAoXG4gICAgICAgICAgICAgICAgXy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgIENvbmZpZy5nZXRJbml0Q29uZmlnKCdjb250ZW50QmxvY2tzJyksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjb250ZW50QmxvY2s6IENvbnRlbnRCbG9ja0NvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRCbG9jay5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2hWYWx1ZSkgPiAtMSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCbG9jay52aXNpYmxlID09PSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY29udGVudEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBHcm91cEJsb2NrIGZvciBlYWNoIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwQmxvY2soY29udGVudEJsb2NrKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBvcHVsYXRlIHRoZSBwYW5lbCB3aXRoIHRoZSBjb250ZW50IGJsb2Nrc1xuICAgICAqL1xuICAgIHBvcHVsYXRlQ29udGVudEJsb2NrcygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGdyb3VwcyA9IENvbmZpZy5nZXRJbml0Q29uZmlnKCdncm91cHMnKSxcbiAgICAgICAgICAgIGNvbnRlbnRCbG9ja3MgPSBDb25maWcuZ2V0SW5pdENvbmZpZygnY29udGVudEJsb2NrcycpO1xuXG4gICAgICAgIC8vIFZlcmlmeSB0aGUgY29uZmlndXJhdGlvbiBjb250YWlucyB0aGUgcmVxdWlyZWQgaW5mb3JtYXRpb25cbiAgICAgICAgaWYgKGdyb3VwcyAmJiBjb250ZW50QmxvY2tzKSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIGdyb3VwcyBjcmVhdGluZyBuZXcgaW5zdGFuY2VzIHdpdGggdGhlaXIgYXNzb2NpYXRlZCBjb250ZW50IGJsb2Nrc1xuICAgICAgICAgICAgXy5lYWNoKGdyb3VwcywgKGdyb3VwLCBpZCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFB1c2ggdGhlIGdyb3VwIGluc3RhbmNlIGludG8gdGhlIG9ic2VydmFibGUgYXJyYXkgdG8gdXBkYXRlIHRoZSBVSVxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBzLnB1c2gobmV3IEdyb3VwKFxuICAgICAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAsXG4gICAgICAgICAgICAgICAgICAgIF8ubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgXy53aGVyZShjb250ZW50QmxvY2tzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLCAvKiBSZXRyaWV2ZSBjb250ZW50IGJsb2NrcyB3aXRoIGdyb3VwIGlkICovXG4gICAgICAgICAgICAgICAgICAgICAgICAoY29udGVudEJsb2NrOiBDb250ZW50QmxvY2tDb25maWcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEdyb3VwQmxvY2soY29udGVudEJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgdGhlIHBhbmVsXG4gICAgICAgICAgICB0aGlzLmlzVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQ29uZmlndXJhdGlvbiBpcyBub3QgcHJvcGVybHkgaW5pdGlhbGl6ZWQsIHBsZWFzZSBjaGVjayB0aGUgQWpheCByZXNwb25zZS4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlIHVwIHRvIHRoZSBXWVNJV1lHIGNvbXBvbmVudCBhbmQgc2V0IGFzIGZ1bGwgc2NyZWVuXG4gICAgICovXG4gICAgZnVsbFNjcmVlbigpOiB2b2lkIHtcbiAgICAgICAgbGV0IGlzRnVsbFNjcmVlbiA9IHRoaXMuc3RhZ2UucGFyZW50LmlzRnVsbFNjcmVlbigpO1xuICAgICAgICBpZiAoIWlzRnVsbFNjcmVlbikge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFNjcm9sbFRvcCA9IGpRdWVyeSh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgXy5kZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KHdpbmRvdykuc2Nyb2xsVG9wKDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YWdlLnBhcmVudC5pc0Z1bGxTY3JlZW4oIWlzRnVsbFNjcmVlbik7XG4gICAgICAgIGlmIChpc0Z1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIGpRdWVyeSh3aW5kb3cpLnNjcm9sbFRvcCh0aGlzLm9yaWdpbmFsU2Nyb2xsVG9wKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbGxhcHNlIHRoZSBwYW5lbCBpbnRvIHRoZSBzaWRlIG9mIHRoZSBVSVxuICAgICAqL1xuICAgIGNvbGxhcHNlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmlzQ29sbGFwc2VkKCF0aGlzLmlzQ29sbGFwc2VkKCkpO1xuICAgIH1cbn0iXX0=
