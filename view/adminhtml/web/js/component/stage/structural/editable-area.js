define(['exports', '../../event-emitter', '../../block/factory', '../../../utils/array', 'underscore', 'knockout'], function (exports, _eventEmitter, _factory, _array, _underscore, _knockout) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

    var _factory2 = _interopRequireDefault(_factory);

    var _underscore2 = _interopRequireDefault(_underscore);

    var _knockout2 = _interopRequireDefault(_knockout);

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

    var EditableArea = function (_EventEmitter) {
        _inherits(EditableArea, _EventEmitter);

        /**
         * EditableArea constructor
         *
         * @param stage
         */
        function EditableArea(stage) {
            _classCallCheck(this, EditableArea);

            var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

            _this.title = 'Editable'; // @todo translate
            if (stage) {
                _this.stage = stage;
            }
            _underscore2.default.bindAll(_this, 'onBlockDropped', 'onBlockInstanceDropped', 'onBlockRemoved', 'onBlockSorted', 'onSortStart', 'onSortStop');
            // Attach events to structural elements
            // Block dropped from left hand panel
            _this.on('blockDropped', _this.onBlockDropped);
            // Block instance being moved between structural elements
            _this.on('blockInstanceDropped', _this.onBlockInstanceDropped);
            _this.on('blockRemoved', _this.onBlockRemoved);
            // Block sorted within the same structural element
            _this.on('blockSorted', _this.onBlockSorted);
            _this.on('sortStart', _this.onSortStart);
            _this.on('sortStop', _this.onSortStop);
            return _this;
        }
        /**
         * Set the children observable array into the class
         *
         * @param children
         */


        EditableArea.prototype.setChildren = function setChildren(children) {
            this.children = children;
        };

        EditableArea.prototype.getStage = function getStage() {
            return this.stage;
        };

        EditableArea.prototype.addChild = function addChild(child, index) {
            child.parent = this;
            child.stage = this.stage;
            if (index) {
                // Use the arrayUtil function to add the item in the correct place within the array
                (0, _array.moveArrayItemIntoArray)(child, this.children, index);
            } else {
                this.children.push(child);
            }
        };

        EditableArea.prototype.removeChild = function removeChild(child) {
            (0, _array.removeArrayItem)(this.children, child);
        };

        EditableArea.prototype.onBlockDropped = function onBlockDropped(event, params) {
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
        };

        EditableArea.prototype.onBlockInstanceDropped = function onBlockInstanceDropped(event, params) {
            this.addChild(params.blockInstance, params.index);
            /*
            if (ko.processAllDeferredBindingUpdates) {
                ko.processAllDeferredBindingUpdates();
            }*/
            params.blockInstance.emit('blockMoved');
        };

        EditableArea.prototype.onBlockRemoved = function onBlockRemoved(event, params) {
            params.block.emit('blockBeforeRemoved');
            this.removeChild(params.block);
            /*
            if (ko.processAllDeferredBindingUpdates) {
                ko.processAllDeferredBindingUpdates();
            }*/
        };

        EditableArea.prototype.onBlockSorted = function onBlockSorted(event, params) {
            var originalIndex = _knockout2.default.utils.arrayIndexOf(this.children(), params.block);
            if (originalIndex !== params.index) {
                (0, _array.moveArrayItem)(this.children, originalIndex, params.index);
            }
            params.block.emit('blockMoved');
        };

        EditableArea.prototype.onSortStart = function onSortStart(event, params) {
            var originalEle = jQuery(params.originalEle);
            originalEle.show();
            originalEle.addClass('bluefoot-sorting-original');
            // Reset the width & height of the helper
            jQuery(params.helper).css({ width: '', height: '' }).html(jQuery('<h3 />').text(this.title).html());
        };

        EditableArea.prototype.onSortStop = function onSortStop(event, params) {
            jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
        };

        return EditableArea;
    }(_eventEmitter2.default);

    exports.default = EditableArea;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEudHMiXSwibmFtZXMiOlsiRWRpdGFibGVBcmVhIiwic3RhZ2UiLCJ0aXRsZSIsImJpbmRBbGwiLCJvbiIsIm9uQmxvY2tEcm9wcGVkIiwib25CbG9ja0luc3RhbmNlRHJvcHBlZCIsIm9uQmxvY2tSZW1vdmVkIiwib25CbG9ja1NvcnRlZCIsIm9uU29ydFN0YXJ0Iiwib25Tb3J0U3RvcCIsInNldENoaWxkcmVuIiwiY2hpbGRyZW4iLCJnZXRTdGFnZSIsImFkZENoaWxkIiwiY2hpbGQiLCJpbmRleCIsInBhcmVudCIsInB1c2giLCJyZW1vdmVDaGlsZCIsImV2ZW50IiwicGFyYW1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9jayIsImNvbmZpZyIsInRoZW4iLCJlbWl0IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJibG9ja0luc3RhbmNlIiwib3JpZ2luYWxJbmRleCIsInV0aWxzIiwiYXJyYXlJbmRleE9mIiwib3JpZ2luYWxFbGUiLCJqUXVlcnkiLCJzaG93IiwiYWRkQ2xhc3MiLCJoZWxwZXIiLCJjc3MiLCJ3aWR0aCIsImhlaWdodCIsImh0bWwiLCJ0ZXh0IiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWlCY0EsWTs7O0FBS1Y7Ozs7O0FBS0EsOEJBQVlDLEtBQVosRUFBa0M7QUFBQTs7QUFBQSx5REFDOUIsd0JBRDhCOztBQVBsQyxrQkFBQUMsS0FBQSxHQUFnQixVQUFoQixDQU9rQyxDQVBOO0FBU3hCLGdCQUFJRCxLQUFKLEVBQVc7QUFDUCxzQkFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFFRCxpQ0FBRUUsT0FBRixRQUVJLGdCQUZKLEVBR0ksd0JBSEosRUFJSSxnQkFKSixFQUtJLGVBTEosRUFNSSxhQU5KLEVBT0ksWUFQSjtBQVVB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LEtBQVAsQ0FBYUcsSUFBYixDQUFrQixZQUFsQjtBQUNILFM7OytCQVFEbkIsVyx3QkFBWVcsSyxFQUFjQyxNLEVBQWtCO0FBQ3hDLGdCQUFJZSxjQUFjQyxPQUFPaEIsT0FBT2UsV0FBZCxDQUFsQjtBQUNBQSx3QkFBWUUsSUFBWjtBQUNBRix3QkFBWUcsUUFBWixDQUFxQiwyQkFBckI7QUFFQTtBQUNBRixtQkFBT2hCLE9BQU9tQixNQUFkLEVBQ0tDLEdBREwsQ0FDUyxFQUFDQyxPQUFPLEVBQVIsRUFBWUMsUUFBUSxFQUFwQixFQURULEVBRUtDLElBRkwsQ0FFVVAsT0FBTyxRQUFQLEVBQWlCUSxJQUFqQixDQUFzQixLQUFLM0MsS0FBM0IsRUFBa0MwQyxJQUFsQyxFQUZWO0FBR0gsUzs7K0JBUURsQyxVLHVCQUFXVSxLLEVBQWNDLE0sRUFBa0I7QUFDdkNnQixtQkFBT2hCLE9BQU9lLFdBQWQsRUFBMkJVLFdBQTNCLENBQXVDLDJCQUF2QztBQUNILFM7Ozs7O3NCQXhMUzlDLFkiLCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vLi4vZXZlbnQtZW1pdHRlcic7XG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uLy4uL3N0YWdlLmQnO1xuaW1wb3J0IHsgQmxvY2sgYXMgQmxvY2tJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9ibG9jay9ibG9jay5kJztcbmltcG9ydCB7IFN0cnVjdHVyYWwgYXMgU3RydWN0dXJhbEludGVyZmFjZSB9IGZyb20gJy4vYWJzdHJhY3QuZCc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL2VkaXRhYmxlLWFyZWEuZCc7XG5pbXBvcnQgY3JlYXRlQmxvY2sgZnJvbSAnLi4vLi4vYmxvY2svZmFjdG9yeSc7XG5cbmltcG9ydCB7IG1vdmVBcnJheUl0ZW1JbnRvQXJyYXksIG1vdmVBcnJheUl0ZW0sIHJlbW92ZUFycmF5SXRlbSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2FycmF5JztcbmltcG9ydCBCbG9jayBmcm9tICcuLi8uLi9ibG9jay9ibG9jayc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBrbyBmcm9tICdrbm9ja291dCc7XG5cbi8qKlxuICogQ2xhc3MgRWRpdGFibGVBcmVhXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRhYmxlQXJlYSBleHRlbmRzIEV2ZW50RW1pdHRlciBpbXBsZW1lbnRzIEVkaXRhYmxlQXJlYUludGVyZmFjZSB7XG4gICAgY2hpbGRyZW46IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT47XG4gICAgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlO1xuICAgIHRpdGxlOiBzdHJpbmcgPSAnRWRpdGFibGUnOyAvLyBAdG9kbyB0cmFuc2xhdGVcblxuICAgIC8qKlxuICAgICAqIEVkaXRhYmxlQXJlYSBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RhZ2U/OiBTdGFnZUludGVyZmFjZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoc3RhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uYmluZEFsbChcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAnb25CbG9ja0Ryb3BwZWQnLFxuICAgICAgICAgICAgJ29uQmxvY2tJbnN0YW5jZURyb3BwZWQnLFxuICAgICAgICAgICAgJ29uQmxvY2tSZW1vdmVkJyxcbiAgICAgICAgICAgICdvbkJsb2NrU29ydGVkJyxcbiAgICAgICAgICAgICdvblNvcnRTdGFydCcsXG4gICAgICAgICAgICAnb25Tb3J0U3RvcCdcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnRzIHRvIHN0cnVjdHVyYWwgZWxlbWVudHNcbiAgICAgICAgLy8gQmxvY2sgZHJvcHBlZCBmcm9tIGxlZnQgaGFuZCBwYW5lbFxuICAgICAgICB0aGlzLm9uKCdibG9ja0Ryb3BwZWQnLCB0aGlzLm9uQmxvY2tEcm9wcGVkKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEJsb2NrIGluc3RhbmNlIGJlaW5nIG1vdmVkIGJldHdlZW4gc3RydWN0dXJhbCBlbGVtZW50c1xuICAgICAgICB0aGlzLm9uKCdibG9ja0luc3RhbmNlRHJvcHBlZCcsIHRoaXMub25CbG9ja0luc3RhbmNlRHJvcHBlZCk7XG4gICAgICAgIHRoaXMub24oJ2Jsb2NrUmVtb3ZlZCcsIHRoaXMub25CbG9ja1JlbW92ZWQpO1xuXG4gICAgICAgIC8vIEJsb2NrIHNvcnRlZCB3aXRoaW4gdGhlIHNhbWUgc3RydWN0dXJhbCBlbGVtZW50XG4gICAgICAgIHRoaXMub24oJ2Jsb2NrU29ydGVkJywgdGhpcy5vbkJsb2NrU29ydGVkKTtcblxuICAgICAgICB0aGlzLm9uKCdzb3J0U3RhcnQnLCB0aGlzLm9uU29ydFN0YXJ0KTtcbiAgICAgICAgdGhpcy5vbignc29ydFN0b3AnLCB0aGlzLm9uU29ydFN0b3ApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgY2hpbGRyZW4gb2JzZXJ2YWJsZSBhcnJheSBpbnRvIHRoZSBjbGFzc1xuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkcmVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldENoaWxkcmVuKGNoaWxkcmVuOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+KSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgc3RhZ2UgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTdGFnZUludGVyZmFjZX1cbiAgICAgKi9cbiAgICBnZXRTdGFnZSgpOiBTdGFnZUludGVyZmFjZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YWdlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNoaWxkIGludG8gdGhlIG9ic2VydmFibGUgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIGFkZENoaWxkKGNoaWxkOiBTdHJ1Y3R1cmFsSW50ZXJmYWNlLCBpbmRleD86IG51bWJlcikgOnZvaWQge1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBjaGlsZC5zdGFnZSA9IHRoaXMuc3RhZ2U7XG4gICAgICAgIGlmIChpbmRleCkge1xuICAgICAgICAgICAgLy8gVXNlIHRoZSBhcnJheVV0aWwgZnVuY3Rpb24gdG8gYWRkIHRoZSBpdGVtIGluIHRoZSBjb3JyZWN0IHBsYWNlIHdpdGhpbiB0aGUgYXJyYXlcbiAgICAgICAgICAgIG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkoY2hpbGQsIHRoaXMuY2hpbGRyZW4sIGluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBjaGlsZCBmcm9tIHRoZSBvYnNlcnZhYmxlIGFycmF5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgKi9cbiAgICByZW1vdmVDaGlsZChjaGlsZDogYW55KSA6dm9pZCB7XG4gICAgICAgIHJlbW92ZUFycmF5SXRlbSh0aGlzLmNoaWxkcmVuLCBjaGlsZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGEgYmxvY2sgYmVpbmcgZHJvcHBlZCBpbnRvIHRoZSBzdHJ1Y3R1cmFsIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9ja3xUPn1cbiAgICAgKi9cbiAgICBvbkJsb2NrRHJvcHBlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tEcm9wcGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBpbmRleCA9IHBhcmFtcy5pbmRleCB8fCAwO1xuXG4gICAgICAgIG5ldyBQcm9taXNlPEJsb2NrSW50ZXJmYWNlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUJsb2NrKHBhcmFtcy5ibG9jay5jb25maWcsIHRoaXMsIHRoaXMuc3RhZ2UpLnRoZW4oKGJsb2NrOiBCbG9jaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGJsb2NrLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBibG9jay5lbWl0KCdibG9ja1JlYWR5Jyk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCdQYXJhbWV0ZXIgYmxvY2sgbWlzc2luZyBmcm9tIGV2ZW50LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYXB0dXJlIGEgYmxvY2sgaW5zdGFuY2UgYmVpbmcgZHJvcHBlZCBvbnRvIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tJbnN0YW5jZURyb3BwZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrSW5zdGFuY2VEcm9wcGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQocGFyYW1zLmJsb2NrSW5zdGFuY2UsIHBhcmFtcy5pbmRleCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKSB7XG4gICAgICAgICAgICBrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcygpO1xuICAgICAgICB9Ki9cblxuICAgICAgICBwYXJhbXMuYmxvY2tJbnN0YW5jZS5lbWl0KCdibG9ja01vdmVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGV2ZW50IHRvIHJlbW92ZSBibG9ja1xuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tSZW1vdmVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja1JlbW92ZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgcGFyYW1zLmJsb2NrLmVtaXQoJ2Jsb2NrQmVmb3JlUmVtb3ZlZCcpO1xuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHBhcmFtcy5ibG9jayk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKSB7XG4gICAgICAgICAgICBrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcygpO1xuICAgICAgICB9Ki9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnQgd2hlbiBhIGJsb2NrIGlzIHNvcnRlZCB3aXRoaW4gaXQncyBjdXJyZW50IGNvbnRhaW5lclxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tTb3J0ZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrU29ydGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBvcmlnaW5hbEluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKHRoaXMuY2hpbGRyZW4oKSwgcGFyYW1zLmJsb2NrKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsSW5kZXggIT09IHBhcmFtcy5pbmRleCkge1xuICAgICAgICAgICAgbW92ZUFycmF5SXRlbSh0aGlzLmNoaWxkcmVuLCBvcmlnaW5hbEluZGV4LCBwYXJhbXMuaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtcy5ibG9jay5lbWl0KCdibG9ja01vdmVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY2FsbGVkIHdoZW4gc3RhcnRpbmcgc3RhcnRzIG9uIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uU29ydFN0YXJ0KGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBvcmlnaW5hbEVsZSA9IGpRdWVyeShwYXJhbXMub3JpZ2luYWxFbGUpO1xuICAgICAgICBvcmlnaW5hbEVsZS5zaG93KCk7XG4gICAgICAgIG9yaWdpbmFsRWxlLmFkZENsYXNzKCdibHVlZm9vdC1zb3J0aW5nLW9yaWdpbmFsJyk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHdpZHRoICYgaGVpZ2h0IG9mIHRoZSBoZWxwZXJcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5oZWxwZXIpXG4gICAgICAgICAgICAuY3NzKHt3aWR0aDogJycsIGhlaWdodDogJyd9KVxuICAgICAgICAgICAgLmh0bWwoalF1ZXJ5KCc8aDMgLz4nKS50ZXh0KHRoaXMudGl0bGUpLmh0bWwoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY2FsbGVkIHdoZW4gc29ydGluZyBzdG9wcyBvbiB0aGlzIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvblNvcnRTdG9wKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGpRdWVyeShwYXJhbXMub3JpZ2luYWxFbGUpLnJlbW92ZUNsYXNzKCdibHVlZm9vdC1zb3J0aW5nLW9yaWdpbmFsJyk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrRHJvcHBlZFBhcmFtcyB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBibG9jazoge1xuICAgICAgICBjb25maWc6IG9iamVjdFxuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja0luc3RhbmNlRHJvcHBlZFBhcmFtcyB7XG4gICAgYmxvY2tJbnN0YW5jZTogQmxvY2ssXG4gICAgaW5kZXg/OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja1JlbW92ZWRQYXJhbXMge1xuICAgIGJsb2NrOiBCbG9ja1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrU29ydGVkUGFyYW1zIHtcbiAgICBibG9jazogQmxvY2tcbiAgICBpbmRleDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ydFBhcmFtcyB7XG4gICAgb3JpZ2luYWxFbGU6IEpRdWVyeVxuICAgIHBsYWNlaG9sZGVyOiBKUXVlcnlcbiAgICBoZWxwZXI/OiBhbnlcbn0iXX0=
