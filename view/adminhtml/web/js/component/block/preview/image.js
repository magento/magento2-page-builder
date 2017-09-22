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
                    _this2.parent.data()[bindKey] = response.file;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9wcmV2aWV3L2ltYWdlLnRzIiwiY29tcG9uZW50L2Jsb2NrL3ByZXZpZXcvaW1hZ2UuanMiXSwibmFtZXMiOlsiUHJldmlld0ltYWdlQmxvY2siLCJhcmd1bWVudHMiLCJsb2FkaW5nIiwib2JzZXJ2YWJsZSIsImltYWdlVXJsIiwiY29tcHV0ZWQiLCJpbWFnZSIsImdldEluaXRDb25maWciLCJyZXBsYWNlIiwidXBsb2FkVXJsIiwiZ2V0UGx1Z2luQ29uZmlnIiwiYXR0YWNobWVudFN1Y2Nlc3MiLCJmaWxlIiwicmVzcG9uc2UiLCJiaW5kS2V5IiwicGFyZW50IiwiZGF0YSIsInZhbHVlSGFzTXV0YXRlZCIsInNldFRpbWVvdXQiLCJiaW5kIiwiYWxlcnQiLCIkdCIsImF0dGFjaG1lbnREcm9wIiwiZXZlbnQiLCJqUXVlcnkiLCJ0YXJnZXQiLCJwYXJlbnRzIiwicmVtb3ZlQ2xhc3MiLCJhdHRhY2htZW50RXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFLY0EsaUI7OztBQUFkLHFDQUFBO0FBQUE7O0FBQUEseURDQVEsMEJBQVNDLFNBQVQsQ0RBUjs7QUFFSSxrQkFBQUMsT0FBQSxHQUF1QyxtQkFBR0MsVUFBSCxDQUFjLEtBQWQsQ0FBdkM7QUFDQSxrQkFBQUMsUUFBQSxHQUFxQyxtQkFBR0MsUUFBSCxDQUFZLFlBQUE7QUFDN0Msb0JBQUksTUFBS0MsS0FBTCxFQUFKLEVBQWtCO0FBQ2QsMkJBQU8saUJBQU9DLGFBQVAsQ0FBcUIsV0FBckIsSUFBb0MsTUFBS0QsS0FBTCxHQUFhRSxPQUFiLENBQXFCLFNBQXJCLEVBQWdDLEVBQWhDLENBQTNDO0FBQStFO0FBQ2xGO0FBQ0QsdUJBQU8sRUFBUDtBQUNILGFBTG9DLENBQXJDO0FBSEo7QUF1Q0M7O29DQTdCR0MsUyx3QkFBUztBQUNMLG1CQUFPLGlCQUFPQyxlQUFQLENBQXVCLG9CQUF2QixFQUE2QyxZQUE3QyxDQUFQO0FBQ0gsUzs7b0NBRURDLGlCLGdDQUFpQjtBQUFBOztBQUNiLG1CQUFPLFVBQUNDLElBQUQsRUFBT0MsUUFBUCxFQUFpQkMsT0FBakIsRUFBd0I7QUFDM0Isb0JBQUlELFNBQVNELElBQWIsRUFBbUI7QUFDZiwyQkFBS0csTUFBTCxDQUFZQyxJQUFaLEdBQW1CRixPQUFuQixJQUE4QkQsU0FBU0QsSUFBdkM7QUFDQSwyQkFBS0csTUFBTCxDQUFZQyxJQUFaLENBQWlCQyxlQUFqQjtBQUNBQywrQkFBVyxZQUFBO0FBQ1AsNkJBQUtoQixPQUFMLENBQWEsS0FBYjtBQUNILHFCQUZVLENBRVRpQixJQUZTLFFBQVgsRUFFYyxFQUZkO0FBR0gsaUJBTkQsTUFNTztBQUNIQywwQkFBTUMsR0FBRyxrQ0FBSCxDQUFOO0FBQ0g7QUFDSixhQVZEO0FBV0gsUzs7b0NBRURDLGMsNkJBQWM7QUFBQTs7QUFDVixtQkFBTyxVQUFDQyxLQUFELEVBQU07QUFDVEMsdUJBQU9ELE1BQU1FLE1BQWIsRUFBcUJDLE9BQXJCLENBQTZCLGdCQUE3QixFQUErQ0MsV0FBL0MsQ0FBMkQsZUFBM0Q7QUFDQSx1QkFBS3pCLE9BQUwsQ0FBYSxJQUFiO0FBQ0gsYUFIRDtBQUlILFM7O29DQUVEMEIsZSw4QkFBZTtBQUNYLGlCQUFLMUIsT0FBTCxDQUFhLEtBQWI7QUFDQWtCLGtCQUFNQyxHQUFHLGtDQUFILENBQU47QUFDSCxTOzs7OztzQkF0Q1NyQixpQiIsImZpbGUiOiJjb21wb25lbnQvYmxvY2svcHJldmlldy9pbWFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcmV2aWV3QmxvY2sgZnJvbSBcIi4vYmxvY2tcIjtcbmltcG9ydCBrbyBmcm9tIFwia25vY2tvdXRcIjtcbmltcG9ydCBDb25maWcgZnJvbSBcIi4uLy4uL2NvbmZpZ1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXZpZXdJbWFnZUJsb2NrIGV4dGVuZHMgUHJldmlld0Jsb2NrIHtcbiAgICBpbWFnZTogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz47XG4gICAgbG9hZGluZzogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgaW1hZ2VVcmw6IEtub2Nrb3V0Q29tcHV0ZWQ8c3RyaW5nPiA9IGtvLmNvbXB1dGVkKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UoKSkge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRJbml0Q29uZmlnKCdtZWRpYV91cmwnKSArIHRoaXMuaW1hZ2UoKS5yZXBsYWNlKCcvbWVkaWEvJywgJycpOztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG5cbiAgICB1cGxvYWRVcmwoKSB7XG4gICAgICAgIHJldHVybiBDb25maWcuZ2V0UGx1Z2luQ29uZmlnKCdnZW5lX3dpZGdldF91cGxvYWQnLCAndXBsb2FkX3VybCcpO1xuICAgIH1cblxuICAgIGF0dGFjaG1lbnRTdWNjZXNzKCkge1xuICAgICAgICByZXR1cm4gKGZpbGUsIHJlc3BvbnNlLCBiaW5kS2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmRhdGEoKVtiaW5kS2V5XSA9IHJlc3BvbnNlLmZpbGU7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuZGF0YS52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIDUwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJHQoXCJZb3VyIGltYWdlIGNvdWxkIG5vdCBiZSB1cGxvYWRlZFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXR0YWNobWVudERyb3AoKSB7XG4gICAgICAgIHJldHVybiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGpRdWVyeShldmVudC50YXJnZXQpLnBhcmVudHMoJy5kei1kcmFnLWhvdmVyJykucmVtb3ZlQ2xhc3MoJ2R6LWRyYWctaG92ZXInKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyh0cnVlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhdHRhY2htZW50RXJyb3IoKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgICAgIGFsZXJ0KCR0KFwiWW91ciBpbWFnZSBjb3VsZCBub3QgYmUgdXBsb2FkZWRcIikpO1xuICAgIH1cbn0iLCJpbXBvcnQgUHJldmlld0Jsb2NrIGZyb20gXCIuL2Jsb2NrXCI7XG5pbXBvcnQga28gZnJvbSBcImtub2Nrb3V0XCI7XG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuLi8uLi9jb25maWdcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXZpZXdJbWFnZUJsb2NrIGV4dGVuZHMgUHJldmlld0Jsb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgICAgIHRoaXMuaW1hZ2VVcmwgPSBrby5jb21wdXRlZCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbWFnZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRJbml0Q29uZmlnKCdtZWRpYV91cmwnKSArIHRoaXMuaW1hZ2UoKS5yZXBsYWNlKCcvbWVkaWEvJywgJycpO1xuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwbG9hZFVybCgpIHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRQbHVnaW5Db25maWcoJ2dlbmVfd2lkZ2V0X3VwbG9hZCcsICd1cGxvYWRfdXJsJyk7XG4gICAgfVxuICAgIGF0dGFjaG1lbnRTdWNjZXNzKCkge1xuICAgICAgICByZXR1cm4gKGZpbGUsIHJlc3BvbnNlLCBiaW5kS2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmRhdGEoKVtiaW5kS2V5XSA9IHJlc3BvbnNlLmZpbGU7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuZGF0YS52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIDUwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCR0KFwiWW91ciBpbWFnZSBjb3VsZCBub3QgYmUgdXBsb2FkZWRcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBhdHRhY2htZW50RHJvcCgpIHtcbiAgICAgICAgcmV0dXJuIChldmVudCkgPT4ge1xuICAgICAgICAgICAgalF1ZXJ5KGV2ZW50LnRhcmdldCkucGFyZW50cygnLmR6LWRyYWctaG92ZXInKS5yZW1vdmVDbGFzcygnZHotZHJhZy1ob3ZlcicpO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nKHRydWUpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBhdHRhY2htZW50RXJyb3IoKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgICAgIGFsZXJ0KCR0KFwiWW91ciBpbWFnZSBjb3VsZCBub3QgYmUgdXBsb2FkZWRcIikpO1xuICAgIH1cbn1cbiJdfQ==
