define(['exports', 'underscore', '../event-emitter', '../config', '../block/factory'], function (exports, _underscore, _eventEmitter, _config, _factory) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Build = undefined;

    var _ = _interopRequireWildcard(_underscore);

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

    var _config2 = _interopRequireDefault(_config);

    var _factory2 = _interopRequireDefault(_factory);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
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

    var Build = exports.Build = function (_EventEmitter) {
        _inherits(Build, _EventEmitter);

        function Build() {
            _classCallCheck(this, Build);

            return _possibleConstructorReturn(this, (Build.__proto__ || Object.getPrototypeOf(Build)).apply(this, arguments));
        }

        _createClass(Build, [{
            key: 'parseStructure',

            /**
             * Parse the potential structure
             *
             * @param structure
             */
            value: function parseStructure(structure) {
                this.document = document.createElement('div');
                this.document.innerHTML = structure;
                // Return the stage element if the structure is present, otherwise return false
                return this.document.querySelector('[' + _config2.default.getValue('dataRoleAttributeName') + '="stage"]') || false;
            }
            /**
             * Build the stage
             *
             * @param stage
             * @param stageElement
             * @returns {Build}
             */

        }, {
            key: 'buildStage',
            value: function buildStage(stage, stageElement) {
                this.stage = stage;
                this.parseAndBuildStage(stageElement);
                return this;
            }
            /**
             * Parse and build the stage from the stage element
             *
             * @param stageElement
             * @returns {Promise<T>}
             */

        }, {
            key: 'parseAndBuildStage',
            value: function parseAndBuildStage(stageElement) {
                var _this2 = this;

                return this.parseAndBuildElement(stageElement, this.stage).then(function () {
                    _this2.emit('buildDone');
                }).catch(function (error) {
                    _this2.emit('buildError', error);
                });
            }
            /**
             * Parse an element in the structure and build the required element
             *
             * @param element
             * @param parent
             * @returns {Promise<EditableAreaInterface>}
             */

        }, {
            key: 'parseAndBuildElement',
            value: function parseAndBuildElement(element, parent) {
                var _this3 = this;

                if (element instanceof HTMLElement && element.getAttribute(_config2.default.getValueAsString('dataRoleAttributeName'))) {
                    parent = parent || this.stage;
                    var role = element.getAttribute(_config2.default.getValueAsString('dataRoleAttributeName')),
                        data = Build.getElementData(element),
                        children = this.getElementChildren(element);
                    // Add element to stage
                    return this.buildElement(role, data, parent).then(function (newParent) {
                        if (children.length > 0) {
                            var childPromises = [];
                            _.forEach(children, function (child) {
                                childPromises.push(_this3.parseAndBuildElement(child, newParent));
                            });
                            return Promise.all(childPromises);
                        } else {
                            return Promise.resolve(newParent);
                        }
                    });
                } else {
                    return Promise.reject(new Error('Element does not contain valid role attribute.'));
                }
            }
            /**
             * Retrieve the elements data
             *
             * @param element
             * @returns {{}}
             */

        }, {
            key: 'getElementChildren',

            /**
             * Return elements children, search for direct decedents, or traverse through to find deeper children
             *
             * @param element
             * @returns {Array}
             */
            value: function getElementChildren(element) {
                var _this4 = this;

                if (element.hasChildNodes()) {
                    var children = [];
                    // Find direct children of the element
                    _.forEach(element.childNodes, function (child) {
                        // Only search elements which tagName's and not script tags
                        if (child.tagName && child.tagName != 'SCRIPT') {
                            if (child.hasAttribute(_config2.default.getValueAsString('dataRoleAttributeName'))) {
                                children.push(child);
                            } else {
                                children = _this4.getElementChildren(child);
                            }
                        }
                    });
                    if (children.length > 0) {
                        return children;
                    }
                }
                return [];
            }
            /**
             * Forward build instruction to necessary build function
             *
             * @param role
             * @param data
             * @param parent
             * @returns {Promise<EditableAreaInterface>}
             */

        }, {
            key: 'buildElement',
            value: function buildElement(role, data, parent) {
                switch (role) {
                    case 'stage':
                        // If the stage is being built, we don't need to "build" anything, just return the stage as the
                        // new parent
                        return Promise.resolve(this.stage);
                    case 'row':
                        return this.buildRow(data, parent);
                    case 'column':
                        return this.buildColumn(data, parent);
                    default:
                        return this.buildEntity(role, data, parent);
                }
            }
            /**
             * Build a new row with it's associated data
             *
             * @param data
             * @param parent
             * @returns {Promise<RowInterface>}
             */

        }, {
            key: 'buildRow',
            value: function buildRow(data, parent) {
                return Promise.resolve(parent.addRow(this.stage, data));
            }
            /**
             * Build a new column with it's associated data
             *
             * @param data
             * @param parent
             * @returns {Promise<ColumnInterface>}
             */

        }, {
            key: 'buildColumn',
            value: function buildColumn(data, parent) {
                return Promise.resolve(parent.addColumn(data));
            }
            /**
             * Add an entity into the system
             *
             * @param role
             * @param data
             * @param parent
             * @returns {Promise<T>}
             */

        }, {
            key: 'buildEntity',
            value: function buildEntity(role, data, parent) {
                return new Promise(function (resolve, reject) {
                    (0, _factory2.default)(_config2.default.getContentBlockConfig(role), parent, this.stage, data).then(function (block) {
                        parent.addChild(block);
                        resolve(block);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            }
        }], [{
            key: 'getElementData',
            value: function getElementData(element) {
                var scriptTag = element.querySelector('script[type="text/advanced-cms-data"]');
                if (scriptTag) {
                    return scriptTag.innerHTML ? JSON.parse(scriptTag.innerHTML) : {};
                }
                return {};
            }
        }]);

        return Build;
    }(_eventEmitter2.default);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9idWlsZC50cyJdLCJuYW1lcyI6WyJfIiwiQnVpbGQiLCJzdHJ1Y3R1cmUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbm5lckhUTUwiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0VmFsdWUiLCJzdGFnZSIsInN0YWdlRWxlbWVudCIsInBhcnNlQW5kQnVpbGRTdGFnZSIsInBhcnNlQW5kQnVpbGRFbGVtZW50IiwidGhlbiIsImVtaXQiLCJjYXRjaCIsImVycm9yIiwiZWxlbWVudCIsInBhcmVudCIsIkhUTUxFbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwiZ2V0VmFsdWVBc1N0cmluZyIsInJvbGUiLCJkYXRhIiwiZ2V0RWxlbWVudERhdGEiLCJjaGlsZHJlbiIsImdldEVsZW1lbnRDaGlsZHJlbiIsImJ1aWxkRWxlbWVudCIsIm5ld1BhcmVudCIsImxlbmd0aCIsImNoaWxkUHJvbWlzZXMiLCJmb3JFYWNoIiwiY2hpbGQiLCJwdXNoIiwiUHJvbWlzZSIsImFsbCIsInJlc29sdmUiLCJyZWplY3QiLCJFcnJvciIsImhhc0NoaWxkTm9kZXMiLCJjaGlsZE5vZGVzIiwidGFnTmFtZSIsImhhc0F0dHJpYnV0ZSIsImJ1aWxkUm93IiwiYnVpbGRDb2x1bW4iLCJidWlsZEVudGl0eSIsImFkZFJvdyIsImFkZENvbHVtbiIsImdldENvbnRlbnRCbG9ja0NvbmZpZyIsImJsb2NrIiwiYWRkQ2hpbGQiLCJzY3JpcHRUYWciLCJKU09OIiwicGFyc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBQVlBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFnQk5DLEssV0FBQUEsSzs7Ozs7Ozs7Ozs7O0FBSUY7Ozs7OzJDQUtlQyxTLEVBQWlCO0FBQzVCLHFCQUFLQyxRQUFMLEdBQWdCQSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWhC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K0JBQU9nQyxRQUFQLENBQWdCRCxLQUFoQjtBQUNBYixnQ0FBUWEsS0FBUjtBQUNILHFCQVJELEVBUUdsQyxLQVJILENBUVMsVUFBVUMsS0FBVixFQUFlO0FBQ3BCcUIsK0JBQU9yQixLQUFQO0FBQ0gscUJBVkQ7QUFXSCxpQkFaTSxDQUFQO0FBYUg7OzsyQ0F6R3FCQyxPLEVBQW9CO0FBQ3RDLG9CQUFJa0MsWUFBWWxDLFFBQVFWLGFBQVIsQ0FBc0IsdUNBQXRCLENBQWhCO0FBQ0Esb0JBQUk0QyxTQUFKLEVBQWU7QUFDWCwyQkFBT0EsVUFBVTdDLFNBQVYsR0FBc0I4QyxLQUFLQyxLQUFMLENBQVdGLFVBQVU3QyxTQUFyQixDQUF0QixHQUF3RCxFQUEvRDtBQUNIO0FBRUQsdUJBQU8sRUFBUDtBQUNIIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9idWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uL3N0YWdlLmQnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi9ldmVudC1lbWl0dGVyJztcbmltcG9ydCBDb25maWcgZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBjcmVhdGVCbG9jayBmcm9tICcuLi9ibG9jay9mYWN0b3J5JztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IHsgUm93SW50ZXJmYWNlIH0gZnJvbSAnLi9zdHJ1Y3R1cmFsL3Jvdy5kJztcbmltcG9ydCB7IENvbHVtbkludGVyZmFjZSB9IGZyb20gJy4vc3RydWN0dXJhbC9jb2x1bW4uZCc7XG5pbXBvcnQgeyBCbG9jayB9IGZyb20gJy4uL2Jsb2NrL2Jsb2NrJztcbmltcG9ydCBFZGl0YWJsZUFyZWEgZnJvbSAnLi9zdHJ1Y3R1cmFsL2VkaXRhYmxlLWFyZWEnO1xuXG4vKipcbiAqIEJ1aWxkIENsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxoZWxsb0BkYXZlbWFjYXVsYXkuY29tPlxuICovXG5leHBvcnQgY2xhc3MgQnVpbGQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIHN0YWdlOiBTdGFnZUludGVyZmFjZTtcbiAgICBkb2N1bWVudDogRWxlbWVudDtcblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHRoZSBwb3RlbnRpYWwgc3RydWN0dXJlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RydWN0dXJlXG4gICAgICovXG4gICAgcGFyc2VTdHJ1Y3R1cmUoc3RydWN0dXJlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmRvY3VtZW50LmlubmVySFRNTCA9IHN0cnVjdHVyZTtcblxuICAgICAgICAvLyBSZXR1cm4gdGhlIHN0YWdlIGVsZW1lbnQgaWYgdGhlIHN0cnVjdHVyZSBpcyBwcmVzZW50LCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1snICsgQ29uZmlnLmdldFZhbHVlKCdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnKSArICc9XCJzdGFnZVwiXScpIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBzdGFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICogQHBhcmFtIHN0YWdlRWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtCdWlsZH1cbiAgICAgKi9cbiAgICBidWlsZFN0YWdlKHN0YWdlOiBTdGFnZUludGVyZmFjZSwgc3RhZ2VFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgIHRoaXMucGFyc2VBbmRCdWlsZFN0YWdlKHN0YWdlRWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGFuZCBidWlsZCB0aGUgc3RhZ2UgZnJvbSB0aGUgc3RhZ2UgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlRWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fVxuICAgICAqL1xuICAgIHBhcnNlQW5kQnVpbGRTdGFnZShzdGFnZUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlQW5kQnVpbGRFbGVtZW50KHN0YWdlRWxlbWVudCwgdGhpcy5zdGFnZSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2J1aWxkRG9uZScpO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2J1aWxkRXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBhbiBlbGVtZW50IGluIHRoZSBzdHJ1Y3R1cmUgYW5kIGJ1aWxkIHRoZSByZXF1aXJlZCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxFZGl0YWJsZUFyZWFJbnRlcmZhY2U+fVxuICAgICAqL1xuICAgIHBhcnNlQW5kQnVpbGRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSk6IFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPiB7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlKENvbmZpZy5nZXRWYWx1ZUFzU3RyaW5nKCdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQgfHwgdGhpcy5zdGFnZTtcbiAgICAgICAgICAgIGxldCByb2xlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoQ29uZmlnLmdldFZhbHVlQXNTdHJpbmcoJ2RhdGFSb2xlQXR0cmlidXRlTmFtZScpKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gQnVpbGQuZ2V0RWxlbWVudERhdGEoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldEVsZW1lbnRDaGlsZHJlbihlbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gQWRkIGVsZW1lbnQgdG8gc3RhZ2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkRWxlbWVudChyb2xlLCBkYXRhLCBwYXJlbnQpLnRoZW4oKG5ld1BhcmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkUHJvbWlzZXM6IEFycmF5PFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPj4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkUHJvbWlzZXMucHVzaCh0aGlzLnBhcnNlQW5kQnVpbGRFbGVtZW50KGNoaWxkLCBuZXdQYXJlbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChjaGlsZFByb21pc2VzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ld1BhcmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdFbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gdmFsaWQgcm9sZSBhdHRyaWJ1dGUuJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIGVsZW1lbnRzIGRhdGFcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHJldHVybnMge3t9fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRFbGVtZW50RGF0YShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBsZXQgc2NyaXB0VGFnID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbdHlwZT1cInRleHQvYWR2YW5jZWQtY21zLWRhdGFcIl0nKTtcbiAgICAgICAgaWYgKHNjcmlwdFRhZykge1xuICAgICAgICAgICAgcmV0dXJuIHNjcmlwdFRhZy5pbm5lckhUTUwgPyBKU09OLnBhcnNlKHNjcmlwdFRhZy5pbm5lckhUTUwpIDoge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGVsZW1lbnRzIGNoaWxkcmVuLCBzZWFyY2ggZm9yIGRpcmVjdCBkZWNlZGVudHMsIG9yIHRyYXZlcnNlIHRocm91Z2ggdG8gZmluZCBkZWVwZXIgY2hpbGRyZW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldEVsZW1lbnRDaGlsZHJlbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbjogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICAgICAgLy8gRmluZCBkaXJlY3QgY2hpbGRyZW4gb2YgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50LmNoaWxkTm9kZXMsIChjaGlsZDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBPbmx5IHNlYXJjaCBlbGVtZW50cyB3aGljaCB0YWdOYW1lJ3MgYW5kIG5vdCBzY3JpcHQgdGFnc1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC50YWdOYW1lICYmIGNoaWxkLnRhZ05hbWUgIT0gJ1NDUklQVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLmhhc0F0dHJpYnV0ZShDb25maWcuZ2V0VmFsdWVBc1N0cmluZygnZGF0YVJvbGVBdHRyaWJ1dGVOYW1lJykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRFbGVtZW50Q2hpbGRyZW4oY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZvcndhcmQgYnVpbGQgaW5zdHJ1Y3Rpb24gdG8gbmVjZXNzYXJ5IGJ1aWxkIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9sZVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEVkaXRhYmxlQXJlYUludGVyZmFjZT59XG4gICAgICovXG4gICAgYnVpbGRFbGVtZW50KHJvbGU6IHN0cmluZywgZGF0YTogb2JqZWN0LCBwYXJlbnQ6IGFueSk6IFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPiB7XG4gICAgICAgIHN3aXRjaCAocm9sZSkge1xuICAgICAgICAgICAgY2FzZSAnc3RhZ2UnOlxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzdGFnZSBpcyBiZWluZyBidWlsdCwgd2UgZG9uJ3QgbmVlZCB0byBcImJ1aWxkXCIgYW55dGhpbmcsIGp1c3QgcmV0dXJuIHRoZSBzdGFnZSBhcyB0aGVcbiAgICAgICAgICAgICAgICAvLyBuZXcgcGFyZW50XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ3Jvdyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRSb3coZGF0YSwgcGFyZW50KTtcbiAgICAgICAgICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDb2x1bW4oZGF0YSwgcGFyZW50KTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRFbnRpdHkocm9sZSwgZGF0YSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGEgbmV3IHJvdyB3aXRoIGl0J3MgYXNzb2NpYXRlZCBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSb3dJbnRlcmZhY2U+fVxuICAgICAqL1xuICAgIHByaXZhdGUgYnVpbGRSb3coZGF0YTogb2JqZWN0LCBwYXJlbnQ6IFN0YWdlSW50ZXJmYWNlKTogUHJvbWlzZTxSb3dJbnRlcmZhY2U+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXJlbnQuYWRkUm93KHRoaXMuc3RhZ2UsIGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhIG5ldyBjb2x1bW4gd2l0aCBpdCdzIGFzc29jaWF0ZWQgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHJldHVybnMge1Byb21pc2U8Q29sdW1uSW50ZXJmYWNlPn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGJ1aWxkQ29sdW1uKGRhdGE6IG9iamVjdCwgcGFyZW50OiBSb3dJbnRlcmZhY2UgfCBDb2x1bW5JbnRlcmZhY2UpOiBQcm9taXNlPENvbHVtbkludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBhcmVudC5hZGRDb2x1bW4oZGF0YSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBlbnRpdHkgaW50byB0aGUgc3lzdGVtXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9sZVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fVxuICAgICAqL1xuICAgIHByaXZhdGUgYnVpbGRFbnRpdHkocm9sZTogc3RyaW5nLCBkYXRhOiBvYmplY3QsIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlKTogUHJvbWlzZTxCbG9jaz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgY3JlYXRlQmxvY2soXG4gICAgICAgICAgICAgICAgQ29uZmlnLmdldENvbnRlbnRCbG9ja0NvbmZpZyhyb2xlKSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICApLnRoZW4oZnVuY3Rpb24gKGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKGJsb2NrKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGJsb2NrKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==
