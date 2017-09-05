define(['exports', '../../event-emitter', '../../block/factory', '../../../utils/array'], function (exports, _eventEmitter, _factory, _array) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

    var _factory2 = _interopRequireDefault(_factory);

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

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

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

    var EditableArea = function (_EventEmitter) {
        _inherits(EditableArea, _EventEmitter);

        /**
         * EditableArea constructor
         *
         * @param stage
         */
        function EditableArea(stage) {
            _classCallCheck(this, EditableArea);

            var _this = _possibleConstructorReturn(this, (EditableArea.__proto__ || Object.getPrototypeOf(EditableArea)).call(this));

            _this.title = 'Editable'; // @todo translate
            if (stage) {
                _this.stage = stage;
            }
            return _this;
        }
        /**
         * Set the children observable array into the class
         *
         * @param children
         */


        _createClass(EditableArea, [{
            key: 'setChildren',
            value: function setChildren(children) {
                this.children = children;
            }
        }, {
            key: 'getStage',
            value: function getStage() {
                if (this.stage) {
                    return this.stage;
                }
                if (this instanceof StageInterface) {
                    return this;
                }
            }
        }, {
            key: 'addChild',
            value: function addChild(child, index) {
                child.parent = this;
                child.stage = this.stage;
                if (index) {
                    // Use the arrayUtil function to add the item in the correct place within the array
                    (0, _array.moveArrayItemIntoArray)(child, this.children, index);
                } else {
                    this.children.push(child);
                }
            }
        }, {
            key: 'removeChild',
            value: function removeChild(child) {
                (0, _array.removeArrayItem)(this.children, child);
            }
        }, {
            key: 'onBlockDropped',
            value: function onBlockDropped(event, params) {
                var _this2 = this;

                var index = params.index || 0;
                new Promise(function (resolve, reject) {
                    if (params.block) {
                        return (0, _factory2.default)(params.block.config, _this2, _this2.stage).then(function (block) {
                            _this2.addChild(block, index);
                            resolve(block);
                            block.emit('blockReady');
                        }).catch(function (error) {
                            reject(error);
                        });
                    } else {
                        reject('Parameter block missing from event.');
                    }
                }).catch(function (error) {
                    console.error(error);
                });
            }
        }, {
            key: 'onBlockInstanceDropped',
            value: function onBlockInstanceDropped(event, params) {
                this.addChild(params.blockInstance, params.index);
                /*
                if (ko.processAllDeferredBindingUpdates) {
                    ko.processAllDeferredBindingUpdates();
                }*/
                params.blockInstance.emit('blockMoved');
            }
        }, {
            key: 'onBlockRemoved',
            value: function onBlockRemoved(event, params) {
                params.block.emit('blockBeforeRemoved');
                this.removeChild(params.block);
                /*
                if (ko.processAllDeferredBindingUpdates) {
                    ko.processAllDeferredBindingUpdates();
                }*/
            }
        }, {
            key: 'onBlockSorted',
            value: function onBlockSorted(event, params) {
                var originalIndex = ko.utils.arrayIndexOf(this.children(), params.block);
                if (originalIndex !== params.index) {
                    (0, _array.moveArrayItem)(this.children, originalIndex, params.index);
                }
                params.block.emit('blockMoved');
            }
        }, {
            key: 'onSortStart',
            value: function onSortStart(event, params) {
                var originalEle = jQuery(params.originalEle);
                originalEle.show();
                originalEle.addClass('bluefoot-sorting-original');
                // Reset the width & height of the helper
                jQuery(params.helper).css({ width: '', height: '' }).html(jQuery('<h3 />').text(this.title).html());
            }
        }, {
            key: 'onSortStop',
            value: function onSortStop(event, params) {
                jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
            }
        }]);

        return EditableArea;
    }(_eventEmitter2.default);

    exports.default = EditableArea;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEudHMiXSwibmFtZXMiOlsiRWRpdGFibGVBcmVhIiwic3RhZ2UiLCJ0aXRsZSIsImNoaWxkcmVuIiwiU3RhZ2VJbnRlcmZhY2UiLCJjaGlsZCIsImluZGV4IiwicGFyZW50IiwicHVzaCIsImV2ZW50IiwicGFyYW1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9jayIsImNvbmZpZyIsInRoZW4iLCJhZGRDaGlsZCIsImVtaXQiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImJsb2NrSW5zdGFuY2UiLCJyZW1vdmVDaGlsZCIsIm9yaWdpbmFsSW5kZXgiLCJrbyIsInV0aWxzIiwiYXJyYXlJbmRleE9mIiwib3JpZ2luYWxFbGUiLCJqUXVlcnkiLCJzaG93IiwiYWRkQ2xhc3MiLCJoZWxwZXIiLCJjc3MiLCJ3aWR0aCIsImhlaWdodCIsImh0bWwiLCJ0ZXh0IiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZWNBLFk7OztBQUtWOzs7OztBQUtBLDhCQUFZQyxLQUFaLEVBQWtDO0FBQUE7O0FBQUE7O0FBUGxDLGtCQUFBQyxLQUFBLEdBQWdCLFVBQWhCLENBT2tDLENBUE47QUFTeEIsZ0JBQUlELEtBQUosRUFBVztBQUNQLHNCQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDSDtBQUo2QjtBQUtqQztBQUVEOzs7Ozs7Ozs7d0NBS3NCRSxRLEVBQXNDO0FBQ3hELHFCQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNIOzs7dUNBT087QUFDSixvQkFBSSxLQUFLRixLQUFULEVBQWdCO0FBQ1osMkJBQU8sS0FBS0EsS0FBWjtBQUNIO0FBRUQsb0JBQUksZ0JBQWdCRyxjQUFwQixFQUFvQztBQUNoQywyQkFBTyxJQUFQO0FBQ0g7QUFDSjs7O3FDQVFRQyxLLEVBQTRCQyxLLEVBQWM7QUFDL0NELHNCQUFNRSxNQUFOLEdBQWUsSUFBZjtBQUNBRixzQkFBTUosS0FBTixHQUFjLEtBQUtBLEtBQW5CO0FBQ0Esb0JBQUlLLEtBQUosRUFBVztBQUNQO0FBQ0EsdURBQXVCRCxLQUF2QixFQUE4QixLQUFLRixRQUFuQyxFQUE2Q0csS0FBN0M7QUFDSCxpQkFIRCxNQUdPO0FBQ0gseUJBQUtILFFBQUwsQ0FBY0ssSUFBZCxDQUFtQkgsS0FBbkI7QUFDSDtBQUNKOzs7d0NBT1dBLEssRUFBVTtBQUNsQiw0Q0FBZ0IsS0FBS0YsUUFBckIsRUFBK0JFLEtBQS9CO0FBQ0g7OzsyQ0FTY0ksSyxFQUFjQyxNLEVBQTBCO0FBQUE7O0FBQ25ELG9CQUFJSixRQUFRSSxPQUFPSixLQUFQLElBQWdCLENBQTVCO0FBRUEsb0JBQUlLLE9BQUosQ0FBNEIsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQWdCO0FBQ3hDLHdCQUFJSCxPQUFPSSxLQUFYLEVBQWtCO0FBQ2QsK0JBQU8sdUJBQVlKLE9BQU9JLEtBQVAsQ0FBYUMsTUFBekIsVUFBdUMsT0FBS2QsS0FBNUMsRUFBbURlLElBQW5ELENBQXdELFVBQUNGLEtBQUQsRUFBYTtBQUN4RSxtQ0FBS0csUUFBTCxDQUFjSCxLQUFkLEVBQXFCUixLQUFyQjtBQUNBTSxvQ0FBUUUsS0FBUjtBQUNBQSxrQ0FBTUksSUFBTixDQUFXLFlBQVg7QUFDSCx5QkFKTSxFQUlKQyxLQUpJLENBSUUsVUFBVUMsS0FBVixFQUF1QjtBQUM1QlAsbUNBQU9PLEtBQVA7QUFDSCx5QkFOTSxDQUFQO0FBT0gscUJBUkQsTUFRTztBQUNIUCwrQkFBTyxxQ0FBUDtBQUNIO0FBQ0osaUJBWkQsRUFZR00sS0FaSCxDQVlTLFVBQVVDLEtBQVYsRUFBZTtBQUNwQkMsNEJBQVFELEtBQVIsQ0FBY0EsS0FBZDtBQUNILGlCQWREO0FBZUg7OzttREFRc0JYLEssRUFBY0MsTSxFQUFrQztBQUNuRSxxQkFBS08sUUFBTCxDQUFjUCxPQUFPWSxhQUFyQixFQUFvQ1osT0FBT0osS0FBM0M7QUFFQTs7OztBQUtBSSx1QkFBT1ksYUFBUCxDQUFxQkosSUFBckIsQ0FBMEIsWUFBMUI7QUFDSDs7OzJDQVFjVCxLLEVBQWNDLE0sRUFBMEI7QUFDbkRBLHVCQUFPSSxLQUFQLENBQWFJLElBQWIsQ0FBa0Isb0JBQWxCO0FBQ0EscUJBQUtLLFdBQUwsQ0FBaUJiLE9BQU9JLEtBQXhCO0FBRUE7Ozs7QUFJSDs7OzBDQVFhTCxLLEVBQWNDLE0sRUFBeUI7QUFDakQsb0JBQUljLGdCQUFnQkMsR0FBR0MsS0FBSCxDQUFTQyxZQUFULENBQXNCLEtBQUt4QixRQUFMLEVBQXRCLEVBQXVDTyxPQUFPSSxLQUE5QyxDQUFwQjtBQUNBLG9CQUFJVSxrQkFBa0JkLE9BQU9KLEtBQTdCLEVBQW9DO0FBQ2hDLDhDQUFjLEtBQUtILFFBQW5CLEVBQTZCcUIsYUFBN0IsRUFBNENkLE9BQU9KLEtBQW5EO0FBQ0g7QUFDREksdUJBQU9JLEtBQVAsQ0FBYUksSUFBYixDQUFrQixZQUFsQjtBQUNIOzs7d0NBUVdULEssRUFBY0MsTSxFQUFrQjtBQUN4QyxvQkFBSWtCLGNBQWNDLE9BQU9uQixPQUFPa0IsV0FBZCxDQUFsQjtBQUNBQSw0QkFBWUUsSUFBWjtBQUNBRiw0QkFBWUcsUUFBWixDQUFxQiwyQkFBckI7QUFFQTtBQUNBRix1QkFBT25CLE9BQU9zQixNQUFkLEVBQ0tDLEdBREwsQ0FDUyxFQUFDQyxPQUFPLEVBQVIsRUFBWUMsUUFBUSxFQUFwQixFQURULEVBRUtDLElBRkwsQ0FFVVAsT0FBTyxRQUFQLEVBQWlCUSxJQUFqQixDQUFzQixLQUFLbkMsS0FBM0IsRUFBa0NrQyxJQUFsQyxFQUZWO0FBR0g7Ozt1Q0FRVTNCLEssRUFBY0MsTSxFQUFrQjtBQUN2Q21CLHVCQUFPbkIsT0FBT2tCLFdBQWQsRUFBMkJVLFdBQTNCLENBQXVDLDJCQUF2QztBQUNIOzs7Ozs7c0JBdEtTdEMsWSIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi8uLi9ldmVudC1lbWl0dGVyJztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBCbG9jayBhcyBCbG9ja0ludGVyZmFjZSB9IGZyb20gJy4uLy4uL2Jsb2NrL2Jsb2NrLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSAnLi9hYnN0cmFjdC5kJztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCBjcmVhdGVCbG9jayBmcm9tICcuLi8uLi9ibG9jay9mYWN0b3J5JztcblxuaW1wb3J0IHsgbW92ZUFycmF5SXRlbUludG9BcnJheSwgbW92ZUFycmF5SXRlbSwgcmVtb3ZlQXJyYXlJdGVtIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHtCbG9ja30gZnJvbSBcIi4uLy4uL2Jsb2NrL2Jsb2NrXCI7XG5cbi8qKlxuICogQ2xhc3MgRWRpdGFibGVBcmVhXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRhYmxlQXJlYSBleHRlbmRzIEV2ZW50RW1pdHRlciBpbXBsZW1lbnRzIEVkaXRhYmxlQXJlYUludGVyZmFjZSB7XG4gICAgY2hpbGRyZW46IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT47XG4gICAgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlO1xuICAgIHRpdGxlOiBzdHJpbmcgPSAnRWRpdGFibGUnOyAvLyBAdG9kbyB0cmFuc2xhdGVcblxuICAgIC8qKlxuICAgICAqIEVkaXRhYmxlQXJlYSBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RhZ2U/OiBTdGFnZUludGVyZmFjZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoc3RhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgY2hpbGRyZW4gb2JzZXJ2YWJsZSBhcnJheSBpbnRvIHRoZSBjbGFzc1xuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkcmVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldENoaWxkcmVuKGNoaWxkcmVuOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+KSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgc3RhZ2UgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTdGFnZUludGVyZmFjZX1cbiAgICAgKi9cbiAgICBnZXRTdGFnZSgpOiBTdGFnZUludGVyZmFjZSB7XG4gICAgICAgIGlmICh0aGlzLnN0YWdlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgU3RhZ2VJbnRlcmZhY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY2hpbGQgaW50byB0aGUgb2JzZXJ2YWJsZSBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgYWRkQ2hpbGQoY2hpbGQ6IFN0cnVjdHVyYWxJbnRlcmZhY2UsIGluZGV4PzogbnVtYmVyKSA6dm9pZCB7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIGNoaWxkLnN0YWdlID0gdGhpcy5zdGFnZTtcbiAgICAgICAgaWYgKGluZGV4KSB7XG4gICAgICAgICAgICAvLyBVc2UgdGhlIGFycmF5VXRpbCBmdW5jdGlvbiB0byBhZGQgdGhlIGl0ZW0gaW4gdGhlIGNvcnJlY3QgcGxhY2Ugd2l0aGluIHRoZSBhcnJheVxuICAgICAgICAgICAgbW92ZUFycmF5SXRlbUludG9BcnJheShjaGlsZCwgdGhpcy5jaGlsZHJlbiwgaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNoaWxkIGZyb20gdGhlIG9ic2VydmFibGUgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkKGNoaWxkOiBhbnkpIDp2b2lkIHtcbiAgICAgICAgcmVtb3ZlQXJyYXlJdGVtKHRoaXMuY2hpbGRyZW4sIGNoaWxkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgYSBibG9jayBiZWluZyBkcm9wcGVkIGludG8gdGhlIHN0cnVjdHVyYWwgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEJsb2NrfFQ+fVxuICAgICAqL1xuICAgIG9uQmxvY2tEcm9wcGVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja0Ryb3BwZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IGluZGV4ID0gcGFyYW1zLmluZGV4IHx8IDA7XG5cbiAgICAgICAgbmV3IFByb21pc2U8QmxvY2tJbnRlcmZhY2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuYmxvY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQmxvY2socGFyYW1zLmJsb2NrLmNvbmZpZywgdGhpcywgdGhpcy5zdGFnZSkudGhlbigoYmxvY2s6IEJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoYmxvY2ssIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmVtaXQoJ2Jsb2NrUmVhZHknKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3I6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoJ1BhcmFtZXRlciBibG9jayBtaXNzaW5nIGZyb20gZXZlbnQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhcHR1cmUgYSBibG9jayBpbnN0YW5jZSBiZWluZyBkcm9wcGVkIG9udG8gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja0luc3RhbmNlRHJvcHBlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tJbnN0YW5jZURyb3BwZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChwYXJhbXMuYmxvY2tJbnN0YW5jZSwgcGFyYW1zLmluZGV4KTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoa28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMpIHtcbiAgICAgICAgICAgIGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKCk7XG4gICAgICAgIH0qL1xuXG4gICAgICAgIHBhcmFtcy5ibG9ja0luc3RhbmNlLmVtaXQoJ2Jsb2NrTW92ZWQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnQgdG8gcmVtb3ZlIGJsb2NrXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja1JlbW92ZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrUmVtb3ZlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBwYXJhbXMuYmxvY2suZW1pdCgnYmxvY2tCZWZvcmVSZW1vdmVkJyk7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQocGFyYW1zLmJsb2NrKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoa28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMpIHtcbiAgICAgICAgICAgIGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKCk7XG4gICAgICAgIH0qL1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBldmVudCB3aGVuIGEgYmxvY2sgaXMgc29ydGVkIHdpdGhpbiBpdCdzIGN1cnJlbnQgY29udGFpbmVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja1NvcnRlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tTb3J0ZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsSW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YodGhpcy5jaGlsZHJlbigpLCBwYXJhbXMuYmxvY2spO1xuICAgICAgICBpZiAob3JpZ2luYWxJbmRleCAhPT0gcGFyYW1zLmluZGV4KSB7XG4gICAgICAgICAgICBtb3ZlQXJyYXlJdGVtKHRoaXMuY2hpbGRyZW4sIG9yaWdpbmFsSW5kZXgsIHBhcmFtcy5pbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1zLmJsb2NrLmVtaXQoJ2Jsb2NrTW92ZWQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBjYWxsZWQgd2hlbiBzdGFydGluZyBzdGFydHMgb24gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25Tb3J0U3RhcnQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IFNvcnRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsRWxlID0galF1ZXJ5KHBhcmFtcy5vcmlnaW5hbEVsZSk7XG4gICAgICAgIG9yaWdpbmFsRWxlLnNob3coKTtcbiAgICAgICAgb3JpZ2luYWxFbGUuYWRkQ2xhc3MoJ2JsdWVmb290LXNvcnRpbmctb3JpZ2luYWwnKTtcblxuICAgICAgICAvLyBSZXNldCB0aGUgd2lkdGggJiBoZWlnaHQgb2YgdGhlIGhlbHBlclxuICAgICAgICBqUXVlcnkocGFyYW1zLmhlbHBlcilcbiAgICAgICAgICAgIC5jc3Moe3dpZHRoOiAnJywgaGVpZ2h0OiAnJ30pXG4gICAgICAgICAgICAuaHRtbChqUXVlcnkoJzxoMyAvPicpLnRleHQodGhpcy50aXRsZSkuaHRtbCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBjYWxsZWQgd2hlbiBzb3J0aW5nIHN0b3BzIG9uIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uU29ydFN0b3AoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IFNvcnRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5vcmlnaW5hbEVsZSkucmVtb3ZlQ2xhc3MoJ2JsdWVmb290LXNvcnRpbmctb3JpZ2luYWwnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tEcm9wcGVkUGFyYW1zIHtcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIGJsb2NrOiB7XG4gICAgICAgIGNvbmZpZzogb2JqZWN0XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrSW5zdGFuY2VEcm9wcGVkUGFyYW1zIHtcbiAgICBibG9ja0luc3RhbmNlOiBCbG9jayxcbiAgICBpbmRleD86IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrUmVtb3ZlZFBhcmFtcyB7XG4gICAgYmxvY2s6IEJsb2NrXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tTb3J0ZWRQYXJhbXMge1xuICAgIGJsb2NrOiBCbG9ja1xuICAgIGluZGV4OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTb3J0UGFyYW1zIHtcbiAgICBvcmlnaW5hbEVsZTogSlF1ZXJ5XG4gICAgcGxhY2Vob2xkZXI6IEpRdWVyeVxuICAgIGhlbHBlcj86IGFueVxufSJdfQ==
