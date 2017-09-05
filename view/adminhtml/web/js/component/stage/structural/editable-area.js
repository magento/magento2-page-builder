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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEudHMiXSwibmFtZXMiOlsiRWRpdGFibGVBcmVhIiwic3RhZ2UiLCJ0aXRsZSIsImNoaWxkcmVuIiwiY2hpbGQiLCJpbmRleCIsInBhcmVudCIsInB1c2giLCJldmVudCIsInBhcmFtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYmxvY2siLCJjb25maWciLCJ0aGVuIiwiYWRkQ2hpbGQiLCJlbWl0IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJibG9ja0luc3RhbmNlIiwicmVtb3ZlQ2hpbGQiLCJvcmlnaW5hbEluZGV4Iiwia28iLCJ1dGlscyIsImFycmF5SW5kZXhPZiIsIm9yaWdpbmFsRWxlIiwialF1ZXJ5Iiwic2hvdyIsImFkZENsYXNzIiwiaGVscGVyIiwiY3NzIiwid2lkdGgiLCJoZWlnaHQiLCJodG1sIiwidGV4dCIsInJlbW92ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFnQk1BLFksV0FBQUEsWTs7O0FBS0Y7Ozs7O0FBS0EsOEJBQVlDLEtBQVosRUFBa0M7QUFBQTs7QUFBQTs7QUFQbEMsa0JBQUFDLEtBQUEsR0FBZ0IsVUFBaEIsQ0FPa0MsQ0FQTjtBQVN4QixnQkFBSUQsS0FBSixFQUFXO0FBQ1Asc0JBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNIO0FBSjZCO0FBS2pDO0FBRUQ7Ozs7Ozs7Ozt3Q0FLc0JFLFEsRUFBc0M7QUFDeEQscUJBQUtBLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0g7QUFFRDs7Ozs7Ozs7dUNBS1E7QUFDSixvQkFBSSxLQUFLRixLQUFULEVBQWdCO0FBQ1osMkJBQU8sS0FBS0EsS0FBWjtBQUNIO0FBRUQsb0JBQUksNEJBQUosRUFBMkI7QUFDdkIsMkJBQU8sSUFBUDtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7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LCJmaWxlIjoiY29tcG9uZW50L3N0YWdlL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vLi4vZXZlbnQtZW1pdHRlcic7XG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4uLy4uL3N0YWdlJztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBCbG9jayBhcyBCbG9ja0ludGVyZmFjZSB9IGZyb20gJy4uLy4uL2Jsb2NrL2Jsb2NrLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSAnLi9hYnN0cmFjdC5kJztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCBjcmVhdGVCbG9jayBmcm9tICcuLi8uLi9ibG9jay9mYWN0b3J5JztcblxuaW1wb3J0IHsgbW92ZUFycmF5SXRlbUludG9BcnJheSwgbW92ZUFycmF5SXRlbSwgcmVtb3ZlQXJyYXlJdGVtIH0gZnJvbSAndXRpbHMvYXJyYXknO1xuaW1wb3J0IHtCbG9ja30gZnJvbSBcIi4uLy4uL2Jsb2NrL2Jsb2NrXCI7XG5cbi8qKlxuICogQ2xhc3MgRWRpdGFibGVBcmVhXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxkbWFjYXVsYXlAbWFnZW50by5jb20+XG4gKi9cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZUFyZWEgZXh0ZW5kcyBFdmVudEVtaXR0ZXIgaW1wbGVtZW50cyBFZGl0YWJsZUFyZWFJbnRlcmZhY2Uge1xuICAgIGNoaWxkcmVuOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+O1xuICAgIHN0YWdlOiBTdGFnZUludGVyZmFjZTtcbiAgICB0aXRsZTogc3RyaW5nID0gJ0VkaXRhYmxlJzsgLy8gQHRvZG8gdHJhbnNsYXRlXG5cbiAgICAvKipcbiAgICAgKiBFZGl0YWJsZUFyZWEgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN0YWdlPzogU3RhZ2VJbnRlcmZhY2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKHN0YWdlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGNoaWxkcmVuIG9ic2VydmFibGUgYXJyYXkgaW50byB0aGUgY2xhc3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZHJlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzZXRDaGlsZHJlbihjaGlsZHJlbjogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55Pikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHN0YWdlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7U3RhZ2VJbnRlcmZhY2V9XG4gICAgICovXG4gICAgZ2V0U3RhZ2UoKTogU3RhZ2VJbnRlcmZhY2Uge1xuICAgICAgICBpZiAodGhpcy5zdGFnZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFN0YWdlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNoaWxkIGludG8gdGhlIG9ic2VydmFibGUgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqL1xuICAgIGFkZENoaWxkKGNoaWxkOiBTdHJ1Y3R1cmFsSW50ZXJmYWNlLCBpbmRleD86IG51bWJlcikgOnZvaWQge1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICBjaGlsZC5zdGFnZSA9IHRoaXMuc3RhZ2U7XG4gICAgICAgIGlmIChpbmRleCkge1xuICAgICAgICAgICAgLy8gVXNlIHRoZSBhcnJheVV0aWwgZnVuY3Rpb24gdG8gYWRkIHRoZSBpdGVtIGluIHRoZSBjb3JyZWN0IHBsYWNlIHdpdGhpbiB0aGUgYXJyYXlcbiAgICAgICAgICAgIG1vdmVBcnJheUl0ZW1JbnRvQXJyYXkoY2hpbGQsIHRoaXMuY2hpbGRyZW4sIGluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBjaGlsZCBmcm9tIHRoZSBvYnNlcnZhYmxlIGFycmF5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgKi9cbiAgICByZW1vdmVDaGlsZChjaGlsZDogYW55KSA6dm9pZCB7XG4gICAgICAgIHJlbW92ZUFycmF5SXRlbSh0aGlzLmNoaWxkcmVuLCBjaGlsZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGEgYmxvY2sgYmVpbmcgZHJvcHBlZCBpbnRvIHRoZSBzdHJ1Y3R1cmFsIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxCbG9ja3xUPn1cbiAgICAgKi9cbiAgICBvbkJsb2NrRHJvcHBlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tEcm9wcGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBpbmRleCA9IHBhcmFtcy5pbmRleCB8fCAwO1xuXG4gICAgICAgIG5ldyBQcm9taXNlPEJsb2NrSW50ZXJmYWNlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUJsb2NrKHBhcmFtcy5ibG9jay5jb25maWcsIHRoaXMsIHRoaXMuc3RhZ2UpLnRoZW4oKGJsb2NrOiBCbG9jaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGJsb2NrLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBibG9jay5lbWl0KCdibG9ja1JlYWR5Jyk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KCdQYXJhbWV0ZXIgYmxvY2sgbWlzc2luZyBmcm9tIGV2ZW50LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYXB0dXJlIGEgYmxvY2sgaW5zdGFuY2UgYmVpbmcgZHJvcHBlZCBvbnRvIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tJbnN0YW5jZURyb3BwZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrSW5zdGFuY2VEcm9wcGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQocGFyYW1zLmJsb2NrSW5zdGFuY2UsIHBhcmFtcy5pbmRleCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKSB7XG4gICAgICAgICAgICBrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcygpO1xuICAgICAgICB9Ki9cblxuICAgICAgICBwYXJhbXMuYmxvY2tJbnN0YW5jZS5lbWl0KCdibG9ja01vdmVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGV2ZW50IHRvIHJlbW92ZSBibG9ja1xuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tSZW1vdmVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja1JlbW92ZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgcGFyYW1zLmJsb2NrLmVtaXQoJ2Jsb2NrQmVmb3JlUmVtb3ZlZCcpO1xuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkKHBhcmFtcy5ibG9jayk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKSB7XG4gICAgICAgICAgICBrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcygpO1xuICAgICAgICB9Ki9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnQgd2hlbiBhIGJsb2NrIGlzIHNvcnRlZCB3aXRoaW4gaXQncyBjdXJyZW50IGNvbnRhaW5lclxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tTb3J0ZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrU29ydGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBvcmlnaW5hbEluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKHRoaXMuY2hpbGRyZW4oKSwgcGFyYW1zLmJsb2NrKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsSW5kZXggIT09IHBhcmFtcy5pbmRleCkge1xuICAgICAgICAgICAgbW92ZUFycmF5SXRlbSh0aGlzLmNoaWxkcmVuLCBvcmlnaW5hbEluZGV4LCBwYXJhbXMuaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtcy5ibG9jay5lbWl0KCdibG9ja01vdmVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY2FsbGVkIHdoZW4gc3RhcnRpbmcgc3RhcnRzIG9uIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uU29ydFN0YXJ0KGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBvcmlnaW5hbEVsZSA9IGpRdWVyeShwYXJhbXMub3JpZ2luYWxFbGUpO1xuICAgICAgICBvcmlnaW5hbEVsZS5zaG93KCk7XG4gICAgICAgIG9yaWdpbmFsRWxlLmFkZENsYXNzKCdibHVlZm9vdC1zb3J0aW5nLW9yaWdpbmFsJyk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHdpZHRoICYgaGVpZ2h0IG9mIHRoZSBoZWxwZXJcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5oZWxwZXIpXG4gICAgICAgICAgICAuY3NzKHt3aWR0aDogJycsIGhlaWdodDogJyd9KVxuICAgICAgICAgICAgLmh0bWwoalF1ZXJ5KCc8aDMgLz4nKS50ZXh0KHRoaXMudGl0bGUpLmh0bWwoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY2FsbGVkIHdoZW4gc29ydGluZyBzdG9wcyBvbiB0aGlzIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvblNvcnRTdG9wKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGpRdWVyeShwYXJhbXMub3JpZ2luYWxFbGUpLnJlbW92ZUNsYXNzKCdibHVlZm9vdC1zb3J0aW5nLW9yaWdpbmFsJyk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrRHJvcHBlZFBhcmFtcyB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBibG9jazoge1xuICAgICAgICBjb25maWc6IG9iamVjdFxuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja0luc3RhbmNlRHJvcHBlZFBhcmFtcyB7XG4gICAgYmxvY2tJbnN0YW5jZTogQmxvY2ssXG4gICAgaW5kZXg/OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja1JlbW92ZWRQYXJhbXMge1xuICAgIGJsb2NrOiBCbG9ja1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrU29ydGVkUGFyYW1zIHtcbiAgICBibG9jazogQmxvY2tcbiAgICBpbmRleDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ydFBhcmFtcyB7XG4gICAgb3JpZ2luYWxFbGU6IEpRdWVyeVxuICAgIHBsYWNlaG9sZGVyOiBKUXVlcnlcbiAgICBoZWxwZXI/OiBhbnlcbn0iXX0=
