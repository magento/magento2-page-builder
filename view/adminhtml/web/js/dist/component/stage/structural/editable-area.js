define(['exports', '../../event-emitter', '../../stage', '../../block/factory', 'utils/array'], function (exports, _eventEmitter, _stage, _factory, _array) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.EditableArea = undefined;

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

    var EditableArea = exports.EditableArea = function (_EventEmitter) {
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
            /**
             * Retrieve the stage instance
             *
             * @returns {StageInterface}
             */

        }, {
            key: 'getStage',
            value: function getStage() {
                if (this.stage) {
                    return this.stage;
                }
                if (this instanceof _stage.Stage) {
                    return this;
                }
            }
            /**
             * Add a child into the observable array
             *
             * @param child
             * @param index
             */

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
            /**
             * Remove a child from the observable array
             *
             * @param child
             */

        }, {
            key: 'removeChild',
            value: function removeChild(child) {
                (0, _array.removeArrayItem)(this.children, child);
            }
            /**
             * Handle a block being dropped into the structural element
             *
             * @param event
             * @param params
             * @returns {Promise<Block|T>}
             */

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
            /**
             * Capture a block instance being dropped onto this element
             *
             * @param event
             * @param params
             */

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
            /**
             * Handle event to remove block
             *
             * @param event
             * @param params
             */

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
            /**
             * Handle event when a block is sorted within it's current container
             *
             * @param event
             * @param params
             */

        }, {
            key: 'onBlockSorted',
            value: function onBlockSorted(event, params) {
                var originalIndex = ko.utils.arrayIndexOf(this.children(), params.block);
                if (originalIndex !== params.index) {
                    (0, _array.moveArrayItem)(this.children, originalIndex, params.index);
                }
                params.block.emit('blockMoved');
            }
            /**
             * Event called when starting starts on this element
             *
             * @param event
             * @param params
             */

        }, {
            key: 'onSortStart',
            value: function onSortStart(event, params) {
                var originalEle = jQuery(params.originalEle);
                originalEle.show();
                originalEle.addClass('bluefoot-sorting-original');
                // Reset the width & height of the helper
                jQuery(params.helper).css({ width: '', height: '' }).html(jQuery('<h3 />').text(this.title).html());
            }
            /**
             * Event called when sorting stops on this element
             *
             * @param event
             * @param params
             */

        }, {
            key: 'onSortStop',
            value: function onSortStop(event, params) {
                jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
            }
        }]);

        return EditableArea;
    }(_eventEmitter2.default);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLnRzIl0sIm5hbWVzIjpbIkVkaXRhYmxlQXJlYSIsInN0YWdlIiwidGl0bGUiLCJjaGlsZHJlbiIsImNoaWxkIiwiaW5kZXgiLCJwYXJlbnQiLCJwdXNoIiwiZXZlbnQiLCJwYXJhbXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImJsb2NrIiwiY29uZmlnIiwidGhlbiIsImFkZENoaWxkIiwiZW1pdCIsImNhdGNoIiwiZXJyb3IiLCJjb25zb2xlIiwiYmxvY2tJbnN0YW5jZSIsInJlbW92ZUNoaWxkIiwib3JpZ2luYWxJbmRleCIsImtvIiwidXRpbHMiLCJhcnJheUluZGV4T2YiLCJvcmlnaW5hbEVsZSIsImpRdWVyeSIsInNob3ciLCJhZGRDbGFzcyIsImhlbHBlciIsImNzcyIsIndpZHRoIiwiaGVpZ2h0IiwiaHRtbCIsInRleHQiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZ0JNQSxZLFdBQUFBLFk7OztBQUtGOzs7OztBQUtBLDhCQUFZQyxLQUFaLEVBQWtDO0FBQUE7O0FBQUE7O0FBUGxDLGtCQUFBQyxLQUFBLEdBQWdCLFVBQWhCLENBT2tDLENBUE47QUFTeEIsZ0JBQUlELEtBQUosRUFBVztBQUNQLHNCQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDSDtBQUo2QjtBQUtqQztBQUVEOzs7Ozs7Ozs7d0NBS3NCRSxRLEVBQXNDO0FBQ3hELHFCQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNIO0FBRUQ7Ozs7Ozs7O3VDQUtRO0FBQ0osb0JBQUksS0FBS0YsS0FBVCxFQUFnQjtBQUNaLDJCQUFPLEtBQUtBLEtBQVo7QUFDSDtBQUVELG9CQUFJLDRCQUFKLEVBQTJCO0FBQ3ZCLDJCQUFPLElBQVA7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7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IiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uLy4uL2V2ZW50LWVtaXR0ZXInO1xuaW1wb3J0IHsgU3RhZ2UgfSBmcm9tICcuLi8uLi9zdGFnZSc7XG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uLy4uL3N0YWdlLmQnO1xuaW1wb3J0IHsgQmxvY2sgYXMgQmxvY2tJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9ibG9jay9ibG9jay5kJztcbmltcG9ydCB7IFN0cnVjdHVyYWwgYXMgU3RydWN0dXJhbEludGVyZmFjZSB9IGZyb20gJy4vYWJzdHJhY3QuZCc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL2VkaXRhYmxlLWFyZWEuZCc7XG5pbXBvcnQgY3JlYXRlQmxvY2sgZnJvbSAnLi4vLi4vYmxvY2svZmFjdG9yeSc7XG5cbmltcG9ydCB7IG1vdmVBcnJheUl0ZW1JbnRvQXJyYXksIG1vdmVBcnJheUl0ZW0sIHJlbW92ZUFycmF5SXRlbSB9IGZyb20gJ3V0aWxzL2FycmF5JztcbmltcG9ydCB7QmxvY2t9IGZyb20gXCIuLi8uLi9ibG9jay9ibG9ja1wiO1xuXG4vKipcbiAqIENsYXNzIEVkaXRhYmxlQXJlYVxuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgY2xhc3MgRWRpdGFibGVBcmVhIGV4dGVuZHMgRXZlbnRFbWl0dGVyIGltcGxlbWVudHMgRWRpdGFibGVBcmVhSW50ZXJmYWNlIHtcbiAgICBjaGlsZHJlbjogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PjtcbiAgICBzdGFnZTogU3RhZ2VJbnRlcmZhY2U7XG4gICAgdGl0bGU6IHN0cmluZyA9ICdFZGl0YWJsZSc7IC8vIEB0b2RvIHRyYW5zbGF0ZVxuXG4gICAgLyoqXG4gICAgICogRWRpdGFibGVBcmVhIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGFnZT86IFN0YWdlSW50ZXJmYWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmIChzdGFnZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjaGlsZHJlbiBvYnNlcnZhYmxlIGFycmF5IGludG8gdGhlIGNsYXNzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRyZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2V0Q2hpbGRyZW4oY2hpbGRyZW46IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4pIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBzdGFnZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHJldHVybnMge1N0YWdlSW50ZXJmYWNlfVxuICAgICAqL1xuICAgIGdldFN0YWdlKCk6IFN0YWdlSW50ZXJmYWNlIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTdGFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjaGlsZCBpbnRvIHRoZSBvYnNlcnZhYmxlIGFycmF5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBhZGRDaGlsZChjaGlsZDogU3RydWN0dXJhbEludGVyZmFjZSwgaW5kZXg/OiBudW1iZXIpIDp2b2lkIHtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgY2hpbGQuc3RhZ2UgPSB0aGlzLnN0YWdlO1xuICAgICAgICBpZiAoaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFVzZSB0aGUgYXJyYXlVdGlsIGZ1bmN0aW9uIHRvIGFkZCB0aGUgaXRlbSBpbiB0aGUgY29ycmVjdCBwbGFjZSB3aXRoaW4gdGhlIGFycmF5XG4gICAgICAgICAgICBtb3ZlQXJyYXlJdGVtSW50b0FycmF5KGNoaWxkLCB0aGlzLmNoaWxkcmVuLCBpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY2hpbGQgZnJvbSB0aGUgb2JzZXJ2YWJsZSBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQ6IGFueSkgOnZvaWQge1xuICAgICAgICByZW1vdmVBcnJheUl0ZW0odGhpcy5jaGlsZHJlbiwgY2hpbGQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBhIGJsb2NrIGJlaW5nIGRyb3BwZWQgaW50byB0aGUgc3RydWN0dXJhbCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge1Byb21pc2U8QmxvY2t8VD59XG4gICAgICovXG4gICAgb25CbG9ja0Ryb3BwZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrRHJvcHBlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBsZXQgaW5kZXggPSBwYXJhbXMuaW5kZXggfHwgMDtcblxuICAgICAgICBuZXcgUHJvbWlzZTxCbG9ja0ludGVyZmFjZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5ibG9jaykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVCbG9jayhwYXJhbXMuYmxvY2suY29uZmlnLCB0aGlzLCB0aGlzLnN0YWdlKS50aGVuKChibG9jazogQmxvY2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChibG9jaywgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZW1pdCgnYmxvY2tSZWFkeScpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCgnUGFyYW1ldGVyIGJsb2NrIG1pc3NpbmcgZnJvbSBldmVudC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FwdHVyZSBhIGJsb2NrIGluc3RhbmNlIGJlaW5nIGRyb3BwZWQgb250byB0aGlzIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvbkJsb2NrSW5zdGFuY2VEcm9wcGVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja0luc3RhbmNlRHJvcHBlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZENoaWxkKHBhcmFtcy5ibG9ja0luc3RhbmNlLCBwYXJhbXMuaW5kZXgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcykge1xuICAgICAgICAgICAga28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMoKTtcbiAgICAgICAgfSovXG5cbiAgICAgICAgcGFyYW1zLmJsb2NrSW5zdGFuY2UuZW1pdCgnYmxvY2tNb3ZlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBldmVudCB0byByZW1vdmUgYmxvY2tcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvbkJsb2NrUmVtb3ZlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tSZW1vdmVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIHBhcmFtcy5ibG9jay5lbWl0KCdibG9ja0JlZm9yZVJlbW92ZWQnKTtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZChwYXJhbXMuYmxvY2spO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcykge1xuICAgICAgICAgICAga28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMoKTtcbiAgICAgICAgfSovXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGV2ZW50IHdoZW4gYSBibG9jayBpcyBzb3J0ZWQgd2l0aGluIGl0J3MgY3VycmVudCBjb250YWluZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvbkJsb2NrU29ydGVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja1NvcnRlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBsZXQgb3JpZ2luYWxJbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZih0aGlzLmNoaWxkcmVuKCksIHBhcmFtcy5ibG9jayk7XG4gICAgICAgIGlmIChvcmlnaW5hbEluZGV4ICE9PSBwYXJhbXMuaW5kZXgpIHtcbiAgICAgICAgICAgIG1vdmVBcnJheUl0ZW0odGhpcy5jaGlsZHJlbiwgb3JpZ2luYWxJbmRleCwgcGFyYW1zLmluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbXMuYmxvY2suZW1pdCgnYmxvY2tNb3ZlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGNhbGxlZCB3aGVuIHN0YXJ0aW5nIHN0YXJ0cyBvbiB0aGlzIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvblNvcnRTdGFydChldmVudDogRXZlbnQsIHBhcmFtczogU29ydFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBsZXQgb3JpZ2luYWxFbGUgPSBqUXVlcnkocGFyYW1zLm9yaWdpbmFsRWxlKTtcbiAgICAgICAgb3JpZ2luYWxFbGUuc2hvdygpO1xuICAgICAgICBvcmlnaW5hbEVsZS5hZGRDbGFzcygnYmx1ZWZvb3Qtc29ydGluZy1vcmlnaW5hbCcpO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSB3aWR0aCAmIGhlaWdodCBvZiB0aGUgaGVscGVyXG4gICAgICAgIGpRdWVyeShwYXJhbXMuaGVscGVyKVxuICAgICAgICAgICAgLmNzcyh7d2lkdGg6ICcnLCBoZWlnaHQ6ICcnfSlcbiAgICAgICAgICAgIC5odG1sKGpRdWVyeSgnPGgzIC8+JykudGV4dCh0aGlzLnRpdGxlKS5odG1sKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGNhbGxlZCB3aGVuIHNvcnRpbmcgc3RvcHMgb24gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25Tb3J0U3RvcChldmVudDogRXZlbnQsIHBhcmFtczogU29ydFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBqUXVlcnkocGFyYW1zLm9yaWdpbmFsRWxlKS5yZW1vdmVDbGFzcygnYmx1ZWZvb3Qtc29ydGluZy1vcmlnaW5hbCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja0Ryb3BwZWRQYXJhbXMge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgYmxvY2s6IHtcbiAgICAgICAgY29uZmlnOiBvYmplY3RcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tJbnN0YW5jZURyb3BwZWRQYXJhbXMge1xuICAgIGJsb2NrSW5zdGFuY2U6IEJsb2NrLFxuICAgIGluZGV4PzogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tSZW1vdmVkUGFyYW1zIHtcbiAgICBibG9jazogQmxvY2tcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja1NvcnRlZFBhcmFtcyB7XG4gICAgYmxvY2s6IEJsb2NrXG4gICAgaW5kZXg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvcnRQYXJhbXMge1xuICAgIG9yaWdpbmFsRWxlOiBKUXVlcnlcbiAgICBwbGFjZWhvbGRlcjogSlF1ZXJ5XG4gICAgaGVscGVyPzogYW55XG59Il19
