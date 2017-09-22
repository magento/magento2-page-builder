define(['exports', 'underscore', '../event-emitter', '../config', '../block/factory'], function (exports, _underscore, _eventEmitter, _config, _factory) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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

    var Build = function (_EventEmitter) {
        _inherits(Build, _EventEmitter);

        function Build() {
            _classCallCheck(this, Build);

            return _possibleConstructorReturn(this, _EventEmitter.apply(this, arguments));
        }

        Build.prototype.parseStructure = function parseStructure(structure) {
            this.document = document.createElement('div');
            this.document.innerHTML = structure;
            // Return the stage element if the structure is present, otherwise return false
            return this.document.querySelector('[' + _config2.default.getValue('dataRoleAttributeName') + '="stage"]') || false;
        };

        Build.prototype.buildStage = function buildStage(stage, stageElement) {
            this.stage = stage;
            this.parseAndBuildStage(stageElement);
            return this;
        };

        Build.prototype.parseAndBuildStage = function parseAndBuildStage(stageElement) {
            var _this2 = this;

            return this.parseAndBuildElement(stageElement, this.stage).then(function () {
                _this2.emit('buildDone');
            }).catch(function (error) {
                _this2.emit('buildError', error);
            });
        };

        Build.prototype.parseAndBuildElement = function parseAndBuildElement(element, parent) {
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
        };

        Build.getElementData = function getElementData(element) {
            var scriptTag = element.querySelector('script[type="text/advanced-cms-data"]');
            if (scriptTag) {
                return scriptTag.innerHTML ? JSON.parse(scriptTag.innerHTML) : {};
            }
            return {};
        };

        Build.prototype.getElementChildren = function getElementChildren(element) {
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
        };

        Build.prototype.buildElement = function buildElement(role, data, parent) {
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
        };

        Build.prototype.buildRow = function buildRow(data, parent) {
            return Promise.resolve(parent.addRow(this.stage, data));
        };

        Build.prototype.buildColumn = function buildColumn(data, parent) {
            return Promise.resolve(parent.addColumn(data));
        };

        Build.prototype.buildEntity = function buildEntity(role, data, parent) {
            return new Promise(function (resolve, reject) {
                (0, _factory2.default)(_config2.default.getContentBlockConfig(role), parent, this.stage, data).then(function (block) {
                    parent.addChild(block);
                    resolve(block);
                }).catch(function (error) {
                    reject(error);
                });
            });
        };

        return Build;
    }(_eventEmitter2.default);

    exports.default = Build;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9idWlsZC50cyJdLCJuYW1lcyI6WyJfIiwiQnVpbGQiLCJwYXJzZVN0cnVjdHVyZSIsInN0cnVjdHVyZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRWYWx1ZSIsImJ1aWxkU3RhZ2UiLCJzdGFnZSIsInN0YWdlRWxlbWVudCIsInBhcnNlQW5kQnVpbGRTdGFnZSIsInBhcnNlQW5kQnVpbGRFbGVtZW50IiwidGhlbiIsImVtaXQiLCJjYXRjaCIsImVycm9yIiwiZWxlbWVudCIsInBhcmVudCIsIkhUTUxFbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwiZ2V0VmFsdWVBc1N0cmluZyIsInJvbGUiLCJkYXRhIiwiZ2V0RWxlbWVudERhdGEiLCJjaGlsZHJlbiIsImdldEVsZW1lbnRDaGlsZHJlbiIsImJ1aWxkRWxlbWVudCIsIm5ld1BhcmVudCIsImxlbmd0aCIsImNoaWxkUHJvbWlzZXMiLCJmb3JFYWNoIiwiY2hpbGQiLCJwdXNoIiwiUHJvbWlzZSIsImFsbCIsInJlc29sdmUiLCJyZWplY3QiLCJFcnJvciIsInNjcmlwdFRhZyIsIkpTT04iLCJwYXJzZSIsImhhc0NoaWxkTm9kZXMiLCJjaGlsZE5vZGVzIiwidGFnTmFtZSIsImhhc0F0dHJpYnV0ZSIsImJ1aWxkUm93IiwiYnVpbGRDb2x1bW4iLCJidWlsZEVudGl0eSIsImFkZFJvdyIsImFkZENvbHVtbiIsImdldENvbnRlbnRCbG9ja0NvbmZpZyIsImJsb2NrIiwiYWRkQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7UUFBWUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWVFQyxLOzs7Ozs7Ozs7d0JBU1ZDLGMsMkJBQWVDLFMsRUFBaUI7QUFDNUIsaUJBQUtDLFFBQUwsR0FBZ0JBLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7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QUFDekUsbUJBQU8sSUFBSWdCLE9BQUosQ0FBWSxVQUFVRSxPQUFWLEVBQW1CQyxNQUFuQixFQUF5QjtBQUN4Qyx1Q0FDSSxpQkFBT2MscUJBQVAsQ0FBNkI3QixJQUE3QixDQURKLEVBRUlKLE1BRkosRUFHSSxLQUFLVCxLQUhULEVBSUljLElBSkosRUFLRVYsSUFMRixDQUtPLFVBQVV1QyxLQUFWLEVBQWU7QUFDbEJsQywyQkFBT21DLFFBQVAsQ0FBZ0JELEtBQWhCO0FBQ0FoQiw0QkFBUWdCLEtBQVI7QUFDSCxpQkFSRCxFQVFHckMsS0FSSCxDQVFTLFVBQVVDLEtBQVYsRUFBZTtBQUNwQnFCLDJCQUFPckIsS0FBUDtBQUNILGlCQVZEO0FBV0gsYUFaTSxDQUFQO0FBYUgsUzs7Ozs7c0JBN0xTaEIsSyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi9zdGFnZS5kJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vZXZlbnQtZW1pdHRlcic7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgY3JlYXRlQmxvY2sgZnJvbSAnLi4vYmxvY2svZmFjdG9yeSc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCB7IFJvd0ludGVyZmFjZSB9IGZyb20gJy4vc3RydWN0dXJhbC9yb3cuZCc7XG5pbXBvcnQgeyBDb2x1bW5JbnRlcmZhY2UgfSBmcm9tICcuL3N0cnVjdHVyYWwvY29sdW1uLmQnO1xuaW1wb3J0IEJsb2NrIGZyb20gJy4uL2Jsb2NrL2Jsb2NrJztcblxuLyoqXG4gKiBCdWlsZCBDbGFzc1xuICpcbiAqIEBhdXRob3IgRGF2ZSBNYWNhdWxheSA8aGVsbG9AZGF2ZW1hY2F1bGF5LmNvbT5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIHN0YWdlOiBTdGFnZUludGVyZmFjZTtcbiAgICBkb2N1bWVudDogRWxlbWVudDtcblxuICAgIC8qKlxuICAgICAqIFBhcnNlIHRoZSBwb3RlbnRpYWwgc3RydWN0dXJlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RydWN0dXJlXG4gICAgICovXG4gICAgcGFyc2VTdHJ1Y3R1cmUoc3RydWN0dXJlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmRvY3VtZW50LmlubmVySFRNTCA9IHN0cnVjdHVyZTtcblxuICAgICAgICAvLyBSZXR1cm4gdGhlIHN0YWdlIGVsZW1lbnQgaWYgdGhlIHN0cnVjdHVyZSBpcyBwcmVzZW50LCBvdGhlcndpc2UgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1snICsgQ29uZmlnLmdldFZhbHVlKCdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnKSArICc9XCJzdGFnZVwiXScpIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBzdGFnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlXG4gICAgICogQHBhcmFtIHN0YWdlRWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtCdWlsZH1cbiAgICAgKi9cbiAgICBidWlsZFN0YWdlKHN0YWdlOiBTdGFnZUludGVyZmFjZSwgc3RhZ2VFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgICAgIHRoaXMucGFyc2VBbmRCdWlsZFN0YWdlKHN0YWdlRWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGFuZCBidWlsZCB0aGUgc3RhZ2UgZnJvbSB0aGUgc3RhZ2UgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YWdlRWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fVxuICAgICAqL1xuICAgIHBhcnNlQW5kQnVpbGRTdGFnZShzdGFnZUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlQW5kQnVpbGRFbGVtZW50KHN0YWdlRWxlbWVudCwgdGhpcy5zdGFnZSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2J1aWxkRG9uZScpO1xuICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2J1aWxkRXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBhbiBlbGVtZW50IGluIHRoZSBzdHJ1Y3R1cmUgYW5kIGJ1aWxkIHRoZSByZXF1aXJlZCBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxFZGl0YWJsZUFyZWFJbnRlcmZhY2U+fVxuICAgICAqL1xuICAgIHBhcnNlQW5kQnVpbGRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSk6IFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPiB7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAgICAgICAgIGVsZW1lbnQuZ2V0QXR0cmlidXRlKENvbmZpZy5nZXRWYWx1ZUFzU3RyaW5nKCdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQgfHwgdGhpcy5zdGFnZTtcbiAgICAgICAgICAgIGxldCByb2xlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoQ29uZmlnLmdldFZhbHVlQXNTdHJpbmcoJ2RhdGFSb2xlQXR0cmlidXRlTmFtZScpKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gQnVpbGQuZ2V0RWxlbWVudERhdGEoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldEVsZW1lbnRDaGlsZHJlbihlbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gQWRkIGVsZW1lbnQgdG8gc3RhZ2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkRWxlbWVudChyb2xlLCBkYXRhLCBwYXJlbnQpLnRoZW4oKG5ld1BhcmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkUHJvbWlzZXM6IEFycmF5PFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPj4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKGNoaWxkcmVuLCAoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkUHJvbWlzZXMucHVzaCh0aGlzLnBhcnNlQW5kQnVpbGRFbGVtZW50KGNoaWxkLCBuZXdQYXJlbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChjaGlsZFByb21pc2VzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ld1BhcmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdFbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gdmFsaWQgcm9sZSBhdHRyaWJ1dGUuJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmUgdGhlIGVsZW1lbnRzIGRhdGFcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHJldHVybnMge3t9fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRFbGVtZW50RGF0YShlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBsZXQgc2NyaXB0VGFnID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbdHlwZT1cInRleHQvYWR2YW5jZWQtY21zLWRhdGFcIl0nKTtcbiAgICAgICAgaWYgKHNjcmlwdFRhZykge1xuICAgICAgICAgICAgcmV0dXJuIHNjcmlwdFRhZy5pbm5lckhUTUwgPyBKU09OLnBhcnNlKHNjcmlwdFRhZy5pbm5lckhUTUwpIDoge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGVsZW1lbnRzIGNoaWxkcmVuLCBzZWFyY2ggZm9yIGRpcmVjdCBkZWNlZGVudHMsIG9yIHRyYXZlcnNlIHRocm91Z2ggdG8gZmluZCBkZWVwZXIgY2hpbGRyZW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldEVsZW1lbnRDaGlsZHJlbihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbjogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgICAgICAgLy8gRmluZCBkaXJlY3QgY2hpbGRyZW4gb2YgdGhlIGVsZW1lbnRcbiAgICAgICAgICAgIF8uZm9yRWFjaChlbGVtZW50LmNoaWxkTm9kZXMsIChjaGlsZDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBPbmx5IHNlYXJjaCBlbGVtZW50cyB3aGljaCB0YWdOYW1lJ3MgYW5kIG5vdCBzY3JpcHQgdGFnc1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC50YWdOYW1lICYmIGNoaWxkLnRhZ05hbWUgIT0gJ1NDUklQVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLmhhc0F0dHJpYnV0ZShDb25maWcuZ2V0VmFsdWVBc1N0cmluZygnZGF0YVJvbGVBdHRyaWJ1dGVOYW1lJykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRFbGVtZW50Q2hpbGRyZW4oY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZvcndhcmQgYnVpbGQgaW5zdHJ1Y3Rpb24gdG8gbmVjZXNzYXJ5IGJ1aWxkIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9sZVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEVkaXRhYmxlQXJlYUludGVyZmFjZT59XG4gICAgICovXG4gICAgYnVpbGRFbGVtZW50KHJvbGU6IHN0cmluZywgZGF0YTogb2JqZWN0LCBwYXJlbnQ6IGFueSk6IFByb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPiB7XG4gICAgICAgIHN3aXRjaCAocm9sZSkge1xuICAgICAgICAgICAgY2FzZSAnc3RhZ2UnOlxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzdGFnZSBpcyBiZWluZyBidWlsdCwgd2UgZG9uJ3QgbmVlZCB0byBcImJ1aWxkXCIgYW55dGhpbmcsIGp1c3QgcmV0dXJuIHRoZSBzdGFnZSBhcyB0aGVcbiAgICAgICAgICAgICAgICAvLyBuZXcgcGFyZW50XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLnN0YWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ3Jvdyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRSb3coZGF0YSwgcGFyZW50KTtcbiAgICAgICAgICAgIGNhc2UgJ2NvbHVtbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDb2x1bW4oZGF0YSwgcGFyZW50KTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRFbnRpdHkocm9sZSwgZGF0YSwgcGFyZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGEgbmV3IHJvdyB3aXRoIGl0J3MgYXNzb2NpYXRlZCBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSb3dJbnRlcmZhY2U+fVxuICAgICAqL1xuICAgIHByaXZhdGUgYnVpbGRSb3coZGF0YTogb2JqZWN0LCBwYXJlbnQ6IFN0YWdlSW50ZXJmYWNlKTogUHJvbWlzZTxSb3dJbnRlcmZhY2U+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXJlbnQuYWRkUm93KHRoaXMuc3RhZ2UsIGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhIG5ldyBjb2x1bW4gd2l0aCBpdCdzIGFzc29jaWF0ZWQgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHJldHVybnMge1Byb21pc2U8Q29sdW1uSW50ZXJmYWNlPn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGJ1aWxkQ29sdW1uKGRhdGE6IG9iamVjdCwgcGFyZW50OiBSb3dJbnRlcmZhY2UgfCBDb2x1bW5JbnRlcmZhY2UpOiBQcm9taXNlPENvbHVtbkludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBhcmVudC5hZGRDb2x1bW4oZGF0YSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBlbnRpdHkgaW50byB0aGUgc3lzdGVtXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm9sZVxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fVxuICAgICAqL1xuICAgIHByaXZhdGUgYnVpbGRFbnRpdHkocm9sZTogc3RyaW5nLCBkYXRhOiBvYmplY3QsIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlKTogUHJvbWlzZTxCbG9jaz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgY3JlYXRlQmxvY2soXG4gICAgICAgICAgICAgICAgQ29uZmlnLmdldENvbnRlbnRCbG9ja0NvbmZpZyhyb2xlKSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFnZSxcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICApLnRoZW4oZnVuY3Rpb24gKGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKGJsb2NrKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGJsb2NrKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==
