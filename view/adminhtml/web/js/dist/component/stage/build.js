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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnQvc3RhZ2UvYnVpbGQudHMiXSwibmFtZXMiOlsiXyIsIkJ1aWxkIiwic3RydWN0dXJlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwicXVlcnlTZWxlY3RvciIsImdldFZhbHVlIiwic3RhZ2UiLCJzdGFnZUVsZW1lbnQiLCJwYXJzZUFuZEJ1aWxkU3RhZ2UiLCJwYXJzZUFuZEJ1aWxkRWxlbWVudCIsInRoZW4iLCJlbWl0IiwiY2F0Y2giLCJlcnJvciIsImVsZW1lbnQiLCJwYXJlbnQiLCJIVE1MRWxlbWVudCIsImdldEF0dHJpYnV0ZSIsImdldFZhbHVlQXNTdHJpbmciLCJyb2xlIiwiZGF0YSIsImdldEVsZW1lbnREYXRhIiwiY2hpbGRyZW4iLCJnZXRFbGVtZW50Q2hpbGRyZW4iLCJidWlsZEVsZW1lbnQiLCJuZXdQYXJlbnQiLCJsZW5ndGgiLCJjaGlsZFByb21pc2VzIiwiZm9yRWFjaCIsImNoaWxkIiwicHVzaCIsIlByb21pc2UiLCJhbGwiLCJyZXNvbHZlIiwicmVqZWN0IiwiRXJyb3IiLCJoYXNDaGlsZE5vZGVzIiwiY2hpbGROb2RlcyIsInRhZ05hbWUiLCJoYXNBdHRyaWJ1dGUiLCJidWlsZFJvdyIsImJ1aWxkQ29sdW1uIiwiYnVpbGRFbnRpdHkiLCJhZGRSb3ciLCJhZGRDb2x1bW4iLCJnZXRDb250ZW50QmxvY2tDb25maWciLCJibG9jayIsImFkZENoaWxkIiwic2NyaXB0VGFnIiwiSlNPTiIsInBhcnNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQUFZQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZ0JOQyxLLFdBQUFBLEs7Ozs7Ozs7Ozs7OztBQUlGOzs7OzsyQ0FLZUMsUyxFQUFpQjtBQUM1QixxQkFBS0MsUUFBTCxHQUFnQkEsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFo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LCtCQUFPZ0MsUUFBUCxDQUFnQkQsS0FBaEI7QUFDQWIsZ0NBQVFhLEtBQVI7QUFDSCxxQkFSRCxFQVFHbEMsS0FSSCxDQVFTLFVBQVVDLEtBQVYsRUFBZTtBQUNwQnFCLCtCQUFPckIsS0FBUDtBQUNILHFCQVZEO0FBV0gsaUJBWk0sQ0FBUDtBQWFIOzs7MkNBekdxQkMsTyxFQUFvQjtBQUN0QyxvQkFBSWtDLFlBQVlsQyxRQUFRVixhQUFSLENBQXNCLHVDQUF0QixDQUFoQjtBQUNBLG9CQUFJNEMsU0FBSixFQUFlO0FBQ1gsMkJBQU9BLFVBQVU3QyxTQUFWLEdBQXNCOEMsS0FBS0MsS0FBTCxDQUFXRixVQUFVN0MsU0FBckIsQ0FBdEIsR0FBd0QsRUFBL0Q7QUFDSDtBQUVELHVCQUFPLEVBQVA7QUFDSCIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi9zdGFnZS5kJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vZXZlbnQtZW1pdHRlcic7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgY3JlYXRlQmxvY2sgZnJvbSAnLi4vYmxvY2svZmFjdG9yeSc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCB7IFJvd0ludGVyZmFjZSB9IGZyb20gJy4vc3RydWN0dXJhbC9yb3cuZCc7XG5pbXBvcnQgeyBDb2x1bW5JbnRlcmZhY2UgfSBmcm9tICcuL3N0cnVjdHVyYWwvY29sdW1uLmQnO1xuaW1wb3J0IHsgQmxvY2sgfSBmcm9tIFwiLi4vYmxvY2svYmxvY2tcIjtcbmltcG9ydCB7IEVkaXRhYmxlQXJlYSB9IGZyb20gXCIuL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYVwiO1xuXG4vKipcbiAqIEJ1aWxkIENsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxoZWxsb0BkYXZlbWFjYXVsYXkuY29tPlxuICovXG5leHBvcnQgY2xhc3MgQnVpbGQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIHN0YWdlOiBTdGFnZUludGVyZmFjZTtcbiAgICBkb2N1bWVudDogRWxlbWVudDtcblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHRoZSBwb3RlbnRpYWwgc3RydWN0dXJlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RydWN0dXJlXG4gICAgICovXG4gICAgcGFyc2VTdHJ1Y3R1cmUoc3RydWN0dXJlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmRvY3VtZW50LmlubmVySFRNTCA9IHN0cnVjdHVyZTtcblxuICAgICAgICAvLyBSZXR1cm4gdGhlIHN0YWdlIGVsZW1lbnQgaWYgdGhlIHN0cnVjdHVyZSBpcyBwcmVzZW50LCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1snICsgQ29uZmlnLmdldFZhbHVlKCdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnKSArICc9XCJzdGFnZVwiXScpIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBzdGFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICogQHBhcmFtIHN0YWdlRWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtCdWlsZH1cbiAgICAgKi9cbiAgICBidWlsZFN0YWdlKHN0YWdlOiBTdGFnZUludGVyZmFjZSwgc3RhZ2VFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgIHRoaXMucGFyc2VBbmRCdWlsZFN0YWdlKHN0YWdlRWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGFuZCBidWlsZCB0aGUgc3RhZ2UgZnJvbSB0aGUgc3RhZ2UgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlRWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fVxuICAgICAqL1xuICAgIHBhcnNlQW5kQnVpbGRTdGFnZShzdGFnZUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlQW5kQnVpbGRFbGVtZW50KHN0YWdlRWxlbWVudCwgdGhpcy5zdGFnZSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2J1aWxkRG9uZScpO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2J1aWxkRXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBhbiBlbGVtZW50IGluIHRoZSBzdHJ1Y3R1cmUgYW5kIGJ1aWxkIHRoZSByZXF1aXJlZCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxFZGl0YWJsZUFyZWFJbnRlcmZhY2U+fVxuICAgICAqL1xuICAgIHBhcnNlQW5kQnVpbGRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSk6IFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPiB7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlKENvbmZpZy5nZXRWYWx1ZUFzU3RyaW5nKCdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQgfHwgdGhpcy5zdGFnZTtcbiAgICAgICAgICAgIGxldCByb2xlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoQ29uZmlnLmdldFZhbHVlQXNTdHJpbmcoJ2RhdGFSb2xlQXR0cmlidXRlTmFtZScpKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gQnVpbGQuZ2V0RWxlbWVudERhdGEoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldEVsZW1lbnRDaGlsZHJlbihlbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gQWRkIGVsZW1lbnQgdG8gc3RhZ2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkRWxlbWVudChyb2xlLCBkYXRhLCBwYXJlbnQpLnRoZW4oKG5ld1BhcmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkUHJvbWlzZXM6IEFycmF5PFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPj4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkUHJvbWlzZXMucHVzaCh0aGlzLnBhcnNlQW5kQnVpbGRFbGVtZW50KGNoaWxkLCBuZXdQYXJlbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChjaGlsZFByb21pc2VzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ld1BhcmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdFbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gdmFsaWQgcm9sZSBhdHRyaWJ1dGUuJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIGVsZW1lbnRzIGRhdGFcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHJldHVybnMge3t9fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRFbGVtZW50RGF0YShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBsZXQgc2NyaXB0VGFnID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbdHlwZT1cInRleHQvYWR2YW5jZWQtY21zLWRhdGFcIl0nKTtcbiAgICAgICAgaWYgKHNjcmlwdFRhZykge1xuICAgICAgICAgICAgcmV0dXJuIHNjcmlwdFRhZy5pbm5lckhUTUwgPyBKU09OLnBhcnNlKHNjcmlwdFRhZy5pbm5lckhUTUwpIDoge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGVsZW1lbnRzIGNoaWxkcmVuLCBzZWFyY2ggZm9yIGRpcmVjdCBkZWNlZGVudHMsIG9yIHRyYXZlcnNlIHRocm91Z2ggdG8gZmluZCBkZWVwZXIgY2hpbGRyZW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldEVsZW1lbnRDaGlsZHJlbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbjogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICAgICAgLy8gRmluZCBkaXJlY3QgY2hpbGRyZW4gb2YgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50LmNoaWxkTm9kZXMsIChjaGlsZDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBPbmx5IHNlYXJjaCBlbGVtZW50cyB3aGljaCB0YWdOYW1lJ3MgYW5kIG5vdCBzY3JpcHQgdGFnc1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC50YWdOYW1lICYmIGNoaWxkLnRhZ05hbWUgIT0gJ1NDUklQVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLmhhc0F0dHJpYnV0ZShDb25maWcuZ2V0VmFsdWVBc1N0cmluZygnZGF0YVJvbGVBdHRyaWJ1dGVOYW1lJykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRFbGVtZW50Q2hpbGRyZW4oY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZvcndhcmQgYnVpbGQgaW5zdHJ1Y3Rpb24gdG8gbmVjZXNzYXJ5IGJ1aWxkIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9sZVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEVkaXRhYmxlQXJlYUludGVyZmFjZT59XG4gICAgICovXG4gICAgYnVpbGRFbGVtZW50KHJvbGU6IHN0cmluZywgZGF0YTogb2JqZWN0LCBwYXJlbnQ6IGFueSk6IFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPiB7XG4gICAgICAgIHN3aXRjaCAocm9sZSkge1xuICAgICAgICAgICAgY2FzZSAnc3RhZ2UnOlxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzdGFnZSBpcyBiZWluZyBidWlsdCwgd2UgZG9uJ3QgbmVlZCB0byBcImJ1aWxkXCIgYW55dGhpbmcsIGp1c3QgcmV0dXJuIHRoZSBzdGFnZSBhcyB0aGVcbiAgICAgICAgICAgICAgICAvLyBuZXcgcGFyZW50XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ3Jvdyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRSb3coZGF0YSwgcGFyZW50KTtcbiAgICAgICAgICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDb2x1bW4oZGF0YSwgcGFyZW50KTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRFbnRpdHkocm9sZSwgZGF0YSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGEgbmV3IHJvdyB3aXRoIGl0J3MgYXNzb2NpYXRlZCBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSb3dJbnRlcmZhY2U+fVxuICAgICAqL1xuICAgIHByaXZhdGUgYnVpbGRSb3coZGF0YTogb2JqZWN0LCBwYXJlbnQ6IFN0YWdlSW50ZXJmYWNlKTogUHJvbWlzZTxSb3dJbnRlcmZhY2U+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXJlbnQuYWRkUm93KHRoaXMuc3RhZ2UsIGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhIG5ldyBjb2x1bW4gd2l0aCBpdCdzIGFzc29jaWF0ZWQgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHJldHVybnMge1Byb21pc2U8Q29sdW1uSW50ZXJmYWNlPn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGJ1aWxkQ29sdW1uKGRhdGE6IG9iamVjdCwgcGFyZW50OiBSb3dJbnRlcmZhY2UgfCBDb2x1bW5JbnRlcmZhY2UpOiBQcm9taXNlPENvbHVtbkludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBhcmVudC5hZGRDb2x1bW4oZGF0YSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBlbnRpdHkgaW50byB0aGUgc3lzdGVtXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9sZVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fVxuICAgICAqL1xuICAgIHByaXZhdGUgYnVpbGRFbnRpdHkocm9sZTogc3RyaW5nLCBkYXRhOiBvYmplY3QsIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlKTogUHJvbWlzZTxCbG9jaz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgY3JlYXRlQmxvY2soXG4gICAgICAgICAgICAgICAgQ29uZmlnLmdldENvbnRlbnRCbG9ja0NvbmZpZyhyb2xlKSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICApLnRoZW4oZnVuY3Rpb24gKGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKGJsb2NrKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGJsb2NrKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==
