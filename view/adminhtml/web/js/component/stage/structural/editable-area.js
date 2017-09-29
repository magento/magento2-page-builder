define(['exports', '../../event-emitter', '../../block/factory', '../../../utils/array', 'underscore', 'knockout', 'mageUtils', 'mage/translate'], function (exports, _eventEmitter, _factory, _array, _underscore, _knockout, _mageUtils, _translate) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

    var _factory2 = _interopRequireDefault(_factory);

    var _underscore2 = _interopRequireDefault(_underscore);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _mageUtils2 = _interopRequireDefault(_mageUtils);

    var _translate2 = _interopRequireDefault(_translate);

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

            _this.id = _mageUtils2.default.uniqueid();
            _this.title = (0, _translate2.default)('Editable');
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
            // Remove the instance from the data store
            this.stage.store.remove(this.id);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEudHMiXSwibmFtZXMiOlsiRWRpdGFibGVBcmVhIiwic3RhZ2UiLCJpZCIsInVuaXF1ZWlkIiwidGl0bGUiLCJiaW5kQWxsIiwib24iLCJvbkJsb2NrRHJvcHBlZCIsIm9uQmxvY2tJbnN0YW5jZURyb3BwZWQiLCJvbkJsb2NrUmVtb3ZlZCIsIm9uQmxvY2tTb3J0ZWQiLCJvblNvcnRTdGFydCIsIm9uU29ydFN0b3AiLCJzZXRDaGlsZHJlbiIsImNoaWxkcmVuIiwiZ2V0U3RhZ2UiLCJhZGRDaGlsZCIsImNoaWxkIiwiaW5kZXgiLCJwYXJlbnQiLCJwdXNoIiwicmVtb3ZlQ2hpbGQiLCJldmVudCIsInBhcmFtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYmxvY2siLCJjb25maWciLCJ0aGVuIiwiZW1pdCIsImNhdGNoIiwiZXJyb3IiLCJjb25zb2xlIiwiYmxvY2tJbnN0YW5jZSIsInN0b3JlIiwicmVtb3ZlIiwib3JpZ2luYWxJbmRleCIsInV0aWxzIiwiYXJyYXlJbmRleE9mIiwib3JpZ2luYWxFbGUiLCJqUXVlcnkiLCJzaG93IiwiYWRkQ2xhc3MiLCJoZWxwZXIiLCJjc3MiLCJ3aWR0aCIsImhlaWdodCIsImh0bWwiLCJ0ZXh0IiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFvQmNBLFk7OztBQU1WOzs7OztBQUtBLDhCQUFZQyxLQUFaLEVBQWtDO0FBQUE7O0FBQUEseURBQzlCLHdCQUQ4Qjs7QUFWbEMsa0JBQUFDLEVBQUEsR0FBYSxvQkFBVUMsUUFBVixFQUFiO0FBR0Esa0JBQUFDLEtBQUEsR0FBZ0IseUJBQUcsVUFBSCxDQUFoQjtBQVNJLGdCQUFJSCxLQUFKLEVBQVc7QUFDUCxzQkFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFFRCxpQ0FB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QUF0QixFQUF1Q1MsT0FBT0ksS0FBOUMsQ0FBcEI7QUFDQSxnQkFBSVUsa0JBQWtCZCxPQUFPTCxLQUE3QixFQUFvQztBQUNoQywwQ0FBYyxLQUFLSixRQUFuQixFQUE2QnVCLGFBQTdCLEVBQTRDZCxPQUFPTCxLQUFuRDtBQUNIO0FBQ0RLLG1CQUFPSSxLQUFQLENBQWFHLElBQWIsQ0FBa0IsWUFBbEI7QUFDSCxTOzsrQkFRRG5CLFcsd0JBQVlXLEssRUFBY0MsTSxFQUFrQjtBQUN4QyxnQkFBSWlCLGNBQWNDLE9BQU9sQixPQUFPaUIsV0FBZCxDQUFsQjtBQUNBQSx3QkFBWUUsSUFBWjtBQUNBRix3QkFBWUcsUUFBWixDQUFxQiwyQkFBckI7QUFFQTtBQUNBRixtQkFBT2xCLE9BQU9xQixNQUFkLEVBQ0tDLEdBREwsQ0FDUyxFQUFDQyxPQUFPLEVBQVIsRUFBWUMsUUFBUSxFQUFwQixFQURULEVBRUtDLElBRkwsQ0FFVVAsT0FBTyxRQUFQLEVBQWlCUSxJQUFqQixDQUFzQixLQUFLN0MsS0FBM0IsRUFBa0M0QyxJQUFsQyxFQUZWO0FBR0gsUzs7K0JBUURwQyxVLHVCQUFXVSxLLEVBQWNDLE0sRUFBa0I7QUFDdkNrQixtQkFBT2xCLE9BQU9pQixXQUFkLEVBQTJCVSxXQUEzQixDQUF1QywyQkFBdkM7QUFDSCxTOzs7OztzQkE1TFNsRCxZIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uLy4uL2V2ZW50LWVtaXR0ZXInO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9zdGFnZS5kJztcbmltcG9ydCB7IEJsb2NrIGFzIEJsb2NrSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vYmxvY2svYmxvY2suZCc7XG5pbXBvcnQgeyBTdHJ1Y3R1cmFsIGFzIFN0cnVjdHVyYWxJbnRlcmZhY2UgfSBmcm9tICcuL2Fic3RyYWN0LmQnO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IGNyZWF0ZUJsb2NrIGZyb20gJy4uLy4uL2Jsb2NrL2ZhY3RvcnknO1xuXG5pbXBvcnQgeyBtb3ZlQXJyYXlJdGVtSW50b0FycmF5LCBtb3ZlQXJyYXlJdGVtLCByZW1vdmVBcnJheUl0ZW0gfSBmcm9tICcuLi8uLi8uLi91dGlscy9hcnJheSc7XG5pbXBvcnQgQmxvY2sgZnJvbSAnLi4vLi4vYmxvY2svYmxvY2snO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQga28gZnJvbSAna25vY2tvdXQnO1xuXG5pbXBvcnQgbWFnZVV0aWxzIGZyb20gJ21hZ2VVdGlscyc7XG5pbXBvcnQgJHQgZnJvbSAnbWFnZS90cmFuc2xhdGUnO1xuXG4vKipcbiAqIENsYXNzIEVkaXRhYmxlQXJlYVxuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8ZG1hY2F1bGF5QG1hZ2VudG8uY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0YWJsZUFyZWEgZXh0ZW5kcyBFdmVudEVtaXR0ZXIgaW1wbGVtZW50cyBFZGl0YWJsZUFyZWFJbnRlcmZhY2Uge1xuICAgIGlkOiBzdHJpbmcgPSBtYWdlVXRpbHMudW5pcXVlaWQoKTtcbiAgICBjaGlsZHJlbjogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PjtcbiAgICBzdGFnZTogU3RhZ2VJbnRlcmZhY2U7XG4gICAgdGl0bGU6IHN0cmluZyA9ICR0KCdFZGl0YWJsZScpO1xuXG4gICAgLyoqXG4gICAgICogRWRpdGFibGVBcmVhIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGFnZT86IFN0YWdlSW50ZXJmYWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmIChzdGFnZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5iaW5kQWxsKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICdvbkJsb2NrRHJvcHBlZCcsXG4gICAgICAgICAgICAnb25CbG9ja0luc3RhbmNlRHJvcHBlZCcsXG4gICAgICAgICAgICAnb25CbG9ja1JlbW92ZWQnLFxuICAgICAgICAgICAgJ29uQmxvY2tTb3J0ZWQnLFxuICAgICAgICAgICAgJ29uU29ydFN0YXJ0JyxcbiAgICAgICAgICAgICdvblNvcnRTdG9wJ1xuICAgICAgICApO1xuXG4gICAgICAgIC8vIEF0dGFjaCBldmVudHMgdG8gc3RydWN0dXJhbCBlbGVtZW50c1xuICAgICAgICAvLyBCbG9jayBkcm9wcGVkIGZyb20gbGVmdCBoYW5kIHBhbmVsXG4gICAgICAgIHRoaXMub24oJ2Jsb2NrRHJvcHBlZCcsIHRoaXMub25CbG9ja0Ryb3BwZWQpO1xuICAgICAgICBcbiAgICAgICAgLy8gQmxvY2sgaW5zdGFuY2UgYmVpbmcgbW92ZWQgYmV0d2VlbiBzdHJ1Y3R1cmFsIGVsZW1lbnRzXG4gICAgICAgIHRoaXMub24oJ2Jsb2NrSW5zdGFuY2VEcm9wcGVkJywgdGhpcy5vbkJsb2NrSW5zdGFuY2VEcm9wcGVkKTtcbiAgICAgICAgdGhpcy5vbignYmxvY2tSZW1vdmVkJywgdGhpcy5vbkJsb2NrUmVtb3ZlZCk7XG5cbiAgICAgICAgLy8gQmxvY2sgc29ydGVkIHdpdGhpbiB0aGUgc2FtZSBzdHJ1Y3R1cmFsIGVsZW1lbnRcbiAgICAgICAgdGhpcy5vbignYmxvY2tTb3J0ZWQnLCB0aGlzLm9uQmxvY2tTb3J0ZWQpO1xuXG4gICAgICAgIHRoaXMub24oJ3NvcnRTdGFydCcsIHRoaXMub25Tb3J0U3RhcnQpO1xuICAgICAgICB0aGlzLm9uKCdzb3J0U3RvcCcsIHRoaXMub25Tb3J0U3RvcCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjaGlsZHJlbiBvYnNlcnZhYmxlIGFycmF5IGludG8gdGhlIGNsYXNzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRyZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2V0Q2hpbGRyZW4oY2hpbGRyZW46IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4pIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBzdGFnZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHJldHVybnMge1N0YWdlSW50ZXJmYWNlfVxuICAgICAqL1xuICAgIGdldFN0YWdlKCk6IFN0YWdlSW50ZXJmYWNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY2hpbGQgaW50byB0aGUgb2JzZXJ2YWJsZSBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgYWRkQ2hpbGQoY2hpbGQ6IFN0cnVjdHVyYWxJbnRlcmZhY2UsIGluZGV4PzogbnVtYmVyKSA6dm9pZCB7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIGNoaWxkLnN0YWdlID0gdGhpcy5zdGFnZTtcbiAgICAgICAgaWYgKGluZGV4KSB7XG4gICAgICAgICAgICAvLyBVc2UgdGhlIGFycmF5VXRpbCBmdW5jdGlvbiB0byBhZGQgdGhlIGl0ZW0gaW4gdGhlIGNvcnJlY3QgcGxhY2Ugd2l0aGluIHRoZSBhcnJheVxuICAgICAgICAgICAgbW92ZUFycmF5SXRlbUludG9BcnJheShjaGlsZCwgdGhpcy5jaGlsZHJlbiwgaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNoaWxkIGZyb20gdGhlIG9ic2VydmFibGUgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkKGNoaWxkOiBhbnkpIDp2b2lkIHtcbiAgICAgICAgcmVtb3ZlQXJyYXlJdGVtKHRoaXMuY2hpbGRyZW4sIGNoaWxkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgYSBibG9jayBiZWluZyBkcm9wcGVkIGludG8gdGhlIHN0cnVjdHVyYWwgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEJsb2NrfFQ+fVxuICAgICAqL1xuICAgIG9uQmxvY2tEcm9wcGVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja0Ryb3BwZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IGluZGV4ID0gcGFyYW1zLmluZGV4IHx8IDA7XG5cbiAgICAgICAgbmV3IFByb21pc2U8QmxvY2tJbnRlcmZhY2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuYmxvY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQmxvY2socGFyYW1zLmJsb2NrLmNvbmZpZywgdGhpcywgdGhpcy5zdGFnZSkudGhlbigoYmxvY2s6IEJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoYmxvY2ssIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmVtaXQoJ2Jsb2NrUmVhZHknKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3I6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoJ1BhcmFtZXRlciBibG9jayBtaXNzaW5nIGZyb20gZXZlbnQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhcHR1cmUgYSBibG9jayBpbnN0YW5jZSBiZWluZyBkcm9wcGVkIG9udG8gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja0luc3RhbmNlRHJvcHBlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tJbnN0YW5jZURyb3BwZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChwYXJhbXMuYmxvY2tJbnN0YW5jZSwgcGFyYW1zLmluZGV4KTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoa28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMpIHtcbiAgICAgICAgICAgIGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKCk7XG4gICAgICAgIH0qL1xuXG4gICAgICAgIHBhcmFtcy5ibG9ja0luc3RhbmNlLmVtaXQoJ2Jsb2NrTW92ZWQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnQgdG8gcmVtb3ZlIGJsb2NrXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja1JlbW92ZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrUmVtb3ZlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBwYXJhbXMuYmxvY2suZW1pdCgnYmxvY2tCZWZvcmVSZW1vdmVkJyk7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQocGFyYW1zLmJsb2NrKTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGluc3RhbmNlIGZyb20gdGhlIGRhdGEgc3RvcmVcbiAgICAgICAgdGhpcy5zdGFnZS5zdG9yZS5yZW1vdmUodGhpcy5pZCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKSB7XG4gICAgICAgICAgICBrby5wcm9jZXNzQWxsRGVmZXJyZWRCaW5kaW5nVXBkYXRlcygpO1xuICAgICAgICB9Ki9cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnQgd2hlbiBhIGJsb2NrIGlzIHNvcnRlZCB3aXRoaW4gaXQncyBjdXJyZW50IGNvbnRhaW5lclxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uQmxvY2tTb3J0ZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrU29ydGVkUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBvcmlnaW5hbEluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKHRoaXMuY2hpbGRyZW4oKSwgcGFyYW1zLmJsb2NrKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsSW5kZXggIT09IHBhcmFtcy5pbmRleCkge1xuICAgICAgICAgICAgbW92ZUFycmF5SXRlbSh0aGlzLmNoaWxkcmVuLCBvcmlnaW5hbEluZGV4LCBwYXJhbXMuaW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtcy5ibG9jay5lbWl0KCdibG9ja01vdmVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY2FsbGVkIHdoZW4gc3RhcnRpbmcgc3RhcnRzIG9uIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uU29ydFN0YXJ0KGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGxldCBvcmlnaW5hbEVsZSA9IGpRdWVyeShwYXJhbXMub3JpZ2luYWxFbGUpO1xuICAgICAgICBvcmlnaW5hbEVsZS5zaG93KCk7XG4gICAgICAgIG9yaWdpbmFsRWxlLmFkZENsYXNzKCdibHVlZm9vdC1zb3J0aW5nLW9yaWdpbmFsJyk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHdpZHRoICYgaGVpZ2h0IG9mIHRoZSBoZWxwZXJcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5oZWxwZXIpXG4gICAgICAgICAgICAuY3NzKHt3aWR0aDogJycsIGhlaWdodDogJyd9KVxuICAgICAgICAgICAgLmh0bWwoalF1ZXJ5KCc8aDMgLz4nKS50ZXh0KHRoaXMudGl0bGUpLmh0bWwoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnQgY2FsbGVkIHdoZW4gc29ydGluZyBzdG9wcyBvbiB0aGlzIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBvblNvcnRTdG9wKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBTb3J0UGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGpRdWVyeShwYXJhbXMub3JpZ2luYWxFbGUpLnJlbW92ZUNsYXNzKCdibHVlZm9vdC1zb3J0aW5nLW9yaWdpbmFsJyk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrRHJvcHBlZFBhcmFtcyB7XG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBibG9jazoge1xuICAgICAgICBjb25maWc6IG9iamVjdFxuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja0luc3RhbmNlRHJvcHBlZFBhcmFtcyB7XG4gICAgYmxvY2tJbnN0YW5jZTogQmxvY2ssXG4gICAgaW5kZXg/OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCbG9ja1JlbW92ZWRQYXJhbXMge1xuICAgIGJsb2NrOiBCbG9ja1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrU29ydGVkUGFyYW1zIHtcbiAgICBibG9jazogQmxvY2tcbiAgICBpbmRleDogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU29ydFBhcmFtcyB7XG4gICAgb3JpZ2luYWxFbGU6IEpRdWVyeVxuICAgIHBsYWNlaG9sZGVyOiBKUXVlcnlcbiAgICBoZWxwZXI/OiBhbnlcbn0iXX0=
