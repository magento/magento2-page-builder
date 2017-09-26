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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9wcmV2aWV3L2ltYWdlLnRzIiwiY29tcG9uZW50L2Jsb2NrL3ByZXZpZXcvaW1hZ2UuanMiXSwibmFtZXMiOlsiUHJldmlld0ltYWdlQmxvY2siLCJhcmd1bWVudHMiLCJsb2FkaW5nIiwib2JzZXJ2YWJsZSIsImltYWdlVXJsIiwiY29tcHV0ZWQiLCJpbWFnZSIsImdldEluaXRDb25maWciLCJyZXBsYWNlIiwidXBsb2FkVXJsIiwiZ2V0UGx1Z2luQ29uZmlnIiwiYXR0YWNobWVudFN1Y2Nlc3MiLCJmaWxlIiwicmVzcG9uc2UiLCJiaW5kS2V5IiwicGFyZW50RGF0YSIsInBhcmVudCIsImRhdGEiLCJ2YWx1ZUhhc011dGF0ZWQiLCJzZXRUaW1lb3V0IiwiYmluZCIsImFsZXJ0IiwiJHQiLCJhdHRhY2htZW50RHJvcCIsImV2ZW50IiwialF1ZXJ5IiwidGFyZ2V0IiwicGFyZW50cyIsInJlbW92ZUNsYXNzIiwiYXR0YWNobWVudEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBS2NBLGlCOzs7QUFBZCxxQ0FBQTtBQUFBOztBQUFBLHlEQ0FRLDBCQUFTQyxTQUFULENEQVI7O0FBRUksa0JBQUFDLE9BQUEsR0FBdUMsbUJBQUdDLFVBQUgsQ0FBYyxLQUFkLENBQXZDO0FBQ0Esa0JBQUFDLFFBQUEsR0FBcUMsbUJBQUdDLFFBQUgsQ0FBWSxZQUFBO0FBQzdDLG9CQUFJLE1BQUtDLEtBQUwsRUFBSixFQUFrQjtBQUNkLDJCQUFPLGlCQUFPQyxhQUFQLENBQXFCLFdBQXJCLElBQW9DLE1BQUtELEtBQUwsR0FBYUUsT0FBYixDQUFxQixTQUFyQixFQUFnQyxFQUFoQyxDQUEzQztBQUErRTtBQUNsRjtBQUNELHVCQUFPLEVBQVA7QUFDSCxhQUxvQyxDQUFyQztBQUhKO0FBd0NDOztvQ0E5QkdDLFMsd0JBQVM7QUFDTCxtQkFBTyxpQkFBT0MsZUFBUCxDQUF1QixvQkFBdkIsRUFBNkMsWUFBN0MsQ0FBUDtBQUNILFM7O29DQUVEQyxpQixnQ0FBaUI7QUFBQTs7QUFDYixtQkFBTyxVQUFDQyxJQUFELEVBQVlDLFFBQVosRUFBMkJDLE9BQTNCLEVBQXVDO0FBQzFDLG9CQUFJRCxTQUFTRCxJQUFiLEVBQW1CO0FBQ2Ysd0JBQUlHLGFBQWEsT0FBS0MsTUFBTCxDQUFZQyxJQUFaLEVBQWpCO0FBQ0FGLCtCQUFXRCxPQUFYLElBQXNCRCxTQUFTRCxJQUEvQjtBQUNBLDJCQUFLSSxNQUFMLENBQVlDLElBQVosQ0FBaUJDLGVBQWpCO0FBQ0FDLCtCQUFXLFlBQUE7QUFDUCw2QkFBS2pCLE9BQUwsQ0FBYSxLQUFiO0FBQ0gscUJBRlUsQ0FFVGtCLElBRlMsUUFBWCxFQUVjLEVBRmQ7QUFHSCxpQkFQRCxNQU9PO0FBQ0hDLDBCQUFNQyxHQUFHLGtDQUFILENBQU47QUFDSDtBQUNKLGFBWEQ7QUFZSCxTOztvQ0FFREMsYyw2QkFBYztBQUFBOztBQUNWLG1CQUFPLFVBQUNDLEtBQUQsRUFBYTtBQUNoQkMsdUJBQU9ELE1BQU1FLE1BQWIsRUFBcUJDLE9BQXJCLENBQTZCLGdCQUE3QixFQUErQ0MsV0FBL0MsQ0FBMkQsZUFBM0Q7QUFDQSx1QkFBSzFCLE9BQUwsQ0FBYSxJQUFiO0FBQ0gsYUFIRDtBQUlILFM7O29DQUVEMkIsZSw4QkFBZTtBQUNYLGlCQUFLM0IsT0FBTCxDQUFhLEtBQWI7QUFDQW1CLGtCQUFNQyxHQUFHLGtDQUFILENBQU47QUFDSCxTOzs7OztzQkF2Q1N0QixpQiIsImZpbGUiOiJjb21wb25lbnQvYmxvY2svcHJldmlldy9pbWFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcmV2aWV3QmxvY2sgZnJvbSBcIi4vYmxvY2tcIjtcbmltcG9ydCBrbyBmcm9tIFwia25vY2tvdXRcIjtcbmltcG9ydCBDb25maWcgZnJvbSBcIi4uLy4uL2NvbmZpZ1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXZpZXdJbWFnZUJsb2NrIGV4dGVuZHMgUHJldmlld0Jsb2NrIHtcbiAgICBpbWFnZTogS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz47XG4gICAgbG9hZGluZzogS25vY2tvdXRPYnNlcnZhYmxlPGJvb2xlYW4+ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgaW1hZ2VVcmw6IEtub2Nrb3V0Q29tcHV0ZWQ8c3RyaW5nPiA9IGtvLmNvbXB1dGVkKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UoKSkge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRJbml0Q29uZmlnKCdtZWRpYV91cmwnKSArIHRoaXMuaW1hZ2UoKS5yZXBsYWNlKCcvbWVkaWEvJywgJycpOztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfSk7XG5cbiAgICB1cGxvYWRVcmwoKSB7XG4gICAgICAgIHJldHVybiBDb25maWcuZ2V0UGx1Z2luQ29uZmlnKCdnZW5lX3dpZGdldF91cGxvYWQnLCAndXBsb2FkX3VybCcpO1xuICAgIH1cblxuICAgIGF0dGFjaG1lbnRTdWNjZXNzKCkge1xuICAgICAgICByZXR1cm4gKGZpbGU6IGFueSwgcmVzcG9uc2U6IGFueSwgYmluZEtleTogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZmlsZSkge1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnREYXRhID0gdGhpcy5wYXJlbnQuZGF0YSgpIGFzIGFueTtcbiAgICAgICAgICAgICAgICBwYXJlbnREYXRhW2JpbmRLZXldID0gcmVzcG9uc2UuZmlsZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5kYXRhLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgNTApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgkdChcIllvdXIgaW1hZ2UgY291bGQgbm90IGJlIHVwbG9hZGVkXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhdHRhY2htZW50RHJvcCgpIHtcbiAgICAgICAgcmV0dXJuIChldmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGpRdWVyeShldmVudC50YXJnZXQpLnBhcmVudHMoJy5kei1kcmFnLWhvdmVyJykucmVtb3ZlQ2xhc3MoJ2R6LWRyYWctaG92ZXInKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyh0cnVlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhdHRhY2htZW50RXJyb3IoKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgICAgIGFsZXJ0KCR0KFwiWW91ciBpbWFnZSBjb3VsZCBub3QgYmUgdXBsb2FkZWRcIikpO1xuICAgIH1cbn0iLCJpbXBvcnQgUHJldmlld0Jsb2NrIGZyb20gXCIuL2Jsb2NrXCI7XG5pbXBvcnQga28gZnJvbSBcImtub2Nrb3V0XCI7XG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuLi8uLi9jb25maWdcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXZpZXdJbWFnZUJsb2NrIGV4dGVuZHMgUHJldmlld0Jsb2NrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgICAgIHRoaXMuaW1hZ2VVcmwgPSBrby5jb21wdXRlZCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbWFnZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRJbml0Q29uZmlnKCdtZWRpYV91cmwnKSArIHRoaXMuaW1hZ2UoKS5yZXBsYWNlKCcvbWVkaWEvJywgJycpO1xuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwbG9hZFVybCgpIHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRQbHVnaW5Db25maWcoJ2dlbmVfd2lkZ2V0X3VwbG9hZCcsICd1cGxvYWRfdXJsJyk7XG4gICAgfVxuICAgIGF0dGFjaG1lbnRTdWNjZXNzKCkge1xuICAgICAgICByZXR1cm4gKGZpbGUsIHJlc3BvbnNlLCBiaW5kS2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZmlsZSkge1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnREYXRhID0gdGhpcy5wYXJlbnQuZGF0YSgpO1xuICAgICAgICAgICAgICAgIHBhcmVudERhdGFbYmluZEtleV0gPSByZXNwb25zZS5maWxlO1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmRhdGEudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCA1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgkdChcIllvdXIgaW1hZ2UgY291bGQgbm90IGJlIHVwbG9hZGVkXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXR0YWNobWVudERyb3AoKSB7XG4gICAgICAgIHJldHVybiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGpRdWVyeShldmVudC50YXJnZXQpLnBhcmVudHMoJy5kei1kcmFnLWhvdmVyJykucmVtb3ZlQ2xhc3MoJ2R6LWRyYWctaG92ZXInKTtcbiAgICAgICAgICAgIHRoaXMubG9hZGluZyh0cnVlKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXR0YWNobWVudEVycm9yKCkge1xuICAgICAgICB0aGlzLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICBhbGVydCgkdChcIllvdXIgaW1hZ2UgY291bGQgbm90IGJlIHVwbG9hZGVkXCIpKTtcbiAgICB9XG59XG4iXX0=
