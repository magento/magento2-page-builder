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
        /**
         * Retrieve the upload URL from the configuration
         */


        PreviewImageBlock.prototype.uploadUrl = function uploadUrl() {
            return _config2.default.getPluginConfig('gene_widget_upload', 'upload_url');
        };

        PreviewImageBlock.prototype.attachmentSuccess = function attachmentSuccess() {
            var _this2 = this;

            return function (file, response, bindKey) {
                if (response.file) {
                    _this2.parent.stage.store.updateKey(_this2.parent.id, bindKey, response.file);
                    setTimeout(function () {
                        _this2.loading(false);
                    }, 50);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9ibG9jay9wcmV2aWV3L2ltYWdlLnRzIiwiY29tcG9uZW50L2Jsb2NrL3ByZXZpZXcvaW1hZ2UuanMiXSwibmFtZXMiOlsiUHJldmlld0ltYWdlQmxvY2siLCJhcmd1bWVudHMiLCJsb2FkaW5nIiwib2JzZXJ2YWJsZSIsImltYWdlVXJsIiwiY29tcHV0ZWQiLCJpbWFnZSIsImdldEluaXRDb25maWciLCJyZXBsYWNlIiwidXBsb2FkVXJsIiwiZ2V0UGx1Z2luQ29uZmlnIiwiYXR0YWNobWVudFN1Y2Nlc3MiLCJmaWxlIiwicmVzcG9uc2UiLCJiaW5kS2V5IiwicGFyZW50Iiwic3RhZ2UiLCJzdG9yZSIsInVwZGF0ZUtleSIsImlkIiwic2V0VGltZW91dCIsImFsZXJ0IiwiJHQiLCJhdHRhY2htZW50RHJvcCIsImV2ZW50IiwialF1ZXJ5IiwidGFyZ2V0IiwicGFyZW50cyIsInJlbW92ZUNsYXNzIiwiYXR0YWNobWVudEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBU2NBLGlCOzs7QUFBZCxxQ0FBQTtBQUFBOztBQUFBLHlEQ0NRLDBCQUFTQyxTQUFULENERFI7O0FBRUksa0JBQUFDLE9BQUEsR0FBdUMsbUJBQUdDLFVBQUgsQ0FBYyxLQUFkLENBQXZDO0FBQ0Esa0JBQUFDLFFBQUEsR0FBcUMsbUJBQUdDLFFBQUgsQ0FBWSxZQUFBO0FBQzdDLG9CQUFJLE1BQUtDLEtBQUwsRUFBSixFQUFrQjtBQUNkLDJCQUFPLGlCQUFPQyxhQUFQLENBQXFCLFdBQXJCLElBQW9DLE1BQUtELEtBQUwsR0FBYUUsT0FBYixDQUFxQixTQUFyQixFQUFnQyxFQUFoQyxDQUEzQztBQUErRTtBQUNsRjtBQUNELHVCQUFPLEVBQVA7QUFDSCxhQUxvQyxDQUFyQztBQUhKO0FBc0RDO0FBNUNHOzs7OztvQ0FHQUMsUyx3QkFBUztBQUNMLG1CQUFPLGlCQUFPQyxlQUFQLENBQXVCLG9CQUF2QixFQUE2QyxZQUE3QyxDQUFQO0FBQ0gsUzs7b0NBS0RDLGlCLGdDQUFpQjtBQUFBOztBQUNiLG1CQUFPLFVBQUNDLElBQUQsRUFBWUMsUUFBWixFQUEyQkMsT0FBM0IsRUFBdUM7QUFDMUMsb0JBQUlELFNBQVNELElBQWIsRUFBbUI7QUFDZiwyQkFBS0csTUFBTCxDQUFZQyxLQUFaLENBQWtCQyxLQUFsQixDQUF3QkMsU0FBeEIsQ0FDSSxPQUFLSCxNQUFMLENBQVlJLEVBRGhCLEVBRUlMLE9BRkosRUFHSUQsU0FBU0QsSUFIYjtBQUtBUSwrQkFBVyxZQUFBO0FBQ1AsK0JBQUtsQixPQUFMLENBQWEsS0FBYjtBQUNILHFCQUZELEVBRUcsRUFGSDtBQUdILGlCQVRELE1BU087QUFDSG1CLDBCQUFNQyxHQUFHLGtDQUFILENBQU47QUFDSDtBQUNKLGFBYkQ7QUFjSCxTOztvQ0FLREMsYyw2QkFBYztBQUFBOztBQUNWLG1CQUFPLFVBQUNDLEtBQUQsRUFBYTtBQUNoQkMsdUJBQU9ELE1BQU1FLE1BQWIsRUFBcUJDLE9BQXJCLENBQTZCLGdCQUE3QixFQUErQ0MsV0FBL0MsQ0FBMkQsZUFBM0Q7QUFDQSx1QkFBSzFCLE9BQUwsQ0FBYSxJQUFiO0FBQ0gsYUFIRDtBQUlILFM7O29DQUtEMkIsZSw4QkFBZTtBQUNYLGlCQUFLM0IsT0FBTCxDQUFhLEtBQWI7QUFDQW1CLGtCQUFNQyxHQUFHLGtDQUFILENBQU47QUFDSCxTOzs7OztzQkFyRFN0QixpQiIsImZpbGUiOiJjb21wb25lbnQvYmxvY2svcHJldmlldy9pbWFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcmV2aWV3QmxvY2sgZnJvbSBcIi4vYmxvY2tcIjtcbmltcG9ydCBrbyBmcm9tIFwia25vY2tvdXRcIjtcbmltcG9ydCBDb25maWcgZnJvbSBcIi4uLy4uL2NvbmZpZ1wiO1xuXG4vKipcbiAqIFByZXZpZXdJbWFnZUJsb2NrIENsYXNzXG4gKiBcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmV2aWV3SW1hZ2VCbG9jayBleHRlbmRzIFByZXZpZXdCbG9jayB7XG4gICAgaW1hZ2U6IEtub2Nrb3V0T2JzZXJ2YWJsZTxzdHJpbmc+O1xuICAgIGxvYWRpbmc6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIGltYWdlVXJsOiBLbm9ja291dENvbXB1dGVkPHN0cmluZz4gPSBrby5jb21wdXRlZCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmltYWdlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcuZ2V0SW5pdENvbmZpZygnbWVkaWFfdXJsJykgKyB0aGlzLmltYWdlKCkucmVwbGFjZSgnL21lZGlhLycsICcnKTs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHVwbG9hZCBVUkwgZnJvbSB0aGUgY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIHVwbG9hZFVybCgpIHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRQbHVnaW5Db25maWcoJ2dlbmVfd2lkZ2V0X3VwbG9hZCcsICd1cGxvYWRfdXJsJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGRhdGEgd2hlbiBhbiBhdHRhY2htZW50IGlzIHN1Y2Nlc3NmdWxcbiAgICAgKi9cbiAgICBhdHRhY2htZW50U3VjY2VzcygpIHtcbiAgICAgICAgcmV0dXJuIChmaWxlOiBhbnksIHJlc3BvbnNlOiBhbnksIGJpbmRLZXk6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5zdGFnZS5zdG9yZS51cGRhdGVLZXkoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmlkLCBcbiAgICAgICAgICAgICAgICAgICAgYmluZEtleSxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZmlsZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgkdChcIllvdXIgaW1hZ2UgY291bGQgbm90IGJlIHVwbG9hZGVkXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgYW4gYXR0YWNobWVudCBiZWluZyBkcm9wcGVkXG4gICAgICovXG4gICAgYXR0YWNobWVudERyb3AoKSB7XG4gICAgICAgIHJldHVybiAoZXZlbnQ6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBqUXVlcnkoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuZHotZHJhZy1ob3ZlcicpLnJlbW92ZUNsYXNzKCdkei1kcmFnLWhvdmVyJyk7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcodHJ1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGFuIGF0dGFjaG1lbnQgZXJyb3JcbiAgICAgKi9cbiAgICBhdHRhY2htZW50RXJyb3IoKSB7XG4gICAgICAgIHRoaXMubG9hZGluZyhmYWxzZSk7XG4gICAgICAgIGFsZXJ0KCR0KFwiWW91ciBpbWFnZSBjb3VsZCBub3QgYmUgdXBsb2FkZWRcIikpO1xuICAgIH1cbn0iLCJpbXBvcnQgUHJldmlld0Jsb2NrIGZyb20gXCIuL2Jsb2NrXCI7XG5pbXBvcnQga28gZnJvbSBcImtub2Nrb3V0XCI7XG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuLi8uLi9jb25maWdcIjtcbi8qKlxuICogUHJldmlld0ltYWdlQmxvY2sgQ2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJldmlld0ltYWdlQmxvY2sgZXh0ZW5kcyBQcmV2aWV3QmxvY2sge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5pbWFnZVVybCA9IGtvLmNvbXB1dGVkKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29uZmlnLmdldEluaXRDb25maWcoJ21lZGlhX3VybCcpICsgdGhpcy5pbWFnZSgpLnJlcGxhY2UoJy9tZWRpYS8nLCAnJyk7XG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHVwbG9hZCBVUkwgZnJvbSB0aGUgY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIHVwbG9hZFVybCgpIHtcbiAgICAgICAgcmV0dXJuIENvbmZpZy5nZXRQbHVnaW5Db25maWcoJ2dlbmVfd2lkZ2V0X3VwbG9hZCcsICd1cGxvYWRfdXJsJyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBkYXRhIHdoZW4gYW4gYXR0YWNobWVudCBpcyBzdWNjZXNzZnVsXG4gICAgICovXG4gICAgYXR0YWNobWVudFN1Y2Nlc3MoKSB7XG4gICAgICAgIHJldHVybiAoZmlsZSwgcmVzcG9uc2UsIGJpbmRLZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5maWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuc3RhZ2Uuc3RvcmUudXBkYXRlS2V5KHRoaXMucGFyZW50LmlkLCBiaW5kS2V5LCByZXNwb25zZS5maWxlKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgkdChcIllvdXIgaW1hZ2UgY291bGQgbm90IGJlIHVwbG9hZGVkXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSGFuZGxlIGFuIGF0dGFjaG1lbnQgYmVpbmcgZHJvcHBlZFxuICAgICAqL1xuICAgIGF0dGFjaG1lbnREcm9wKCkge1xuICAgICAgICByZXR1cm4gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBqUXVlcnkoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuZHotZHJhZy1ob3ZlcicpLnJlbW92ZUNsYXNzKCdkei1kcmFnLWhvdmVyJyk7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcodHJ1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBhbiBhdHRhY2htZW50IGVycm9yXG4gICAgICovXG4gICAgYXR0YWNobWVudEVycm9yKCkge1xuICAgICAgICB0aGlzLmxvYWRpbmcoZmFsc2UpO1xuICAgICAgICBhbGVydCgkdChcIllvdXIgaW1hZ2UgY291bGQgbm90IGJlIHVwbG9hZGVkXCIpKTtcbiAgICB9XG59XG4iXX0=
