define(['exports', '../../event-emitter', '../../block/factory', '../../../utils/array', 'underscore'], function (exports, _eventEmitter, _factory, _array, _underscore) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

    var _factory2 = _interopRequireDefault(_factory);

    var _underscore2 = _interopRequireDefault(_underscore);

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
            var originalIndex = ko.utils.arrayIndexOf(this.children(), params.block);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEudHMiXSwibmFtZXMiOlsiRWRpdGFibGVBcmVhIiwic3RhZ2UiLCJ0aXRsZSIsImJpbmRBbGwiLCJvbiIsIm9uQmxvY2tEcm9wcGVkIiwib25CbG9ja0luc3RhbmNlRHJvcHBlZCIsIm9uQmxvY2tSZW1vdmVkIiwib25CbG9ja1NvcnRlZCIsIm9uU29ydFN0YXJ0Iiwib25Tb3J0U3RvcCIsInNldENoaWxkcmVuIiwiY2hpbGRyZW4iLCJnZXRTdGFnZSIsImFkZENoaWxkIiwiY2hpbGQiLCJpbmRleCIsInBhcmVudCIsInB1c2giLCJyZW1vdmVDaGlsZCIsImV2ZW50IiwicGFyYW1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9jayIsImNvbmZpZyIsInRoZW4iLCJlbWl0IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJibG9ja0luc3RhbmNlIiwib3JpZ2luYWxJbmRleCIsImtvIiwidXRpbHMiLCJhcnJheUluZGV4T2YiLCJvcmlnaW5hbEVsZSIsImpRdWVyeSIsInNob3ciLCJhZGRDbGFzcyIsImhlbHBlciIsImNzcyIsIndpZHRoIiwiaGVpZ2h0IiwiaHRtbCIsInRleHQiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWdCY0EsWTs7O0FBS1Y7Ozs7O0FBS0EsOEJBQVlDLEtBQVosRUFBa0M7QUFBQTs7QUFBQSx5REFDOUIsd0JBRDhCOztBQVBsQyxrQkFBQUMsS0FBQSxHQUFnQixVQUFoQixDQU9rQyxDQVBOO0FBU3hCLGdCQUFJRCxLQUFKLEVBQVc7QUFDUCxzQkFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFFRCxpQ0FBRUUsT0FBRixRQUVJLGdCQUZKLEVBR0ksd0JBSEosRUFJSSxnQkFKSixFQUtJLGVBTEosRUFNSSxhQU5KLEVBT0ksWUFQSjtB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T0ksS0FBUCxDQUFhRyxJQUFiLENBQWtCLFlBQWxCO0FBQ0gsUzs7K0JBUURuQixXLHdCQUFZVyxLLEVBQWNDLE0sRUFBa0I7QUFDeEMsZ0JBQUlnQixjQUFjQyxPQUFPakIsT0FBT2dCLFdBQWQsQ0FBbEI7QUFDQUEsd0JBQVlFLElBQVo7QUFDQUYsd0JBQVlHLFFBQVosQ0FBcUIsMkJBQXJCO0FBRUE7QUFDQUYsbUJBQU9qQixPQUFPb0IsTUFBZCxFQUNLQyxHQURMLENBQ1MsRUFBQ0MsT0FBTyxFQUFSLEVBQVlDLFFBQVEsRUFBcEIsRUFEVCxFQUVLQyxJQUZMLENBRVVQLE9BQU8sUUFBUCxFQUFpQlEsSUFBakIsQ0FBc0IsS0FBSzVDLEtBQTNCLEVBQWtDMkMsSUFBbEMsRUFGVjtBQUdILFM7OytCQVFEbkMsVSx1QkFBV1UsSyxFQUFjQyxNLEVBQWtCO0FBQ3ZDaUIsbUJBQU9qQixPQUFPZ0IsV0FBZCxFQUEyQlUsV0FBM0IsQ0FBdUMsMkJBQXZDO0FBQ0gsUzs7Ozs7c0JBeExTL0MsWSIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi8uLi9ldmVudC1lbWl0dGVyJztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBCbG9jayBhcyBCbG9ja0ludGVyZmFjZSB9IGZyb20gJy4uLy4uL2Jsb2NrL2Jsb2NrLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSAnLi9hYnN0cmFjdC5kJztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCBjcmVhdGVCbG9jayBmcm9tICcuLi8uLi9ibG9jay9mYWN0b3J5JztcblxuaW1wb3J0IHsgbW92ZUFycmF5SXRlbUludG9BcnJheSwgbW92ZUFycmF5SXRlbSwgcmVtb3ZlQXJyYXlJdGVtIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IEJsb2NrIGZyb20gJy4uLy4uL2Jsb2NrL2Jsb2NrJztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIENsYXNzIEVkaXRhYmxlQXJlYVxuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0YWJsZUFyZWEgZXh0ZW5kcyBFdmVudEVtaXR0ZXIgaW1wbGVtZW50cyBFZGl0YWJsZUFyZWFJbnRlcmZhY2Uge1xuICAgIGNoaWxkcmVuOiBLbm9ja291dE9ic2VydmFibGVBcnJheTxhbnk+O1xuICAgIHN0YWdlOiBTdGFnZUludGVyZmFjZTtcbiAgICB0aXRsZTogc3RyaW5nID0gJ0VkaXRhYmxlJzsgLy8gQHRvZG8gdHJhbnNsYXRlXG5cbiAgICAvKipcbiAgICAgKiBFZGl0YWJsZUFyZWEgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN0YWdlPzogU3RhZ2VJbnRlcmZhY2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKHN0YWdlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBfLmJpbmRBbGwoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgJ29uQmxvY2tEcm9wcGVkJyxcbiAgICAgICAgICAgICdvbkJsb2NrSW5zdGFuY2VEcm9wcGVkJyxcbiAgICAgICAgICAgICdvbkJsb2NrUmVtb3ZlZCcsXG4gICAgICAgICAgICAnb25CbG9ja1NvcnRlZCcsXG4gICAgICAgICAgICAnb25Tb3J0U3RhcnQnLFxuICAgICAgICAgICAgJ29uU29ydFN0b3AnXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQXR0YWNoIGV2ZW50cyB0byBzdHJ1Y3R1cmFsIGVsZW1lbnRzXG4gICAgICAgIC8vIEJsb2NrIGRyb3BwZWQgZnJvbSBsZWZ0IGhhbmQgcGFuZWxcbiAgICAgICAgdGhpcy5vbignYmxvY2tEcm9wcGVkJywgdGhpcy5vbkJsb2NrRHJvcHBlZCk7XG4gICAgICAgIFxuICAgICAgICAvLyBCbG9jayBpbnN0YW5jZSBiZWluZyBtb3ZlZCBiZXR3ZWVuIHN0cnVjdHVyYWwgZWxlbWVudHNcbiAgICAgICAgdGhpcy5vbignYmxvY2tJbnN0YW5jZURyb3BwZWQnLCB0aGlzLm9uQmxvY2tJbnN0YW5jZURyb3BwZWQpO1xuICAgICAgICB0aGlzLm9uKCdibG9ja1JlbW92ZWQnLCB0aGlzLm9uQmxvY2tSZW1vdmVkKTtcblxuICAgICAgICAvLyBCbG9jayBzb3J0ZWQgd2l0aGluIHRoZSBzYW1lIHN0cnVjdHVyYWwgZWxlbWVudFxuICAgICAgICB0aGlzLm9uKCdibG9ja1NvcnRlZCcsIHRoaXMub25CbG9ja1NvcnRlZCk7XG5cbiAgICAgICAgdGhpcy5vbignc29ydFN0YXJ0JywgdGhpcy5vblNvcnRTdGFydCk7XG4gICAgICAgIHRoaXMub24oJ3NvcnRTdG9wJywgdGhpcy5vblNvcnRTdG9wKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGNoaWxkcmVuIG9ic2VydmFibGUgYXJyYXkgaW50byB0aGUgY2xhc3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZHJlblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzZXRDaGlsZHJlbihjaGlsZHJlbjogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55Pikge1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIHN0YWdlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7U3RhZ2VJbnRlcmZhY2V9XG4gICAgICovXG4gICAgZ2V0U3RhZ2UoKTogU3RhZ2VJbnRlcmZhY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGFnZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjaGlsZCBpbnRvIHRoZSBvYnNlcnZhYmxlIGFycmF5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRcbiAgICAgKiBAcGFyYW0gaW5kZXhcbiAgICAgKi9cbiAgICBhZGRDaGlsZChjaGlsZDogU3RydWN0dXJhbEludGVyZmFjZSwgaW5kZXg/OiBudW1iZXIpIDp2b2lkIHtcbiAgICAgICAgY2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgICAgY2hpbGQuc3RhZ2UgPSB0aGlzLnN0YWdlO1xuICAgICAgICBpZiAoaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFVzZSB0aGUgYXJyYXlVdGlsIGZ1bmN0aW9uIHRvIGFkZCB0aGUgaXRlbSBpbiB0aGUgY29ycmVjdCBwbGFjZSB3aXRoaW4gdGhlIGFycmF5XG4gICAgICAgICAgICBtb3ZlQXJyYXlJdGVtSW50b0FycmF5KGNoaWxkLCB0aGlzLmNoaWxkcmVuLCBpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY2hpbGQgZnJvbSB0aGUgb2JzZXJ2YWJsZSBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQ6IGFueSkgOnZvaWQge1xuICAgICAgICByZW1vdmVBcnJheUl0ZW0odGhpcy5jaGlsZHJlbiwgY2hpbGQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBhIGJsb2NrIGJlaW5nIGRyb3BwZWQgaW50byB0aGUgc3RydWN0dXJhbCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge1Byb21pc2U8QmxvY2t8VD59XG4gICAgICovXG4gICAgb25CbG9ja0Ryb3BwZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrRHJvcHBlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBsZXQgaW5kZXggPSBwYXJhbXMuaW5kZXggfHwgMDtcblxuICAgICAgICBuZXcgUHJvbWlzZTxCbG9ja0ludGVyZmFjZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBhcmFtcy5ibG9jaykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVCbG9jayhwYXJhbXMuYmxvY2suY29uZmlnLCB0aGlzLCB0aGlzLnN0YWdlKS50aGVuKChibG9jazogQmxvY2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChibG9jaywgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZW1pdCgnYmxvY2tSZWFkeScpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdCgnUGFyYW1ldGVyIGJsb2NrIG1pc3NpbmcgZnJvbSBldmVudC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FwdHVyZSBhIGJsb2NrIGluc3RhbmNlIGJlaW5nIGRyb3BwZWQgb250byB0aGlzIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvbkJsb2NrSW5zdGFuY2VEcm9wcGVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja0luc3RhbmNlRHJvcHBlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZENoaWxkKHBhcmFtcy5ibG9ja0luc3RhbmNlLCBwYXJhbXMuaW5kZXgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcykge1xuICAgICAgICAgICAga28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMoKTtcbiAgICAgICAgfSovXG5cbiAgICAgICAgcGFyYW1zLmJsb2NrSW5zdGFuY2UuZW1pdCgnYmxvY2tNb3ZlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBldmVudCB0byByZW1vdmUgYmxvY2tcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvbkJsb2NrUmVtb3ZlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tSZW1vdmVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIHBhcmFtcy5ibG9jay5lbWl0KCdibG9ja0JlZm9yZVJlbW92ZWQnKTtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZChwYXJhbXMuYmxvY2spO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcykge1xuICAgICAgICAgICAga28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMoKTtcbiAgICAgICAgfSovXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGV2ZW50IHdoZW4gYSBibG9jayBpcyBzb3J0ZWQgd2l0aGluIGl0J3MgY3VycmVudCBjb250YWluZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvbkJsb2NrU29ydGVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja1NvcnRlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBsZXQgb3JpZ2luYWxJbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZih0aGlzLmNoaWxkcmVuKCksIHBhcmFtcy5ibG9jayk7XG4gICAgICAgIGlmIChvcmlnaW5hbEluZGV4ICE9PSBwYXJhbXMuaW5kZXgpIHtcbiAgICAgICAgICAgIG1vdmVBcnJheUl0ZW0odGhpcy5jaGlsZHJlbiwgb3JpZ2luYWxJbmRleCwgcGFyYW1zLmluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbXMuYmxvY2suZW1pdCgnYmxvY2tNb3ZlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGNhbGxlZCB3aGVuIHN0YXJ0aW5nIHN0YXJ0cyBvbiB0aGlzIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvblNvcnRTdGFydChldmVudDogRXZlbnQsIHBhcmFtczogU29ydFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBsZXQgb3JpZ2luYWxFbGUgPSBqUXVlcnkocGFyYW1zLm9yaWdpbmFsRWxlKTtcbiAgICAgICAgb3JpZ2luYWxFbGUuc2hvdygpO1xuICAgICAgICBvcmlnaW5hbEVsZS5hZGRDbGFzcygnYmx1ZWZvb3Qtc29ydGluZy1vcmlnaW5hbCcpO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSB3aWR0aCAmIGhlaWdodCBvZiB0aGUgaGVscGVyXG4gICAgICAgIGpRdWVyeShwYXJhbXMuaGVscGVyKVxuICAgICAgICAgICAgLmNzcyh7d2lkdGg6ICcnLCBoZWlnaHQ6ICcnfSlcbiAgICAgICAgICAgIC5odG1sKGpRdWVyeSgnPGgzIC8+JykudGV4dCh0aGlzLnRpdGxlKS5odG1sKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50IGNhbGxlZCB3aGVuIHNvcnRpbmcgc3RvcHMgb24gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25Tb3J0U3RvcChldmVudDogRXZlbnQsIHBhcmFtczogU29ydFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBqUXVlcnkocGFyYW1zLm9yaWdpbmFsRWxlKS5yZW1vdmVDbGFzcygnYmx1ZWZvb3Qtc29ydGluZy1vcmlnaW5hbCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja0Ryb3BwZWRQYXJhbXMge1xuICAgIGluZGV4OiBudW1iZXIsXG4gICAgYmxvY2s6IHtcbiAgICAgICAgY29uZmlnOiBvYmplY3RcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tJbnN0YW5jZURyb3BwZWRQYXJhbXMge1xuICAgIGJsb2NrSW5zdGFuY2U6IEJsb2NrLFxuICAgIGluZGV4PzogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tSZW1vdmVkUGFyYW1zIHtcbiAgICBibG9jazogQmxvY2tcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja1NvcnRlZFBhcmFtcyB7XG4gICAgYmxvY2s6IEJsb2NrXG4gICAgaW5kZXg6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNvcnRQYXJhbXMge1xuICAgIG9yaWdpbmFsRWxlOiBKUXVlcnlcbiAgICBwbGFjZWhvbGRlcjogSlF1ZXJ5XG4gICAgaGVscGVyPzogYW55XG59Il19
