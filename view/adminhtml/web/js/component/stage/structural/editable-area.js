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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEudHMiXSwibmFtZXMiOlsiRWRpdGFibGVBcmVhIiwic3RhZ2UiLCJ0aXRsZSIsImJpbmRBbGwiLCJvbiIsIm9uQmxvY2tEcm9wcGVkIiwib25CbG9ja0luc3RhbmNlRHJvcHBlZCIsIm9uQmxvY2tSZW1vdmVkIiwib25CbG9ja1NvcnRlZCIsIm9uU29ydFN0YXJ0Iiwib25Tb3J0U3RvcCIsInNldENoaWxkcmVuIiwiY2hpbGRyZW4iLCJnZXRTdGFnZSIsImFkZENoaWxkIiwiY2hpbGQiLCJpbmRleCIsInBhcmVudCIsInB1c2giLCJyZW1vdmVDaGlsZCIsImV2ZW50IiwicGFyYW1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJibG9jayIsImNvbmZpZyIsInRoZW4iLCJlbWl0IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJibG9ja0luc3RhbmNlIiwib3JpZ2luYWxJbmRleCIsImtvIiwidXRpbHMiLCJhcnJheUluZGV4T2YiLCJvcmlnaW5hbEVsZSIsImpRdWVyeSIsInNob3ciLCJhZGRDbGFzcyIsImhlbHBlciIsImNzcyIsIndpZHRoIiwiaGVpZ2h0IiwiaHRtbCIsInRleHQiLCJyZW1vdmVDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWdCY0EsWTs7O0FBS1Y7Ozs7O0FBS0EsOEJBQVlDLEtBQVosRUFBa0M7QUFBQTs7QUFBQSx5REFDOUIsd0JBRDhCOztBQVBsQyxrQkFBQUMsS0FBQSxHQUFnQixVQUFoQixDQU9rQyxDQVBOO0FBU3hCLGdCQUFJRCxLQUFKLEVBQVc7QUFDUCxzQkFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFFRCxpQ0FBRUUsT0FBRixRQUVJLGdCQUZKLEVBR0ksd0JBSEosRUFJSSxnQkFKSixFQUtJLGVBTEosRUFNSSxhQU5KLEVBT0ksWUFQSjtB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T0ksS0FBUCxDQUFhRyxJQUFiLENBQWtCLFlBQWxCO0FBQ0gsUzs7K0JBUURuQixXLHdCQUFZVyxLLEVBQWNDLE0sRUFBa0I7QUFDeEMsZ0JBQUlnQixjQUFjQyxPQUFPakIsT0FBT2dCLFdBQWQsQ0FBbEI7QUFDQUEsd0JBQVlFLElBQVo7QUFDQUYsd0JBQVlHLFFBQVosQ0FBcUIsMkJBQXJCO0FBRUE7QUFDQUYsbUJBQU9qQixPQUFPb0IsTUFBZCxFQUNLQyxHQURMLENBQ1MsRUFBQ0MsT0FBTyxFQUFSLEVBQVlDLFFBQVEsRUFBcEIsRUFEVCxFQUVLQyxJQUZMLENBRVVQLE9BQU8sUUFBUCxFQUFpQlEsSUFBakIsQ0FBc0IsS0FBSzVDLEtBQTNCLEVBQWtDMkMsSUFBbEMsRUFGVjtBQUdILFM7OytCQVFEbkMsVSx1QkFBV1UsSyxFQUFjQyxNLEVBQWtCO0FBQ3ZDaUIsbUJBQU9qQixPQUFPZ0IsV0FBZCxFQUEyQlUsV0FBM0IsQ0FBdUMsMkJBQXZDO0FBQ0gsUzs7Ozs7c0JBeExTL0MsWSIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2Uvc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi8uLi9ldmVudC1lbWl0dGVyJztcbmltcG9ydCB7IFN0YWdlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vc3RhZ2UuZCc7XG5pbXBvcnQgeyBCbG9jayBhcyBCbG9ja0ludGVyZmFjZSB9IGZyb20gJy4uLy4uL2Jsb2NrL2Jsb2NrLmQnO1xuaW1wb3J0IHsgU3RydWN0dXJhbCBhcyBTdHJ1Y3R1cmFsSW50ZXJmYWNlIH0gZnJvbSAnLi9hYnN0cmFjdC5kJztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCBjcmVhdGVCbG9jayBmcm9tICcuLi8uLi9ibG9jay9mYWN0b3J5JztcblxuaW1wb3J0IHsgbW92ZUFycmF5SXRlbUludG9BcnJheSwgbW92ZUFycmF5SXRlbSwgcmVtb3ZlQXJyYXlJdGVtIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuLi8uLi9ibG9jay9ibG9jayc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuLyoqXG4gKiBDbGFzcyBFZGl0YWJsZUFyZWFcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdGFibGVBcmVhIGV4dGVuZHMgRXZlbnRFbWl0dGVyIGltcGxlbWVudHMgRWRpdGFibGVBcmVhSW50ZXJmYWNlIHtcbiAgICBjaGlsZHJlbjogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PjtcbiAgICBzdGFnZTogU3RhZ2VJbnRlcmZhY2U7XG4gICAgdGl0bGU6IHN0cmluZyA9ICdFZGl0YWJsZSc7IC8vIEB0b2RvIHRyYW5zbGF0ZVxuXG4gICAgLyoqXG4gICAgICogRWRpdGFibGVBcmVhIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGFnZT86IFN0YWdlSW50ZXJmYWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmIChzdGFnZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5iaW5kQWxsKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICdvbkJsb2NrRHJvcHBlZCcsXG4gICAgICAgICAgICAnb25CbG9ja0luc3RhbmNlRHJvcHBlZCcsXG4gICAgICAgICAgICAnb25CbG9ja1JlbW92ZWQnLFxuICAgICAgICAgICAgJ29uQmxvY2tTb3J0ZWQnLFxuICAgICAgICAgICAgJ29uU29ydFN0YXJ0JyxcbiAgICAgICAgICAgICdvblNvcnRTdG9wJ1xuICAgICAgICApO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudHMgdG8gc3RydWN0dXJhbCBlbGVtZW50c1xuICAgICAgICAvLyBCbG9jayBkcm9wcGVkIGZyb20gbGVmdCBoYW5kIHBhbmVsXG4gICAgICAgIHRoaXMub24oJ2Jsb2NrRHJvcHBlZCcsIHRoaXMub25CbG9ja0Ryb3BwZWQpO1xuICAgICAgICBcbiAgICAgICAgLy8gQmxvY2sgaW5zdGFuY2UgYmVpbmcgbW92ZWQgYmV0d2VlbiBzdHJ1Y3R1cmFsIGVsZW1lbnRzXG4gICAgICAgIHRoaXMub24oJ2Jsb2NrSW5zdGFuY2VEcm9wcGVkJywgdGhpcy5vbkJsb2NrSW5zdGFuY2VEcm9wcGVkKTtcbiAgICAgICAgdGhpcy5vbignYmxvY2tSZW1vdmVkJywgdGhpcy5vbkJsb2NrUmVtb3ZlZCk7XG5cbiAgICAgICAgLy8gQmxvY2sgc29ydGVkIHdpdGhpbiB0aGUgc2FtZSBzdHJ1Y3R1cmFsIGVsZW1lbnRcbiAgICAgICAgdGhpcy5vbignYmxvY2tTb3J0ZWQnLCB0aGlzLm9uQmxvY2tTb3J0ZWQpO1xuXG4gICAgICAgIHRoaXMub24oJ3NvcnRTdGFydCcsIHRoaXMub25Tb3J0U3RhcnQpO1xuICAgICAgICB0aGlzLm9uKCdzb3J0U3RvcCcsIHRoaXMub25Tb3J0U3RvcCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjaGlsZHJlbiBvYnNlcnZhYmxlIGFycmF5IGludG8gdGhlIGNsYXNzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRyZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2V0Q2hpbGRyZW4oY2hpbGRyZW46IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4pIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBzdGFnZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHJldHVybnMge1N0YWdlSW50ZXJmYWNlfVxuICAgICAqL1xuICAgIGdldFN0YWdlKCk6IFN0YWdlSW50ZXJmYWNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY2hpbGQgaW50byB0aGUgb2JzZXJ2YWJsZSBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgYWRkQ2hpbGQoY2hpbGQ6IFN0cnVjdHVyYWxJbnRlcmZhY2UsIGluZGV4PzogbnVtYmVyKSA6dm9pZCB7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIGNoaWxkLnN0YWdlID0gdGhpcy5zdGFnZTtcbiAgICAgICAgaWYgKGluZGV4KSB7XG4gICAgICAgICAgICAvLyBVc2UgdGhlIGFycmF5VXRpbCBmdW5jdGlvbiB0byBhZGQgdGhlIGl0ZW0gaW4gdGhlIGNvcnJlY3QgcGxhY2Ugd2l0aGluIHRoZSBhcnJheVxuICAgICAgICAgICAgbW92ZUFycmF5SXRlbUludG9BcnJheShjaGlsZCwgdGhpcy5jaGlsZHJlbiwgaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNoaWxkIGZyb20gdGhlIG9ic2VydmFibGUgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkKGNoaWxkOiBhbnkpIDp2b2lkIHtcbiAgICAgICAgcmVtb3ZlQXJyYXlJdGVtKHRoaXMuY2hpbGRyZW4sIGNoaWxkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgYSBibG9jayBiZWluZyBkcm9wcGVkIGludG8gdGhlIHN0cnVjdHVyYWwgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEJsb2NrfFQ+fVxuICAgICAqL1xuICAgIG9uQmxvY2tEcm9wcGVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja0Ryb3BwZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IGluZGV4ID0gcGFyYW1zLmluZGV4IHx8IDA7XG5cbiAgICAgICAgbmV3IFByb21pc2U8QmxvY2tJbnRlcmZhY2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuYmxvY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQmxvY2socGFyYW1zLmJsb2NrLmNvbmZpZywgdGhpcywgdGhpcy5zdGFnZSkudGhlbigoYmxvY2s6IEJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoYmxvY2ssIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmVtaXQoJ2Jsb2NrUmVhZHknKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3I6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoJ1BhcmFtZXRlciBibG9jayBtaXNzaW5nIGZyb20gZXZlbnQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhcHR1cmUgYSBibG9jayBpbnN0YW5jZSBiZWluZyBkcm9wcGVkIG9udG8gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja0luc3RhbmNlRHJvcHBlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tJbnN0YW5jZURyb3BwZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChwYXJhbXMuYmxvY2tJbnN0YW5jZSwgcGFyYW1zLmluZGV4KTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoa28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMpIHtcbiAgICAgICAgICAgIGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKCk7XG4gICAgICAgIH0qL1xuXG4gICAgICAgIHBhcmFtcy5ibG9ja0luc3RhbmNlLmVtaXQoJ2Jsb2NrTW92ZWQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnQgdG8gcmVtb3ZlIGJsb2NrXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja1JlbW92ZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrUmVtb3ZlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBwYXJhbXMuYmxvY2suZW1pdCgnYmxvY2tCZWZvcmVSZW1vdmVkJyk7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQocGFyYW1zLmJsb2NrKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoa28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMpIHtcbiAgICAgICAgICAgIGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKCk7XG4gICAgICAgIH0qL1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBldmVudCB3aGVuIGEgYmxvY2sgaXMgc29ydGVkIHdpdGhpbiBpdCdzIGN1cnJlbnQgY29udGFpbmVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja1NvcnRlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tTb3J0ZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsSW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YodGhpcy5jaGlsZHJlbigpLCBwYXJhbXMuYmxvY2spO1xuICAgICAgICBpZiAob3JpZ2luYWxJbmRleCAhPT0gcGFyYW1zLmluZGV4KSB7XG4gICAgICAgICAgICBtb3ZlQXJyYXlJdGVtKHRoaXMuY2hpbGRyZW4sIG9yaWdpbmFsSW5kZXgsIHBhcmFtcy5pbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1zLmJsb2NrLmVtaXQoJ2Jsb2NrTW92ZWQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBjYWxsZWQgd2hlbiBzdGFydGluZyBzdGFydHMgb24gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25Tb3J0U3RhcnQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IFNvcnRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsRWxlID0galF1ZXJ5KHBhcmFtcy5vcmlnaW5hbEVsZSk7XG4gICAgICAgIG9yaWdpbmFsRWxlLnNob3coKTtcbiAgICAgICAgb3JpZ2luYWxFbGUuYWRkQ2xhc3MoJ2JsdWVmb290LXNvcnRpbmctb3JpZ2luYWwnKTtcblxuICAgICAgICAvLyBSZXNldCB0aGUgd2lkdGggJiBoZWlnaHQgb2YgdGhlIGhlbHBlclxuICAgICAgICBqUXVlcnkocGFyYW1zLmhlbHBlcilcbiAgICAgICAgICAgIC5jc3Moe3dpZHRoOiAnJywgaGVpZ2h0OiAnJ30pXG4gICAgICAgICAgICAuaHRtbChqUXVlcnkoJzxoMyAvPicpLnRleHQodGhpcy50aXRsZSkuaHRtbCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBjYWxsZWQgd2hlbiBzb3J0aW5nIHN0b3BzIG9uIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uU29ydFN0b3AoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IFNvcnRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5vcmlnaW5hbEVsZSkucmVtb3ZlQ2xhc3MoJ2JsdWVmb290LXNvcnRpbmctb3JpZ2luYWwnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tEcm9wcGVkUGFyYW1zIHtcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIGJsb2NrOiB7XG4gICAgICAgIGNvbmZpZzogb2JqZWN0XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrSW5zdGFuY2VEcm9wcGVkUGFyYW1zIHtcbiAgICBibG9ja0luc3RhbmNlOiBCbG9jayxcbiAgICBpbmRleD86IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrUmVtb3ZlZFBhcmFtcyB7XG4gICAgYmxvY2s6IEJsb2NrXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tTb3J0ZWRQYXJhbXMge1xuICAgIGJsb2NrOiBCbG9ja1xuICAgIGluZGV4OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTb3J0UGFyYW1zIHtcbiAgICBvcmlnaW5hbEVsZTogSlF1ZXJ5XG4gICAgcGxhY2Vob2xkZXI6IEpRdWVyeVxuICAgIGhlbHBlcj86IGFueVxufSJdfQ==
