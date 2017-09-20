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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEudHMiXSwibmFtZXMiOlsiRWRpdGFibGVBcmVhIiwic3RhZ2UiLCJ0aXRsZSIsImNoaWxkcmVuIiwiY2hpbGQiLCJpbmRleCIsInBhcmVudCIsInB1c2giLCJldmVudCIsInBhcmFtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYmxvY2siLCJjb25maWciLCJ0aGVuIiwiYWRkQ2hpbGQiLCJlbWl0IiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJibG9ja0luc3RhbmNlIiwicmVtb3ZlQ2hpbGQiLCJvcmlnaW5hbEluZGV4Iiwia28iLCJ1dGlscyIsImFycmF5SW5kZXhPZiIsIm9yaWdpbmFsRWxlIiwialF1ZXJ5Iiwic2hvdyIsImFkZENsYXNzIiwiaGVscGVyIiwiY3NzIiwid2lkdGgiLCJoZWlnaHQiLCJodG1sIiwidGV4dCIsInJlbW92ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWVjQSxZOzs7QUFLVjs7Ozs7QUFLQSw4QkFBWUMsS0FBWixFQUFrQztBQUFBOztBQUFBOztBQVBsQyxrQkFBQUMsS0FBQSxHQUFnQixVQUFoQixDQU9rQyxDQVBOO0FBU3hCLGdCQUFJRCxLQUFKLEVBQVc7QUFDUCxzQkFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0g7QUFKNkI7QUFLakM7QUFFRDs7Ozs7Ozs7O3dDQUtzQkUsUSxFQUFzQztBQUN4RCxxQkFBS0EsUUFBTCxHQUFnQkEsUUFBaEI7QUFDSDs7O3VDQU9PO0FBQ0osdUJBQU8sS0FBS0YsS0FBWjtBQUNIOzs7cUNBUVFHLEssRUFBNEJDLEssRUFBYztBQUMvQ0Qsc0JBQU1FLE1BQU4sR0FBZSxJQUFmO0FBQ0FGLHNCQUFNSCxLQUFOLEdBQWMsS0FBS0EsS0FBbkI7QUFDQSxvQkFBSUksS0FBSixFQUFXO0FBQ1A7QUFDQSx1REFBdUJELEtBQXZCLEVBQThCLEtBQUtELFFBQW5DLEVBQTZDRSxLQUE3QztBQUNILGlCQUhELE1BR087QUFDSCx5QkFBS0YsUUFBTCxDQUFjSSxJQUFkLENBQW1CSCxLQUFuQjtBQUNIO0FBQ0o7Ozt3Q0FPV0EsSyxFQUFVO0FBQ2xCLDRDQUFnQixLQUFLRCxRQUFyQixFQUErQkMsS0FBL0I7QUFDSDs7OzJDQVNjSSxLLEVBQWNDLE0sRUFBMEI7QUFBQTs7QUFDbkQsb0JBQUlKLFFBQVFJLE9BQU9KLEtBQVAsSUFBZ0IsQ0FBNUI7QUFFQSxvQkFBSUssT0FBSixDQUE0QixVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBZ0I7QUFDeEMsd0JBQUlILE9BQU9JLEtBQVgsRUFBa0I7QUFDZCwrQkFBTyx1QkFBWUosT0FBT0ksS0FBUCxDQUFhQyxNQUF6QixVQUF1QyxPQUFLYixLQUE1QyxFQUFtRGMsSUFBbkQsQ0FBd0QsVUFBQ0YsS0FBRCxFQUFhO0FBQ3hFLG1DQUFLRyxRQUFMLENBQWNILEtBQWQsRUFBcUJSLEtBQXJCO0FBQ0FNLG9DQUFRRSxLQUFSO0FBQ0FBLGtDQUFNSSxJQUFOLENBQVcsWUFBWDtBQUNILHlCQUpNLEVBSUpDLEtBSkksQ0FJRSxVQUFVQyxLQUFWLEVBQXVCO0FBQzVCUCxtQ0FBT08sS0FBUDtBQUNILHlCQU5NLENBQVA7QUFPSCxxQkFSRCxNQVFPO0FBQ0hQLCtCQUFPLHFDQUFQO0FBQ0g7QUFDSixpQkFaRCxFQVlHTSxLQVpILENBWVMsVUFBVUMsS0FBVixFQUFlO0FBQ3BCQyw0QkFBUUQsS0FBUixDQUFjQSxLQUFkO0FBQ0gsaUJBZEQ7QUFlSDs7O21EQVFzQlgsSyxFQUFjQyxNLEVBQWtDO0FBQ25FLHFCQUFLTyxRQUFMLENBQWNQLE9BQU9ZLGFBQXJCLEVBQW9DWixPQUFPSixLQUEzQztBQUVBOzs7O0FBS0FJLHVCQUFPWSxhQUFQLENBQXFCSixJQUFyQixDQUEwQixZQUExQjtBQUNIOzs7MkNBUWNULEssRUFBY0MsTSxFQUEwQjtBQUNuREEsdUJBQU9JLEtBQVAsQ0FBYUksSUFBYixDQUFrQixvQkFBbEI7QUFDQSxxQkFBS0ssV0FBTCxDQUFpQmIsT0FBT0ksS0FBeEI7QUFFQTs7OztBQUlIOzs7MENBUWFMLEssRUFBY0MsTSxFQUF5QjtBQUNqRCxvQkFBSWMsZ0JBQWdCQyxHQUFHQyxLQUFILENBQVNDLFlBQVQsQ0FBc0IsS0FBS3ZCLFFBQUwsRUFBdEIsRUFBdUNNLE9BQU9JLEtBQTlDLENBQXBCO0FBQ0Esb0JBQUlVLGtCQUFrQmQsT0FBT0osS0FBN0IsRUFBb0M7QUFDaEMsOENBQWMsS0FBS0YsUUFBbkIsRUFBNkJvQixhQUE3QixFQUE0Q2QsT0FBT0osS0FBbkQ7QUFDSDtBQUNESSx1QkFBT0ksS0FBUCxDQUFhSSxJQUFiLENBQWtCLFlBQWxCO0FBQ0g7Ozt3Q0FRV1QsSyxFQUFjQyxNLEVBQWtCO0FBQ3hDLG9CQUFJa0IsY0FBY0MsT0FBT25CLE9BQU9rQixXQUFkLENBQWxCO0FBQ0FBLDRCQUFZRSxJQUFaO0FBQ0FGLDRCQUFZRyxRQUFaLENBQXFCLDJCQUFyQjtBQUVBO0FBQ0FGLHVCQUFPbkIsT0FBT3NCLE1BQWQsRUFDS0MsR0FETCxDQUNTLEVBQUNDLE9BQU8sRUFBUixFQUFZQyxRQUFRLEVBQXBCLEVBRFQsRUFFS0MsSUFGTCxDQUVVUCxPQUFPLFFBQVAsRUFBaUJRLElBQWpCLENBQXNCLEtBQUtsQyxLQUEzQixFQUFrQ2lDLElBQWxDLEVBRlY7QUFHSDs7O3VDQVFVM0IsSyxFQUFjQyxNLEVBQWtCO0FBQ3ZDbUIsdUJBQU9uQixPQUFPa0IsV0FBZCxFQUEyQlUsV0FBM0IsQ0FBdUMsMkJBQXZDO0FBQ0g7Ozs7OztzQkFoS1NyQyxZIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uLy4uL2V2ZW50LWVtaXR0ZXInO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi8uLi9zdGFnZS5kJztcbmltcG9ydCB7IEJsb2NrIGFzIEJsb2NrSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vYmxvY2svYmxvY2suZCc7XG5pbXBvcnQgeyBTdHJ1Y3R1cmFsIGFzIFN0cnVjdHVyYWxJbnRlcmZhY2UgfSBmcm9tICcuL2Fic3RyYWN0LmQnO1xuaW1wb3J0IHsgRWRpdGFibGVBcmVhSW50ZXJmYWNlIH0gZnJvbSAnLi9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IGNyZWF0ZUJsb2NrIGZyb20gJy4uLy4uL2Jsb2NrL2ZhY3RvcnknO1xuXG5pbXBvcnQgeyBtb3ZlQXJyYXlJdGVtSW50b0FycmF5LCBtb3ZlQXJyYXlJdGVtLCByZW1vdmVBcnJheUl0ZW0gfSBmcm9tICcuLi8uLi8uLi91dGlscy9hcnJheSc7XG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uLy4uL2Jsb2NrL2Jsb2NrJztcblxuLyoqXG4gKiBDbGFzcyBFZGl0YWJsZUFyZWFcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGRtYWNhdWxheUBtYWdlbnRvLmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdGFibGVBcmVhIGV4dGVuZHMgRXZlbnRFbWl0dGVyIGltcGxlbWVudHMgRWRpdGFibGVBcmVhSW50ZXJmYWNlIHtcbiAgICBjaGlsZHJlbjogS25vY2tvdXRPYnNlcnZhYmxlQXJyYXk8YW55PjtcbiAgICBzdGFnZTogU3RhZ2VJbnRlcmZhY2U7XG4gICAgdGl0bGU6IHN0cmluZyA9ICdFZGl0YWJsZSc7IC8vIEB0b2RvIHRyYW5zbGF0ZVxuXG4gICAgLyoqXG4gICAgICogRWRpdGFibGVBcmVhIGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGFnZT86IFN0YWdlSW50ZXJmYWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmIChzdGFnZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBjaGlsZHJlbiBvYnNlcnZhYmxlIGFycmF5IGludG8gdGhlIGNsYXNzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGRyZW5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2V0Q2hpbGRyZW4oY2hpbGRyZW46IEtub2Nrb3V0T2JzZXJ2YWJsZUFycmF5PGFueT4pIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBzdGFnZSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQHJldHVybnMge1N0YWdlSW50ZXJmYWNlfVxuICAgICAqL1xuICAgIGdldFN0YWdlKCk6IFN0YWdlSW50ZXJmYWNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhZ2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY2hpbGQgaW50byB0aGUgb2JzZXJ2YWJsZSBhcnJheVxuICAgICAqXG4gICAgICogQHBhcmFtIGNoaWxkXG4gICAgICogQHBhcmFtIGluZGV4XG4gICAgICovXG4gICAgYWRkQ2hpbGQoY2hpbGQ6IFN0cnVjdHVyYWxJbnRlcmZhY2UsIGluZGV4PzogbnVtYmVyKSA6dm9pZCB7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIGNoaWxkLnN0YWdlID0gdGhpcy5zdGFnZTtcbiAgICAgICAgaWYgKGluZGV4KSB7XG4gICAgICAgICAgICAvLyBVc2UgdGhlIGFycmF5VXRpbCBmdW5jdGlvbiB0byBhZGQgdGhlIGl0ZW0gaW4gdGhlIGNvcnJlY3QgcGxhY2Ugd2l0aGluIHRoZSBhcnJheVxuICAgICAgICAgICAgbW92ZUFycmF5SXRlbUludG9BcnJheShjaGlsZCwgdGhpcy5jaGlsZHJlbiwgaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIGNoaWxkIGZyb20gdGhlIG9ic2VydmFibGUgYXJyYXlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGlsZFxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkKGNoaWxkOiBhbnkpIDp2b2lkIHtcbiAgICAgICAgcmVtb3ZlQXJyYXlJdGVtKHRoaXMuY2hpbGRyZW4sIGNoaWxkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgYSBibG9jayBiZWluZyBkcm9wcGVkIGludG8gdGhlIHN0cnVjdHVyYWwgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEJsb2NrfFQ+fVxuICAgICAqL1xuICAgIG9uQmxvY2tEcm9wcGVkKGV2ZW50OiBFdmVudCwgcGFyYW1zOiBCbG9ja0Ryb3BwZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IGluZGV4ID0gcGFyYW1zLmluZGV4IHx8IDA7XG5cbiAgICAgICAgbmV3IFByb21pc2U8QmxvY2tJbnRlcmZhY2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuYmxvY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQmxvY2socGFyYW1zLmJsb2NrLmNvbmZpZywgdGhpcywgdGhpcy5zdGFnZSkudGhlbigoYmxvY2s6IEJsb2NrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoYmxvY2ssIGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmVtaXQoJ2Jsb2NrUmVhZHknKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3I6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWplY3QoJ1BhcmFtZXRlciBibG9jayBtaXNzaW5nIGZyb20gZXZlbnQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhcHR1cmUgYSBibG9jayBpbnN0YW5jZSBiZWluZyBkcm9wcGVkIG9udG8gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja0luc3RhbmNlRHJvcHBlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tJbnN0YW5jZURyb3BwZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRDaGlsZChwYXJhbXMuYmxvY2tJbnN0YW5jZSwgcGFyYW1zLmluZGV4KTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoa28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMpIHtcbiAgICAgICAgICAgIGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKCk7XG4gICAgICAgIH0qL1xuXG4gICAgICAgIHBhcmFtcy5ibG9ja0luc3RhbmNlLmVtaXQoJ2Jsb2NrTW92ZWQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgZXZlbnQgdG8gcmVtb3ZlIGJsb2NrXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja1JlbW92ZWQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IEJsb2NrUmVtb3ZlZFBhcmFtcyk6IHZvaWQge1xuICAgICAgICBwYXJhbXMuYmxvY2suZW1pdCgnYmxvY2tCZWZvcmVSZW1vdmVkJyk7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2hpbGQocGFyYW1zLmJsb2NrKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoa28ucHJvY2Vzc0FsbERlZmVycmVkQmluZGluZ1VwZGF0ZXMpIHtcbiAgICAgICAgICAgIGtvLnByb2Nlc3NBbGxEZWZlcnJlZEJpbmRpbmdVcGRhdGVzKCk7XG4gICAgICAgIH0qL1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBldmVudCB3aGVuIGEgYmxvY2sgaXMgc29ydGVkIHdpdGhpbiBpdCdzIGN1cnJlbnQgY29udGFpbmVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25CbG9ja1NvcnRlZChldmVudDogRXZlbnQsIHBhcmFtczogQmxvY2tTb3J0ZWRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsSW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YodGhpcy5jaGlsZHJlbigpLCBwYXJhbXMuYmxvY2spO1xuICAgICAgICBpZiAob3JpZ2luYWxJbmRleCAhPT0gcGFyYW1zLmluZGV4KSB7XG4gICAgICAgICAgICBtb3ZlQXJyYXlJdGVtKHRoaXMuY2hpbGRyZW4sIG9yaWdpbmFsSW5kZXgsIHBhcmFtcy5pbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1zLmJsb2NrLmVtaXQoJ2Jsb2NrTW92ZWQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBjYWxsZWQgd2hlbiBzdGFydGluZyBzdGFydHMgb24gdGhpcyBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgb25Tb3J0U3RhcnQoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IFNvcnRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsRWxlID0galF1ZXJ5KHBhcmFtcy5vcmlnaW5hbEVsZSk7XG4gICAgICAgIG9yaWdpbmFsRWxlLnNob3coKTtcbiAgICAgICAgb3JpZ2luYWxFbGUuYWRkQ2xhc3MoJ2JsdWVmb290LXNvcnRpbmctb3JpZ2luYWwnKTtcblxuICAgICAgICAvLyBSZXNldCB0aGUgd2lkdGggJiBoZWlnaHQgb2YgdGhlIGhlbHBlclxuICAgICAgICBqUXVlcnkocGFyYW1zLmhlbHBlcilcbiAgICAgICAgICAgIC5jc3Moe3dpZHRoOiAnJywgaGVpZ2h0OiAnJ30pXG4gICAgICAgICAgICAuaHRtbChqUXVlcnkoJzxoMyAvPicpLnRleHQodGhpcy50aXRsZSkuaHRtbCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudCBjYWxsZWQgd2hlbiBzb3J0aW5nIHN0b3BzIG9uIHRoaXMgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIG9uU29ydFN0b3AoZXZlbnQ6IEV2ZW50LCBwYXJhbXM6IFNvcnRQYXJhbXMpOiB2b2lkIHtcbiAgICAgICAgalF1ZXJ5KHBhcmFtcy5vcmlnaW5hbEVsZSkucmVtb3ZlQ2xhc3MoJ2JsdWVmb290LXNvcnRpbmctb3JpZ2luYWwnKTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tEcm9wcGVkUGFyYW1zIHtcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIGJsb2NrOiB7XG4gICAgICAgIGNvbmZpZzogb2JqZWN0XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrSW5zdGFuY2VEcm9wcGVkUGFyYW1zIHtcbiAgICBibG9ja0luc3RhbmNlOiBCbG9jayxcbiAgICBpbmRleD86IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrUmVtb3ZlZFBhcmFtcyB7XG4gICAgYmxvY2s6IEJsb2NrXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmxvY2tTb3J0ZWRQYXJhbXMge1xuICAgIGJsb2NrOiBCbG9ja1xuICAgIGluZGV4OiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTb3J0UGFyYW1zIHtcbiAgICBvcmlnaW5hbEVsZTogSlF1ZXJ5XG4gICAgcGxhY2Vob2xkZXI6IEpRdWVyeVxuICAgIGhlbHBlcj86IGFueVxufSJdfQ==
