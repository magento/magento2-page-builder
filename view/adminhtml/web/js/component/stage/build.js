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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9idWlsZC50cyJdLCJuYW1lcyI6WyJfIiwiQnVpbGQiLCJwYXJzZVN0cnVjdHVyZSIsInN0cnVjdHVyZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRWYWx1ZSIsImJ1aWxkU3RhZ2UiLCJzdGFnZSIsInN0YWdlRWxlbWVudCIsInBhcnNlQW5kQnVpbGRTdGFnZSIsInBhcnNlQW5kQnVpbGRFbGVtZW50IiwidGhlbiIsImVtaXQiLCJjYXRjaCIsImVycm9yIiwiZWxlbWVudCIsInBhcmVudCIsIkhUTUxFbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwiZ2V0VmFsdWVBc1N0cmluZyIsInJvbGUiLCJkYXRhIiwiZ2V0RWxlbWVudERhdGEiLCJjaGlsZHJlbiIsImdldEVsZW1lbnRDaGlsZHJlbiIsImJ1aWxkRWxlbWVudCIsIm5ld1BhcmVudCIsImxlbmd0aCIsImNoaWxkUHJvbWlzZXMiLCJmb3JFYWNoIiwiY2hpbGQiLCJwdXNoIiwiUHJvbWlzZSIsImFsbCIsInJlc29sdmUiLCJyZWplY3QiLCJFcnJvciIsInNjcmlwdFRhZyIsIkpTT04iLCJwYXJzZSIsImhhc0NoaWxkTm9kZXMiLCJjaGlsZE5vZGVzIiwidGFnTmFtZSIsImhhc0F0dHJpYnV0ZSIsImJ1aWxkUm93IiwiYnVpbGRDb2x1bW4iLCJidWlsZEVudGl0eSIsImFkZFJvdyIsImFkZENvbHVtbiIsImdldENvbnRlbnRCbG9ja0NvbmZpZyIsImJsb2NrIiwiYWRkQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7UUFBWUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWVFQyxLOzs7Ozs7Ozs7d0JBU1ZDLGMsMkJBQWVDLFMsRUFBaUI7QUFDNUIsaUJBQUtDLFFBQUwsR0FBZ0JBLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7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QjtBQUN6RSxtQkFBTyxJQUFJZ0IsT0FBSixDQUFZLFVBQVVFLE9BQVYsRUFBbUJDLE1BQW5CLEVBQXlCO0FBQ3hDLHVDQUNJLGlCQUFPYyxxQkFBUCxDQUE2QjdCLElBQTdCLENBREosRUFFSUosTUFGSixFQUdJLEtBQUtULEtBSFQsRUFJSWMsSUFKSixFQUtFVixJQUxGLENBS08sVUFBVXVDLEtBQVYsRUFBZTtBQUNsQmxDLDJCQUFPbUMsUUFBUCxDQUFnQkQsS0FBaEI7QUFDQWhCLDRCQUFRZ0IsS0FBUjtBQUNILGlCQVJELEVBUUdyQyxLQVJILENBUVMsVUFBVUMsS0FBVixFQUFlO0FBQ3BCcUIsMkJBQU9yQixLQUFQO0FBQ0gsaUJBVkQ7QUFXSCxhQVpNLENBQVA7QUFhSCxTOzs7OztzQkE3TFNoQixLIiwiZmlsZSI6ImNvbXBvbmVudC9zdGFnZS9idWlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBTdGFnZUludGVyZmFjZSB9IGZyb20gJy4uL3N0YWdlLmQnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi9ldmVudC1lbWl0dGVyJztcbmltcG9ydCBDb25maWcgZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBjcmVhdGVCbG9jayBmcm9tICcuLi9ibG9jay9mYWN0b3J5JztcbmltcG9ydCB7IEVkaXRhYmxlQXJlYUludGVyZmFjZSB9IGZyb20gJy4vc3RydWN0dXJhbC9lZGl0YWJsZS1hcmVhLmQnO1xuaW1wb3J0IHsgUm93SW50ZXJmYWNlIH0gZnJvbSAnLi9zdHJ1Y3R1cmFsL3Jvdy5kJztcbmltcG9ydCB7IENvbHVtbkludGVyZmFjZSB9IGZyb20gJy4vc3RydWN0dXJhbC9jb2x1bW4uZCc7XG5pbXBvcnQgQmxvY2sgZnJvbSAnLi4vYmxvY2svYmxvY2snO1xuXG4vKipcbiAqIEJ1aWxkIENsYXNzXG4gKlxuICogQGF1dGhvciBEYXZlIE1hY2F1bGF5IDxoZWxsb0BkYXZlbWFjYXVsYXkuY29tPlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWlsZCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgc3RhZ2U6IFN0YWdlSW50ZXJmYWNlO1xuICAgIGRvY3VtZW50OiBFbGVtZW50O1xuXG4gICAgLyoqXG4gICAgICogUGFyc2UgdGhlIHBvdGVudGlhbCBzdHJ1Y3R1cmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdHJ1Y3R1cmVcbiAgICAgKi9cbiAgICBwYXJzZVN0cnVjdHVyZShzdHJ1Y3R1cmU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZG9jdW1lbnQuaW5uZXJIVE1MID0gc3RydWN0dXJlO1xuXG4gICAgICAgIC8vIFJldHVybiB0aGUgc3RhZ2UgZWxlbWVudCBpZiB0aGUgc3RydWN0dXJlIGlzIHByZXNlbnQsIG90aGVyd2lzZSByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignWycgKyBDb25maWcuZ2V0VmFsdWUoJ2RhdGFSb2xlQXR0cmlidXRlTmFtZScpICsgJz1cInN0YWdlXCJdJykgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIHN0YWdlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RhZ2VcbiAgICAgKiBAcGFyYW0gc3RhZ2VFbGVtZW50XG4gICAgICogQHJldHVybnMge0J1aWxkfVxuICAgICAqL1xuICAgIGJ1aWxkU3RhZ2Uoc3RhZ2U6IFN0YWdlSW50ZXJmYWNlLCBzdGFnZUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcbiAgICAgICAgdGhpcy5wYXJzZUFuZEJ1aWxkU3RhZ2Uoc3RhZ2VFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgYW5kIGJ1aWxkIHRoZSBzdGFnZSBmcm9tIHRoZSBzdGFnZSBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RhZ2VFbGVtZW50XG4gICAgICogQHJldHVybnMge1Byb21pc2U8VD59XG4gICAgICovXG4gICAgcGFyc2VBbmRCdWlsZFN0YWdlKHN0YWdlRWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VBbmRCdWlsZEVsZW1lbnQoc3RhZ2VFbGVtZW50LCB0aGlzLnN0YWdlKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnYnVpbGREb25lJyk7XG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3I6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnYnVpbGRFcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlIGFuIGVsZW1lbnQgaW4gdGhlIHN0cnVjdHVyZSBhbmQgYnVpbGQgdGhlIHJlcXVpcmVkIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPEVkaXRhYmxlQXJlYUludGVyZmFjZT59XG4gICAgICovXG4gICAgcGFyc2VBbmRCdWlsZEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQsIHBhcmVudDogRWRpdGFibGVBcmVhSW50ZXJmYWNlKTogUHJvbWlzZTxFZGl0YWJsZUFyZWFJbnRlcmZhY2U+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJlxuICAgICAgICAgICAgZWxlbWVudC5nZXRBdHRyaWJ1dGUoQ29uZmlnLmdldFZhbHVlQXNTdHJpbmcoJ2RhdGFSb2xlQXR0cmlidXRlTmFtZScpKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudCB8fCB0aGlzLnN0YWdlO1xuICAgICAgICAgICAgbGV0IHJvbGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShDb25maWcuZ2V0VmFsdWVBc1N0cmluZygnZGF0YVJvbGVBdHRyaWJ1dGVOYW1lJykpLFxuICAgICAgICAgICAgICAgIGRhdGEgPSBCdWlsZC5nZXRFbGVtZW50RGF0YShlbGVtZW50KSxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0RWxlbWVudENoaWxkcmVuKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAvLyBBZGQgZWxlbWVudCB0byBzdGFnZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRFbGVtZW50KHJvbGUsIGRhdGEsIHBhcmVudCkudGhlbigobmV3UGFyZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGRQcm9taXNlczogQXJyYXk8UHJvbWlzZTxFZGl0YWJsZUFyZWFJbnRlcmZhY2U+PiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBfLmZvckVhY2goY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRQcm9taXNlcy5wdXNoKHRoaXMucGFyc2VBbmRCdWlsZEVsZW1lbnQoY2hpbGQsIG5ld1BhcmVudCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGNoaWxkUHJvbWlzZXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3UGFyZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ0VsZW1lbnQgZG9lcyBub3QgY29udGFpbiB2YWxpZCByb2xlIGF0dHJpYnV0ZS4nKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgZWxlbWVudHMgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIGdldEVsZW1lbnREYXRhKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGxldCBzY3JpcHRUYWcgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFt0eXBlPVwidGV4dC9hZHZhbmNlZC1jbXMtZGF0YVwiXScpO1xuICAgICAgICBpZiAoc2NyaXB0VGFnKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NyaXB0VGFnLmlubmVySFRNTCA/IEpTT04ucGFyc2Uoc2NyaXB0VGFnLmlubmVySFRNTCkgOiB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gZWxlbWVudHMgY2hpbGRyZW4sIHNlYXJjaCBmb3IgZGlyZWN0IGRlY2VkZW50cywgb3IgdHJhdmVyc2UgdGhyb3VnaCB0byBmaW5kIGRlZXBlciBjaGlsZHJlblxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0RWxlbWVudENoaWxkcmVuKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgbGV0IGNoaWxkcmVuOiBBcnJheTxhbnk+ID0gW107XG4gICAgICAgICAgICAvLyBGaW5kIGRpcmVjdCBjaGlsZHJlbiBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgICAgXy5mb3JFYWNoKGVsZW1lbnQuY2hpbGROb2RlcywgKGNoaWxkOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIE9ubHkgc2VhcmNoIGVsZW1lbnRzIHdoaWNoIHRhZ05hbWUncyBhbmQgbm90IHNjcmlwdCB0YWdzXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnRhZ05hbWUgJiYgY2hpbGQudGFnTmFtZSAhPSAnU0NSSVBUJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuaGFzQXR0cmlidXRlKENvbmZpZy5nZXRWYWx1ZUFzU3RyaW5nKCdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldEVsZW1lbnRDaGlsZHJlbihjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRyZW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRm9yd2FyZCBidWlsZCBpbnN0cnVjdGlvbiB0byBuZWNlc3NhcnkgYnVpbGQgZnVuY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb2xlXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHJldHVybnMge1Byb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPn1cbiAgICAgKi9cbiAgICBidWlsZEVsZW1lbnQocm9sZTogc3RyaW5nLCBkYXRhOiBvYmplY3QsIHBhcmVudDogYW55KTogUHJvbWlzZTxFZGl0YWJsZUFyZWFJbnRlcmZhY2U+IHtcbiAgICAgICAgc3dpdGNoIChyb2xlKSB7XG4gICAgICAgICAgICBjYXNlICdzdGFnZSc6XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHN0YWdlIGlzIGJlaW5nIGJ1aWx0LCB3ZSBkb24ndCBuZWVkIHRvIFwiYnVpbGRcIiBhbnl0aGluZywganVzdCByZXR1cm4gdGhlIHN0YWdlIGFzIHRoZVxuICAgICAgICAgICAgICAgIC8vIG5ldyBwYXJlbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuc3RhZ2UpO1xuICAgICAgICAgICAgY2FzZSAncm93JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5idWlsZFJvdyhkYXRhLCBwYXJlbnQpO1xuICAgICAgICAgICAgY2FzZSAnY29sdW1uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5idWlsZENvbHVtbihkYXRhLCBwYXJlbnQpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5idWlsZEVudGl0eShyb2xlLCBkYXRhLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYSBuZXcgcm93IHdpdGggaXQncyBhc3NvY2lhdGVkIGRhdGFcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFJvd0ludGVyZmFjZT59XG4gICAgICovXG4gICAgcHJpdmF0ZSBidWlsZFJvdyhkYXRhOiBvYmplY3QsIHBhcmVudDogU3RhZ2VJbnRlcmZhY2UpOiBQcm9taXNlPFJvd0ludGVyZmFjZT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHBhcmVudC5hZGRSb3codGhpcy5zdGFnZSwgZGF0YSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGEgbmV3IGNvbHVtbiB3aXRoIGl0J3MgYXNzb2NpYXRlZCBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxDb2x1bW5JbnRlcmZhY2U+fVxuICAgICAqL1xuICAgIHByaXZhdGUgYnVpbGRDb2x1bW4oZGF0YTogb2JqZWN0LCBwYXJlbnQ6IFJvd0ludGVyZmFjZSB8IENvbHVtbkludGVyZmFjZSk6IFByb21pc2U8Q29sdW1uSW50ZXJmYWNlPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocGFyZW50LmFkZENvbHVtbihkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGFuIGVudGl0eSBpbnRvIHRoZSBzeXN0ZW1cbiAgICAgKlxuICAgICAqIEBwYXJhbSByb2xlXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHJldHVybnMge1Byb21pc2U8VD59XG4gICAgICovXG4gICAgcHJpdmF0ZSBidWlsZEVudGl0eShyb2xlOiBzdHJpbmcsIGRhdGE6IG9iamVjdCwgcGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UpOiBQcm9taXNlPEJsb2NrPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBjcmVhdGVCbG9jayhcbiAgICAgICAgICAgICAgICBDb25maWcuZ2V0Q29udGVudEJsb2NrQ29uZmlnKHJvbGUpLFxuICAgICAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlLFxuICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgICkudGhlbihmdW5jdGlvbiAoYmxvY2spIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYWRkQ2hpbGQoYmxvY2spO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoYmxvY2spO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59Il19
