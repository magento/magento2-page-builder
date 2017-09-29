define(["exports", "./block", "knockout", "../../config"], function (exports, _block, _knockout, _config) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _block2 = _interopRequireDefault(_block);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _config2 = _interopRequireDefault(_config);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var PreviewImageBlock = function (_PreviewBlock) {
        _inherits(PreviewImageBlock, _PreviewBlock);

        function PreviewImageBlock() {
            _classCallCheck(this, PreviewImageBlock);

            var _this = _possibleConstructorReturn(this, _PreviewBlock.apply(this, arguments));

            _this.loading = _knockout2.default.observable(false);
            _this.imageUrl = _knockout2.default.computed(function () {
                if (_this.image()) {
                    return _config2.default.getInitConfig('media_url') + _this.image().replace('/media/', '');
                    ;
                }
                return '';
            });
            return _this;
        }

        PreviewImageBlock.prototype.uploadUrl = function uploadUrl() {
            return _config2.default.getPluginConfig('gene_widget_upload', 'upload_url');
        };

        PreviewImageBlock.prototype.attachmentSuccess = function attachmentSuccess() {
            var _this2 = this;

            return function (file, response, bindKey) {
                if (response.file) {
                    var parentData = _this2.parent.data();
                    parentData[bindKey] = response.file;
                    _this2.parent.data.valueHasMutated();
                    setTimeout(function () {
                        this.loading(false);
                    }.bind(_this2), 50);
                } else {
                    alert($t("Your image could not be uploaded"));
                }
            };
        };

        PreviewImageBlock.prototype.attachmentDrop = function attachmentDrop() {
            var _this3 = this;

            return function (event) {
                jQuery(event.target).parents('.dz-drag-hover').removeClass('dz-drag-hover');
                _this3.loading(true);
            };
        };

        PreviewImageBlock.prototype.attachmentError = function attachmentError() {
            this.loading(false);
            alert($t("Your image could not be uploaded"));
        };

        return PreviewImageBlock;
    }(_block2.default);

    exports.default = PreviewImageBlock;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9wcmV2aWV3L2ltYWdlLnRzIiwiY29tcG9uZW50L2Jsb2NrL3ByZXZpZXcvaW1hZ2UuanMiXSwibmFtZXMiOlsiUHJldmlld0ltYWdlQmxvY2siLCJhcmd1bWVudHMiLCJsb2FkaW5nIiwib2JzZXJ2YWJsZSIsImltYWdlVXJsIiwiY29tcHV0ZWQiLCJpbWFnZSIsImdldEluaXRDb25maWciLCJyZXBsYWNlIiwidXBsb2FkVXJsIiwiZ2V0UGx1Z2luQ29uZmlnIiwiYXR0YWNobWVudFN1Y2Nlc3MiLCJmaWxlIiwicmVzcG9uc2UiLCJiaW5kS2V5IiwicGFyZW50RGF0YSIsInBhcmVudCIsImRhdGEiLCJ2YWx1ZUhhc011dGF0ZWQiLCJzZXRUaW1lb3V0IiwiYmluZCIsImFsZXJ0IiwiJHQiLCJhdHRhY2htZW50RHJvcCIsImV2ZW50IiwialF1ZXJ5IiwidGFyZ2V0IiwicGFyZW50cyIsInJlbW92ZUNsYXNzIiwiYXR0YWNobWVudEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBS2NBLGlCOzs7QUFBZCxxQ0FBQTtBQUFBOztBQUFBLHlEQ0FRLDBCQUFTQyxTQUFULENEQVI7O0FBRUksa0JBQUFDLE9BQUEsR0FBdUMsbUJBQUdDLFVBQUgsQ0FBYyxLQUFkLENBQXZDO0FBQ0Esa0JBQUFDLFFBQUEsR0FBcUMsbUJBQUdDLFFBQUgsQ0FBWSxZQUFLO0FBQ2xELG9CQUFJLE1BQUtDLEtBQUwsRUFBSixFQUFrQjtBQUNkLDJCQUFPLGlCQUFPQyxhQUFQLENBQXFCLFdBQXJCLElBQW9DLE1BQUtELEtBQUwsR0FBYUUsT0FBYixDQUFxQixTQUFyQixFQUFnQyxFQUFoQyxDQUEzQztBQUErRTtBQUNsRjtBQUNELHVCQUFPLEVBQVA7QUFDSCxhQUxvQyxDQUFyQztBQUhKO0FBd0NDOztvQ0E5QkdDLFMsd0JBQVM7QUFDTCxtQkFBTyxpQkFBT0MsZUFBUCxDQUF1QixvQkFBdkIsRUFBNkMsWUFBN0MsQ0FBUDtBQUNILFM7O29DQUVEQyxpQixnQ0FBaUI7QUFBQTs7QUFDYixtQkFBTyxVQUFDQyxJQUFELEVBQVlDLFFBQVosRUFBMkJDLE9BQTNCLEVBQTJDO0FBQzlDLG9CQUFJRCxTQUFTRCxJQUFiLEVBQW1CO0FBQ2Ysd0JBQUlHLGFBQWEsT0FBS0MsTUFBTCxDQUFZQyxJQUFaLEVBQWpCO0FBQ0FGLCtCQUFXRCxPQUFYLElBQXNCRCxTQUFTRCxJQUEvQjtBQUNBLDJCQUFLSSxNQUFMLENBQVlDLElBQVosQ0FBaUJDLGVBQWpCO0FBQ0FDLCtCQUFXLFlBQUE7QUFDUCw2QkFBS2pCLE9BQUwsQ0FBYSxLQUFiO0FBQ0gscUJBRlUsQ0FFVGtCLElBRlMsUUFBWCxFQUVjLEVBRmQ7QUFHSCxpQkFQRCxNQU9PO0FBQ0hDLDBCQUFNQyxHQUFHLGtDQUFILENBQU47QUFDSDtBQUNKLGFBWEQ7QUFZSCxTOztvQ0FFREMsYyw2QkFBYztBQUFBOztBQUNWLG1CQUFPLFVBQUNDLEtBQUQsRUFBaUI7QUFDcEJDLHVCQUFPRCxNQUFNRSxNQUFiLEVBQXFCQyxPQUFyQixDQUE2QixnQkFBN0IsRUFBK0NDLFdBQS9DLENBQTJELGVBQTNEO0FBQ0EsdUJBQUsxQixPQUFMLENBQWEsSUFBYjtBQUNILGFBSEQ7QUFJSCxTOztvQ0FFRDJCLGUsOEJBQWU7QUFDWCxpQkFBSzNCLE9BQUwsQ0FBYSxLQUFiO0FBQ0FtQixrQkFBTUMsR0FBRyxrQ0FBSCxDQUFOO0FBQ0gsUzs7Ozs7c0JBdkNTdEIsaUIiLCJmaWxlIjoiY29tcG9uZW50L2Jsb2NrL3ByZXZpZXcvaW1hZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJldmlld0Jsb2NrIGZyb20gXCIuL2Jsb2NrXCI7XG5pbXBvcnQga28gZnJvbSBcImtub2Nrb3V0XCI7XG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuLi8uLi9jb25maWdcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmV2aWV3SW1hZ2VCbG9jayBleHRlbmRzIFByZXZpZXdCbG9jayB7XG4gICAgaW1hZ2U6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+O1xuICAgIGxvYWRpbmc6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIGltYWdlVXJsOiBLbm9ja291dENvbXB1dGVkPHN0cmluZz4gPSBrby5jb21wdXRlZCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuZ2V0SW5pdENvbmZpZygnbWVkaWFfdXJsJykgKyB0aGlzLmltYWdlKCkucmVwbGFjZSgnL21lZGlhLycsICcnKTs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuXG4gICAgdXBsb2FkVXJsKCkge1xuICAgICAgICByZXR1cm4gQ29uZmlnLmdldFBsdWdpbkNvbmZpZygnZ2VuZV93aWRnZXRfdXBsb2FkJywgJ3VwbG9hZF91cmwnKTtcbiAgICB9XG5cbiAgICBhdHRhY2htZW50U3VjY2VzcygpIHtcbiAgICAgICAgcmV0dXJuIChmaWxlOiBhbnksIHJlc3BvbnNlOiBhbnksIGJpbmRLZXk6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmZpbGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RGF0YSA9IHRoaXMucGFyZW50LmRhdGEoKSBhcyBhbnk7XG4gICAgICAgICAgICAgICAgcGFyZW50RGF0YVtiaW5kS2V5XSA9IHJlc3BvbnNlLmZpbGU7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuZGF0YS52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIDUwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJHQoXCJZb3VyIGltYWdlIGNvdWxkIG5vdCBiZSB1cGxvYWRlZFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXR0YWNobWVudERyb3AoKSB7XG4gICAgICAgIHJldHVybiAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBqUXVlcnkoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuZHotZHJhZy1ob3ZlcicpLnJlbW92ZUNsYXNzKCdkei1kcmFnLWhvdmVyJyk7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcodHJ1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXR0YWNobWVudEVycm9yKCkge1xuICAgICAgICB0aGlzLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICBhbGVydCgkdChcIllvdXIgaW1hZ2UgY291bGQgbm90IGJlIHVwbG9hZGVkXCIpKTtcbiAgICB9XG59IiwiaW1wb3J0IFByZXZpZXdCbG9jayBmcm9tIFwiLi9ibG9ja1wiO1xuaW1wb3J0IGtvIGZyb20gXCJrbm9ja291dFwiO1xuaW1wb3J0IENvbmZpZyBmcm9tIFwiLi4vLi4vY29uZmlnXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmV2aWV3SW1hZ2VCbG9jayBleHRlbmRzIFByZXZpZXdCbG9jayB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgICAgICB0aGlzLmltYWdlVXJsID0ga28uY29tcHV0ZWQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2UoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBDb25maWcuZ2V0SW5pdENvbmZpZygnbWVkaWFfdXJsJykgKyB0aGlzLmltYWdlKCkucmVwbGFjZSgnL21lZGlhLycsICcnKTtcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1cGxvYWRVcmwoKSB7XG4gICAgICAgIHJldHVybiBDb25maWcuZ2V0UGx1Z2luQ29uZmlnKCdnZW5lX3dpZGdldF91cGxvYWQnLCAndXBsb2FkX3VybCcpO1xuICAgIH1cbiAgICBhdHRhY2htZW50U3VjY2VzcygpIHtcbiAgICAgICAgcmV0dXJuIChmaWxlLCByZXNwb25zZSwgYmluZEtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmZpbGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50RGF0YSA9IHRoaXMucGFyZW50LmRhdGEoKTtcbiAgICAgICAgICAgICAgICBwYXJlbnREYXRhW2JpbmRLZXldID0gcmVzcG9uc2UuZmlsZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5kYXRhLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJHQoXCJZb3VyIGltYWdlIGNvdWxkIG5vdCBiZSB1cGxvYWRlZFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGF0dGFjaG1lbnREcm9wKCkge1xuICAgICAgICByZXR1cm4gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBqUXVlcnkoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuZHotZHJhZy1ob3ZlcicpLnJlbW92ZUNsYXNzKCdkei1kcmFnLWhvdmVyJyk7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcodHJ1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGF0dGFjaG1lbnRFcnJvcigpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgYWxlcnQoJHQoXCJZb3VyIGltYWdlIGNvdWxkIG5vdCBiZSB1cGxvYWRlZFwiKSk7XG4gICAgfVxufVxuIl19
