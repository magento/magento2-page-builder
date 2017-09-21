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
            // Bind this context to event handlers
            _this.onBlockDropped = _this.onBlockDropped.bind(_this);
            _this.onBlockInstanceDropped = _this.onBlockInstanceDropped.bind(_this);
            _this.onBlockRemoved = _this.onBlockRemoved.bind(_this);
            _this.onBlockSorted = _this.onBlockSorted.bind(_this);
            _this.onSortStart = _this.onSortStart.bind(_this);
            _this.onSortStop = _this.onSortStop.bind(_this);
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


        _createClass(EditableArea, [{
            key: 'setChildren',
            value: function setChildren(children) {
                this.children = children;
            }
        }, {
            key: 'getStage',
            value: function getStage() {
                return this.stage;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEudHMiXSwibmFtZXMiOlsiRWRpdGFibGVBcmVhIiwic3RhZ2UiLCJ0aXRsZSIsIm9uQmxvY2tEcm9wcGVkIiwiYmluZCIsIm9uQmxvY2tJbnN0YW5jZURyb3BwZWQiLCJvbkJsb2NrUmVtb3ZlZCIsIm9uQmxvY2tTb3J0ZWQiLCJvblNvcnRTdGFydCIsIm9uU29ydFN0b3AiLCJvbiIsImNoaWxkcmVuIiwiY2hpbGQiLCJpbmRleCIsInBhcmVudCIsInB1c2giLCJldmVudCIsInBhcmFtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYmxvY2siLCJjb25maWciLCJ0aGVuIiwiYWRkQ2hpbGQiLCJlbWl0IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJibG9ja0luc3RhbmNlIiwicmVtb3ZlQ2hpbGQiLCJvcmlnaW5hbEluZGV4Iiwia28iLCJ1dGlscyIsImFycmF5SW5kZXhPZiIsIm9yaWdpbmFsRWxlIiwialF1ZXJ5Iiwic2hvdyIsImFkZENsYXNzIiwiaGVscGVyIiwiY3NzIiwid2lkdGgiLCJoZWlnaHQiLCJodG1sIiwidGV4dCIsInJlbW92ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWVjQSxZOzs7QUFLVjs7Ozs7QUFLQSw4QkFBWUMsS0FBWixFQUFrQztBQUFBOztBQUFBOztBQVBsQyxrQkFBQUMsS0FBQSxHQUFnQixVQUFoQixDQU9rQyxDQVBOO0FBU3hCLGdCQUFJRCxLQUFKLEVBQVc7QUFDUCxzQkFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFFRDtBQUNBLGtCQUFLRSxjQUFMLEdBQXNCLE1BQUtBLGNBQUwsQ0FBb0JDLElBQXBCLE9BQXRCO0FBQ0Esa0JBQUtDLHNCQUFMLEdBQThCLE1BQUtBLHNCQUFMLENBQTRCRCxJQUE1QixP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RUFBdEIsRUFBdUNNLE9BQU9JLEtBQTlDLENBQXBCO0FBQ0Esb0JBQUlVLGtCQUFrQmQsT0FBT0osS0FBN0IsRUFBb0M7QUFDaEMsOENBQWMsS0FBS0YsUUFBbkIsRUFBNkJvQixhQUE3QixFQUE0Q2QsT0FBT0osS0FBbkQ7QUFDSDtBQUNESSx1QkFBT0ksS0FBUCxDQUFhSSxJQUFiLENBQWtCLFlBQWxCO0FBQ0g7Ozt3Q0FRV1QsSyxFQUFjQyxNLEVBQWtCO0FBQ3hDLG9CQUFJa0IsY0FBY0MsT0FBT25CLE9BQU9rQixXQUFkLENBQWxCO0FBQ0FBLDRCQUFZRSxJQUFaO0FBQ0FGLDRCQUFZRyxRQUFaLENBQXFCLDJCQUFyQjtBQUVBO0FBQ0FGLHVCQUFPbkIsT0FBT3NCLE1BQWQsRUFDS0MsR0FETCxDQUNTLEVBQUNDLE9BQU8sRUFBUixFQUFZQyxRQUFRLEVBQXBCLEVBRFQsRUFFS0MsSUFGTCxDQUVVUCxPQUFPLFFBQVAsRUFBaUJRLElBQWpCLENBQXNCLEtBQUsxQyxLQUEzQixFQUFrQ3lDLElBQWxDLEVBRlY7QUFHSDs7O3VDQVFVM0IsSyxFQUFjQyxNLEVBQWtCO0FBQ3ZDbUIsdUJBQU9uQixPQUFPa0IsV0FBZCxFQUEyQlUsV0FBM0IsQ0FBdUMsMkJBQXZDO0FBQ0g7Ozs7OztzQkF0TFM3QyxZIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uLy4uL2V2ZW50LWVtaXR0ZXInO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9zdGFnZS5kJztcbmltcG9ydCB7IEJsb2NrIGFzIEJsb2NrSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vYmxvY2svYmxvY2suZCc7XG5pbXBvcnQgeyBTdHJ1Y3R1cmFsIGFzIFN0cnVjdHVyYWxJbnRlcmZhY2UgfSBmcm9tICcuL2Fic3RyYWN0LmQnO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IGNyZWF0ZUJsb2NrIGZyb20gJy4uLy4uL2Jsb2NrL2ZhY3RvcnknO1xuXG5pbXBvcnQgeyBtb3ZlQXJyYXlJdGVtSW50b0FycmF5LCBtb3ZlQXJyYXlJdGVtLCByZW1vdmVBcnJheUl0ZW0gfSBmcm9tICcuLi8uLi8uLi91dGlscy9hcnJheSc7XG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2Jsb2NrL2Jsb2NrJztcblxuLyoqXG4gKiBDbGFzcyBFZGl0YWJsZUFyZWFcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdGFibGVBcmVhIGV4dGVuZHMgRXZlbnRFbWl0dGVyIGltcGxlbWVudHMgRWRpdGFibGVBcmVhSW50ZXJmYWNlIHtcbiAgICBjaGlsZHJlbjogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PjtcbiAgICBzdGFnZTogU3RhZ2VJbnRlcmZhY2U7XG4gICAgdGl0bGU6IHN0cmluZyA9ICdFZGl0YWJsZSc7IC8vIEB0b2RvIHRyYW5zbGF0ZVxuXG4gICAgLyoqXG4gICAgICogRWRpdGFibGVBcmVhIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGFnZT86IFN0YWdlSW50ZXJmYWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmIChzdGFnZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmluZCB0aGlzIGNvbnRleHQgdG8gZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgdGhpcy5vbkJsb2NrRHJvcHBlZCA9IHRoaXMub25CbG9ja0Ryb3BwZWQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkJsb2NrSW5zdGFuY2VEcm9wcGVkID0gdGhpcy5vbkJsb2NrSW5zdGFuY2VEcm9wcGVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25CbG9ja1JlbW92ZWQgPSB0aGlzLm9uQmxvY2tSZW1vdmVkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25CbG9ja1NvcnRlZCA9IHRoaXMub25CbG9ja1NvcnRlZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uU29ydFN0YXJ0ID0gdGhpcy5vblNvcnRTdGFydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uU29ydFN0b3AgPSB0aGlzLm9uU29ydFN0b3AuYmluZCh0aGlzKTtcblxuICAgICAgICAvLyBBdHRhY2ggZXZlbnRzIHRvIHN0cnVjdHVyYWwgZWxlbWVudHNcbiAgICAgICAgLy8gQmxvY2sgZHJvcHBlZCBmcm9tIGxlZnQgaGFuZCBwYW5lbFxuICAgICAgICB0aGlzLm9uKCdibG9ja0Ryb3BwZWQnLCB0aGlzLm9uQmxvY2tEcm9wcGVkKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEJsb2NrIGluc3RhbmNlIGJlaW5nIG1vdmVkIGJldHdlZW4gc3RydWN0dXJhbCBlbGVtZW50c1xuICAgICAgICB0aGlzLm9uKCdibG9ja0luc3RhbmNlRHJvcHBlZCcsIHRoaXMub25CbG9ja0luc3RhbmNlRHJvcHBlZCk7XG4gICAgICAgIHRoaXMub24oJ2Jsb2NrUmVtb3ZlZCcsIHRoaXMub25CbG9ja1JlbW92ZWQpO1xuXG4gICAgICAgIC8vIEJsb2NrIHNvcnRlZCB3aXRoaW4gdGhlIHNhbWUgc3RydWN0dXJhbCBlbGVtZW50XG4gICAgICAgIHRoaXMub24oJ2Jsb2NrU29ydGVkJywgdGhpcy5vbkJsb2NrU29ydGVkKTtcblxuICAgICAgICB0aGlzLm9uKCdzb3J0U3RhcnQnLCB0aGlzLm9uU29ydFN0YXJ0KTtcbiAgICAgICAgdGhpcy5vbignc29ydFN0b3AnLCB0aGlzLm9uU29ydFN0b3ApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgY2hpbGRyZW4gb2JzZXJ2YWJsZSBhcnJheSBpbnRvIHRoZSBjbGFzc1xuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkcmVuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNldENoaWxkcmVuKGNoaWxkcmVuOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+KSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgc3RhZ2UgaW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtTdGFnZUludGVyZmFjZX1cbiAgICAgKi9cbiAgICBnZXRTdGFnZSgpOiBTdGFnZUludGVyZmFjZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YWdlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNoaWxkIGludG8gdGhlIG9ic2VydmFibGUgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIGFkZENoaWxkKGNoaWxkOiBTdHJ1Y3R1cmFsSW50ZXJmYWNlLCBpbmRleD86IG51bWJlcikgOnZvaWQge1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBjaGlsZC5zdGFnZSA9IHRoaXMuc3RhZ2U7XG4gICAgICAgIGlmIChpbmRleCkge1xuICAgICAgICAgICAgLy8gVXNlIHRoZSBhcnJheVV0aWwgZnVuY3Rpb24gdG8gYWRkIHRoZSBpdGVtIGluIHRoZSBjb3JyZWN0IHBsYWNlIHdpdGhpbiB0aGUgYXJyYXlcbiAgICAgICAgICAgIG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkoY2hpbGQsIHRoaXMuY2hpbGRyZW4sIGluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBjaGlsZCBmcm9tIHRoZSBvYnNlcnZhYmxlIGFycmF5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgKi9cbiAgICByZW1vdmVDaGlsZChjaGlsZDogYW55KSA6dm9pZCB7XG4gICAgICAgIHJlbW92ZUFycmF5SXRlbSh0aGlzLmNoaWxkcmVuLCBjaGlsZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGEgYmxvY2sgYmVpbmcgZHJvcHBlZCBpbnRvIHRoZSBzdHJ1Y3R1cmFsIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9ja3xUPn1cbiAgICAgKi9cbiAgICBvbkJsb2NrRHJvcHBlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tEcm9wcGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBpbmRleCA9IHBhcmFtcy5pbmRleCB8fCAwO1xuXG4gICAgICAgIG5ldyBQcm9taXNlPEJsb2NrSW50ZXJmYWNlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUJsb2NrKHBhcmFtcy5ibG9jay5jb25maWcsIHRoaXMsIHRoaXMuc3RhZ2UpLnRoZW4oKGJsb2NrOiBCbG9jaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGJsb2NrLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBibG9jay5lbWl0KCdibG9ja1JlYWR5Jyk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCdQYXJhbWV0ZXIgYmxvY2sgbWlzc2luZyBmcm9tIGV2ZW50LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYXB0dXJlIGEgYmxvY2sgaW5zdGFuY2UgYmVpbmcgZHJvcHBlZCBvbnRvIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tJbnN0YW5jZURyb3BwZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrSW5zdGFuY2VEcm9wcGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQocGFyYW1zLmJsb2NrSW5zdGFuY2UsIHBhcmFtcy5pbmRleCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKSB7XG4gICAgICAgICAgICBrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcygpO1xuICAgICAgICB9Ki9cblxuICAgICAgICBwYXJhbXMuYmxvY2tJbnN0YW5jZS5lbWl0KCdibG9ja01vdmVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGV2ZW50IHRvIHJlbW92ZSBibG9ja1xuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tSZW1vdmVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja1JlbW92ZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgcGFyYW1zLmJsb2NrLmVtaXQoJ2Jsb2NrQmVmb3JlUmVtb3ZlZCcpO1xuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHBhcmFtcy5ibG9jayk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKSB7XG4gICAgICAgICAgICBrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcygpO1xuICAgICAgICB9Ki9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnQgd2hlbiBhIGJsb2NrIGlzIHNvcnRlZCB3aXRoaW4gaXQncyBjdXJyZW50IGNvbnRhaW5lclxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tTb3J0ZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrU29ydGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBvcmlnaW5hbEluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKHRoaXMuY2hpbGRyZW4oKSwgcGFyYW1zLmJsb2NrKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsSW5kZXggIT09IHBhcmFtcy5pbmRleCkge1xuICAgICAgICAgICAgbW92ZUFycmF5SXRlbSh0aGlzLmNoaWxkcmVuLCBvcmlnaW5hbEluZGV4LCBwYXJhbXMuaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtcy5ibG9jay5lbWl0KCdibG9ja01vdmVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY2FsbGVkIHdoZW4gc3RhcnRpbmcgc3RhcnRzIG9uIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uU29ydFN0YXJ0KGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBvcmlnaW5hbEVsZSA9IGpRdWVyeShwYXJhbXMub3JpZ2luYWxFbGUpO1xuICAgICAgICBvcmlnaW5hbEVsZS5zaG93KCk7XG4gICAgICAgIG9yaWdpbmFsRWxlLmFkZENsYXNzKCdibHVlZm9vdC1zb3J0aW5nLW9yaWdpbmFsJyk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHdpZHRoICYgaGVpZ2h0IG9mIHRoZSBoZWxwZXJcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5oZWxwZXIpXG4gICAgICAgICAgICAuY3NzKHt3aWR0aDogJycsIGhlaWdodDogJyd9KVxuICAgICAgICAgICAgLmh0bWwoalF1ZXJ5KCc8aDMgLz4nKS50ZXh0KHRoaXMudGl0bGUpLmh0bWwoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY2FsbGVkIHdoZW4gc29ydGluZyBzdG9wcyBvbiB0aGlzIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvblNvcnRTdG9wKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGpRdWVyeShwYXJhbXMub3JpZ2luYWxFbGUpLnJlbW92ZUNsYXNzKCdibHVlZm9vdC1zb3J0aW5nLW9yaWdpbmFsJyk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrRHJvcHBlZFBhcmFtcyB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBibG9jazoge1xuICAgICAgICBjb25maWc6IG9iamVjdFxuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja0luc3RhbmNlRHJvcHBlZFBhcmFtcyB7XG4gICAgYmxvY2tJbnN0YW5jZTogQmxvY2ssXG4gICAgaW5kZXg/OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja1JlbW92ZWRQYXJhbXMge1xuICAgIGJsb2NrOiBCbG9ja1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrU29ydGVkUGFyYW1zIHtcbiAgICBibG9jazogQmxvY2tcbiAgICBpbmRleDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ydFBhcmFtcyB7XG4gICAgb3JpZ2luYWxFbGU6IEpRdWVyeVxuICAgIHBsYWNlaG9sZGVyOiBKUXVlcnlcbiAgICBoZWxwZXI/OiBhbnlcbn0iXX0=
