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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3RzL2NvbXBvbmVudC9zdGFnZS9idWlsZC50cyJdLCJuYW1lcyI6WyJfIiwiQnVpbGQiLCJwYXJzZVN0cnVjdHVyZSIsInN0cnVjdHVyZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRWYWx1ZSIsImJ1aWxkU3RhZ2UiLCJzdGFnZSIsInN0YWdlRWxlbWVudCIsInBhcnNlQW5kQnVpbGRTdGFnZSIsInBhcnNlQW5kQnVpbGRFbGVtZW50IiwidGhlbiIsImVtaXQiLCJjYXRjaCIsImVycm9yIiwiZWxlbWVudCIsInBhcmVudCIsIkhUTUxFbGVtZW50IiwiZ2V0QXR0cmlidXRlIiwiZ2V0VmFsdWVBc1N0cmluZyIsInJvbGUiLCJkYXRhIiwiZ2V0RWxlbWVudERhdGEiLCJjaGlsZHJlbiIsImdldEVsZW1lbnRDaGlsZHJlbiIsImJ1aWxkRWxlbWVudCIsIm5ld1BhcmVudCIsImxlbmd0aCIsImNoaWxkUHJvbWlzZXMiLCJmb3JFYWNoIiwiY2hpbGQiLCJwdXNoIiwiUHJvbWlzZSIsImFsbCIsInJlc29sdmUiLCJyZWplY3QiLCJFcnJvciIsInNjcmlwdFRhZyIsIkpTT04iLCJwYXJzZSIsImhhc0NoaWxkTm9kZXMiLCJjaGlsZE5vZGVzIiwidGFnTmFtZSIsImhhc0F0dHJpYnV0ZSIsImJ1aWxkUm93IiwiYnVpbGRDb2x1bW4iLCJidWlsZEVudGl0eSIsImFkZFJvdyIsImFkZENvbHVtbiIsImdldENvbnRlbnRCbG9ja0NvbmZpZyIsImJsb2NrIiwiYWRkQ2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7UUFBWUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWVFQyxLOzs7Ozs7Ozs7d0JBU1ZDLGMsMkJBQWVDLFMsRUFBaUI7QUFDNUIsaUJBQUtDLFFBQUwsR0FBZ0JBLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7QUFDQSxpQkFBS0QsUUFBTCxDQUFjRSxTQUFkLEdBQTBCSCxTQUExQjtBQUVBO0FBQ0EsbUJBQU8sS0FBS0MsUUFBTCxDQUFjRyxhQUFkLENBQTRCLE1BQU0saUJBQU9DLFFBQVAsQ0FBZ0IsdUJBQWhCLENBQU4sR0FBaUQsV0FBN0UsS0FBNkYsS0FBcEc7QUFDSCxTOzt3QkFTREMsVSx1QkFBV0MsSyxFQUF1QkMsWSxFQUF5QjtBQUN2RCxpQkFBS0QsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsaUJBQUtFLGtCQUFMLENBQXdCRCxZQUF4QjtBQUNBLG1CQUFPLElBQVA7QUFDSCxTOzt3QkFRREMsa0IsK0JBQW1CRCxZLEVBQXlCO0FBQUE7O0FBQ3hDLG1CQUFPLEtBQUtFLG9CQUFMLENBQTBCRixZQUExQixFQUF3QyxLQUFLRCxLQUE3QyxFQUNGSSxJQURFLENBQ0csWUFBQTtBQUNGLHVCQUFLQyxJQUFMLENBQVUsV0FBVjtBQUNILGFBSEUsRUFHQUMsS0FIQSxDQUdNLFVBQUNDLEtBQUQsRUFBYztBQUNuQix1QkFBS0YsSUFBTCxDQUFVLFlBQVYsRUFBd0JFLEtBQXhCO0FBQ0gsYUFMRSxDQUFQO0FBTUgsUzs7d0JBU0RKLG9CLGlDQUFxQkssTyxFQUFzQkMsTSxFQUE2QjtBQUFBOztBQUNwRSxnQkFBSUQsbUJBQW1CRSxXQUFuQixJQUNBRixRQUFRRyxZQUFSLENBQXFCLGlCQUFPQyxnQkFBUCxDQUF3Qix1QkFBeEIsQ0FBckIsQ0FESixFQUVFO0FBQ0VILHlCQUFTQSxVQUFVLEtBQUtULEtBQXhCO0FBQ0Esb0JBQUlhLE9BQU9MLFFBQVFHLFlBQVIsQ0FBcUIsaUJBQU9DLGdCQUFQLENBQXdCLHVCQUF4QixDQUFyQixDQUFYO0FBQUEsb0JBQ0lFLE9BQU92QixNQUFNd0IsY0FBTixDQUFxQlAsT0FBckIsQ0FEWDtBQUFBLG9CQUVJUSxXQUFXLEtBQUtDLGtCQUFMLENBQXdCVCxPQUF4QixDQUZmO0FBSUE7QUFDQSx1QkFBTyxLQUFLVSxZQUFMLENBQWtCTCxJQUFsQixFQUF3QkMsSUFBeEIsRUFBOEJMLE1BQTlCLEVBQXNDTCxJQUF0QyxDQUEyQyxVQUFDZSxTQUFELEVBQWU7QUFDN0Qsd0JBQUlILFNBQVNJLE1BQVQsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDckIsNEJBQUlDLGdCQUF1RCxFQUEzRDtBQUNBL0IsMEJBQUVnQyxPQUFGLENBQVVOLFFBQVYsRUFBb0IsVUFBQ08sS0FBRCxFQUFNO0FBQ3RCRiwwQ0FBY0csSUFBZCxDQUFtQixPQUFLckIsb0JBQUwsQ0FBMEJvQixLQUExQixFQUFpQ0osU0FBakMsQ0FBbkI7QUFDSCx5QkFGRDtBQUdBLCtCQUFPTSxRQUFRQyxHQUFSLENBQVlMLGFBQVosQ0FBUDtBQUNILHFCQU5ELE1BTU87QUFDSCwrQkFBT0ksUUFBUUUsT0FBUixDQUFnQlIsU0FBaEIsQ0FBUDtBQUNIO0FBQ0osaUJBVk0sQ0FBUDtBQVdILGFBcEJELE1Bb0JPO0FBQ0gsdUJBQU9NLFFBQVFHLE1BQVIsQ0FBZSxJQUFJQyxLQUFKLENBQVUsZ0RBQVYsQ0FBZixDQUFQO0FBQ0g7QUFDSixTOztjQVFNZCxjLDJCQUFlUCxPLEVBQW9CO0FBQ3RDLGdCQUFJc0IsWUFBWXRCLFFBQVFYLGFBQVIsQ0FBc0IsdUNBQXRCLENBQWhCO0FBQ0EsZ0JBQUlpQyxTQUFKLEVBQWU7QUFDWCx1QkFBT0EsVUFBVWxDLFNBQVYsR0FBc0JtQyxLQUFLQyxLQUFMLENBQVdGLFVBQVVsQyxTQUFyQixDQUF0QixHQUF3RCxFQUEvRDtBQUNIO0FBRUQsbUJBQU8sRUFBUDtBQUNILFM7O3dCQVFEcUIsa0IsK0JBQW1CVCxPLEVBQW9CO0FBQUE7O0FBQ25DLGdCQUFJQSxRQUFReUIsYUFBUixFQUFKLEVBQTZCO0FBQ3pCLG9CQUFJakIsV0FBdUIsRUFBM0I7QUFDQTtBQUNBMUIsa0JBQUVnQyxPQUFGLENBQVVkLFFBQVEwQixVQUFsQixFQUE4QixVQUFDWCxLQUFELEVBQW1CO0FBQzdDO0FBQ0Esd0JBQUlBLE1BQU1ZLE9BQU4sSUFBaUJaLE1BQU1ZLE9BQU4sSUFBaUIsUUFBdEMsRUFBZ0Q7QUFDNUMsNEJBQUlaLE1BQU1hLFlBQU4sQ0FBbUIsaUJBQU94QixnQkFBUCxDQUF3Qix1QkFBeEIsQ0FBbkIsQ0FBSixFQUEwRTtBQUN0RUkscUNBQVNRLElBQVQsQ0FBY0QsS0FBZDtBQUNILHlCQUZELE1BRU87QUFDSFAsdUNBQVcsT0FBS0Msa0JBQUwsQ0FBd0JNLEtBQXhCLENBQVg7QUFDSDtBQUNKO0FBQ0osaUJBVEQ7QUFXQSxvQkFBSVAsU0FBU0ksTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUNyQiwyQkFBT0osUUFBUDtBQUNIO0FBQ0o7QUFFRCxtQkFBTyxFQUFQO0FBQ0gsUzs7d0JBVURFLFkseUJBQWFMLEksRUFBY0MsSSxFQUFjTCxNLEVBQVc7QUFDaEQsb0JBQVFJLElBQVI7QUFDSSxxQkFBSyxPQUFMO0FBQ0k7QUFDQTtBQUNBLDJCQUFPWSxRQUFRRSxPQUFSLENBQWdCLEtBQUszQixLQUFyQixDQUFQO0FBQ0oscUJBQUssS0FBTDtBQUNJLDJCQUFPLEtBQUtxQyxRQUFMLENBQWN2QixJQUFkLEVBQW9CTCxNQUFwQixDQUFQO0FBQ0oscUJBQUssUUFBTDtBQUNJLDJCQUFPLEtBQUs2QixXQUFMLENBQWlCeEIsSUFBakIsRUFBdUJMLE1BQXZCLENBQVA7QUFDSjtBQUNJLDJCQUFPLEtBQUs4QixXQUFMLENBQWlCMUIsSUFBakIsRUFBdUJDLElBQXZCLEVBQTZCTCxNQUE3QixDQUFQO0FBVlI7QUFZSCxTOzt3QkFTTzRCLFEscUJBQVN2QixJLEVBQWNMLE0sRUFBc0I7QUFDakQsbUJBQU9nQixRQUFRRSxPQUFSLENBQWdCbEIsT0FBTytCLE1BQVAsQ0FBYyxLQUFLeEMsS0FBbkIsRUFBMEJjLElBQTFCLENBQWhCLENBQVA7QUFDSCxTOzt3QkFTT3dCLFcsd0JBQVl4QixJLEVBQWNMLE0sRUFBc0M7QUFDcEUsbUJBQU9nQixRQUFRRSxPQUFSLENBQWdCbEIsT0FBT2dDLFNBQVAsQ0FBaUIzQixJQUFqQixDQUFoQixDQUFQO0FBQ0gsUzs7d0JBVU95QixXLHdCQUFZMUIsSSxFQUFjQyxJLEVBQWNMLE0sRUFBNkI7QUFDekUsbUJBQU8sSUFBSWdCLE9BQUosQ0FBWSxVQUFVRSxPQUFWLEVBQW1CQyxNQUFuQixFQUF5QjtBQUN4Qyx1Q0FDSSxpQkFBT2MscUJBQVAsQ0FBNkI3QixJQUE3QixDQURKLEVBRUlKLE1BRkosRUFHSSxLQUFLVCxLQUhULEVBSUljLElBSkosRUFLRVYsSUFMRixDQUtPLFVBQVV1QyxLQUFWLEVBQWU7QUFDbEJsQywyQkFBT21DLFFBQVAsQ0FBZ0JELEtBQWhCO0FBQ0FoQiw0QkFBUWdCLEtBQVI7QUFDSCxpQkFSRCxFQVFHckMsS0FSSCxDQVFTLFVBQVVDLEtBQVYsRUFBZTtBQUNwQnFCLDJCQUFPckIsS0FBUDtBQUNILGlCQVZEO0FBV0gsYUFaTSxDQUFQO0FBYUgsUzs7Ozs7c0JBN0xTaEIsSyIsImZpbGUiOiJjb21wb25lbnQvc3RhZ2UvYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgU3RhZ2VJbnRlcmZhY2UgfSBmcm9tICcuLi9zdGFnZS5kJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vZXZlbnQtZW1pdHRlcic7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgY3JlYXRlQmxvY2sgZnJvbSAnLi4vYmxvY2svZmFjdG9yeSc7XG5pbXBvcnQgeyBFZGl0YWJsZUFyZWFJbnRlcmZhY2UgfSBmcm9tICcuL3N0cnVjdHVyYWwvZWRpdGFibGUtYXJlYS5kJztcbmltcG9ydCB7IFJvd0ludGVyZmFjZSB9IGZyb20gJy4vc3RydWN0dXJhbC9yb3cuZCc7XG5pbXBvcnQgeyBDb2x1bW5JbnRlcmZhY2UgfSBmcm9tICcuL3N0cnVjdHVyYWwvY29sdW1uLmQnO1xuaW1wb3J0IHsgQmxvY2sgfSBmcm9tICcuLi9ibG9jay9ibG9jayc7XG5cbi8qKlxuICogQnVpbGQgQ2xhc3NcbiAqXG4gKiBAYXV0aG9yIERhdmUgTWFjYXVsYXkgPGhlbGxvQGRhdmVtYWNhdWxheS5jb20+XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBzdGFnZTogU3RhZ2VJbnRlcmZhY2U7XG4gICAgZG9jdW1lbnQ6IEVsZW1lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSB0aGUgcG90ZW50aWFsIHN0cnVjdHVyZVxuICAgICAqXG4gICAgICogQHBhcmFtIHN0cnVjdHVyZVxuICAgICAqL1xuICAgIHBhcnNlU3RydWN0dXJlKHN0cnVjdHVyZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5kb2N1bWVudC5pbm5lckhUTUwgPSBzdHJ1Y3R1cmU7XG5cbiAgICAgICAgLy8gUmV0dXJuIHRoZSBzdGFnZSBlbGVtZW50IGlmIHRoZSBzdHJ1Y3R1cmUgaXMgcHJlc2VudCwgb3RoZXJ3aXNlIHJldHVybiBmYWxzZVxuICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbJyArIENvbmZpZy5nZXRWYWx1ZSgnZGF0YVJvbGVBdHRyaWJ1dGVOYW1lJykgKyAnPVwic3RhZ2VcIl0nKSB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgc3RhZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGFnZVxuICAgICAqIEBwYXJhbSBzdGFnZUVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7QnVpbGR9XG4gICAgICovXG4gICAgYnVpbGRTdGFnZShzdGFnZTogU3RhZ2VJbnRlcmZhY2UsIHN0YWdlRWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5zdGFnZSA9IHN0YWdlO1xuICAgICAgICB0aGlzLnBhcnNlQW5kQnVpbGRTdGFnZShzdGFnZUVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBhbmQgYnVpbGQgdGhlIHN0YWdlIGZyb20gdGhlIHN0YWdlIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGFnZUVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAgICAgKi9cbiAgICBwYXJzZUFuZEJ1aWxkU3RhZ2Uoc3RhZ2VFbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUFuZEJ1aWxkRWxlbWVudChzdGFnZUVsZW1lbnQsIHRoaXMuc3RhZ2UpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdidWlsZERvbmUnKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdidWlsZEVycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2UgYW4gZWxlbWVudCBpbiB0aGUgc3RydWN0dXJlIGFuZCBidWlsZCB0aGUgcmVxdWlyZWQgZWxlbWVudFxuICAgICAqXG4gICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHJldHVybnMge1Byb21pc2U8RWRpdGFibGVBcmVhSW50ZXJmYWNlPn1cbiAgICAgKi9cbiAgICBwYXJzZUFuZEJ1aWxkRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCwgcGFyZW50OiBFZGl0YWJsZUFyZWFJbnRlcmZhY2UpOiBQcm9taXNlPEVkaXRhYmxlQXJlYUludGVyZmFjZT4ge1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG4gICAgICAgICAgICBlbGVtZW50LmdldEF0dHJpYnV0ZShDb25maWcuZ2V0VmFsdWVBc1N0cmluZygnZGF0YVJvbGVBdHRyaWJ1dGVOYW1lJykpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50IHx8IHRoaXMuc3RhZ2U7XG4gICAgICAgICAgICBsZXQgcm9sZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKENvbmZpZy5nZXRWYWx1ZUFzU3RyaW5nKCdkYXRhUm9sZUF0dHJpYnV0ZU5hbWUnKSksXG4gICAgICAgICAgICAgICAgZGF0YSA9IEJ1aWxkLmdldEVsZW1lbnREYXRhKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gdGhpcy5nZXRFbGVtZW50Q2hpbGRyZW4oZWxlbWVudCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBlbGVtZW50IHRvIHN0YWdlXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5idWlsZEVsZW1lbnQocm9sZSwgZGF0YSwgcGFyZW50KS50aGVuKChuZXdQYXJlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjaGlsZFByb21pc2VzOiBBcnJheTxQcm9taXNlPEVkaXRhYmxlQXJlYUludGVyZmFjZT4+ID0gW107XG4gICAgICAgICAgICAgICAgICAgIF8uZm9yRWFjaChjaGlsZHJlbiwgKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFByb21pc2VzLnB1c2godGhpcy5wYXJzZUFuZEJ1aWxkRWxlbWVudChjaGlsZCwgbmV3UGFyZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2hpbGRQcm9taXNlcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXdQYXJlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignRWxlbWVudCBkb2VzIG5vdCBjb250YWluIHZhbGlkIHJvbGUgYXR0cmlidXRlLicpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIHRoZSBlbGVtZW50cyBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEByZXR1cm5zIHt7fX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0RWxlbWVudERhdGEoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IHNjcmlwdFRhZyA9IGVsZW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W3R5cGU9XCJ0ZXh0L2FkdmFuY2VkLWNtcy1kYXRhXCJdJyk7XG4gICAgICAgIGlmIChzY3JpcHRUYWcpIHtcbiAgICAgICAgICAgIHJldHVybiBzY3JpcHRUYWcuaW5uZXJIVE1MID8gSlNPTi5wYXJzZShzY3JpcHRUYWcuaW5uZXJIVE1MKSA6IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBlbGVtZW50cyBjaGlsZHJlbiwgc2VhcmNoIGZvciBkaXJlY3QgZGVjZWRlbnRzLCBvciB0cmF2ZXJzZSB0aHJvdWdoIHRvIGZpbmQgZGVlcGVyIGNoaWxkcmVuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRFbGVtZW50Q2hpbGRyZW4oZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGRyZW46IEFycmF5PGFueT4gPSBbXTtcbiAgICAgICAgICAgIC8vIEZpbmQgZGlyZWN0IGNoaWxkcmVuIG9mIHRoZSBlbGVtZW50XG4gICAgICAgICAgICBfLmZvckVhY2goZWxlbWVudC5jaGlsZE5vZGVzLCAoY2hpbGQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gT25seSBzZWFyY2ggZWxlbWVudHMgd2hpY2ggdGFnTmFtZSdzIGFuZCBub3Qgc2NyaXB0IHRhZ3NcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQudGFnTmFtZSAmJiBjaGlsZC50YWdOYW1lICE9ICdTQ1JJUFQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5oYXNBdHRyaWJ1dGUoQ29uZmlnLmdldFZhbHVlQXNTdHJpbmcoJ2RhdGFSb2xlQXR0cmlidXRlTmFtZScpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0RWxlbWVudENoaWxkcmVuKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGb3J3YXJkIGJ1aWxkIGluc3RydWN0aW9uIHRvIG5lY2Vzc2FyeSBidWlsZCBmdW5jdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHJvbGVcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxFZGl0YWJsZUFyZWFJbnRlcmZhY2U+fVxuICAgICAqL1xuICAgIGJ1aWxkRWxlbWVudChyb2xlOiBzdHJpbmcsIGRhdGE6IG9iamVjdCwgcGFyZW50OiBhbnkpOiBQcm9taXNlPEVkaXRhYmxlQXJlYUludGVyZmFjZT4ge1xuICAgICAgICBzd2l0Y2ggKHJvbGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3N0YWdlJzpcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgc3RhZ2UgaXMgYmVpbmcgYnVpbHQsIHdlIGRvbid0IG5lZWQgdG8gXCJidWlsZFwiIGFueXRoaW5nLCBqdXN0IHJldHVybiB0aGUgc3RhZ2UgYXMgdGhlXG4gICAgICAgICAgICAgICAgLy8gbmV3IHBhcmVudFxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5zdGFnZSk7XG4gICAgICAgICAgICBjYXNlICdyb3cnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkUm93KGRhdGEsIHBhcmVudCk7XG4gICAgICAgICAgICBjYXNlICdjb2x1bW4nOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkQ29sdW1uKGRhdGEsIHBhcmVudCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmJ1aWxkRW50aXR5KHJvbGUsIGRhdGEsIHBhcmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhIG5ldyByb3cgd2l0aCBpdCdzIGFzc29jaWF0ZWQgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gcGFyZW50XG4gICAgICogQHJldHVybnMge1Byb21pc2U8Um93SW50ZXJmYWNlPn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGJ1aWxkUm93KGRhdGE6IG9iamVjdCwgcGFyZW50OiBTdGFnZUludGVyZmFjZSk6IFByb21pc2U8Um93SW50ZXJmYWNlPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocGFyZW50LmFkZFJvdyh0aGlzLnN0YWdlLCBkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYSBuZXcgY29sdW1uIHdpdGggaXQncyBhc3NvY2lhdGVkIGRhdGFcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIHBhcmVudFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPENvbHVtbkludGVyZmFjZT59XG4gICAgICovXG4gICAgcHJpdmF0ZSBidWlsZENvbHVtbihkYXRhOiBvYmplY3QsIHBhcmVudDogUm93SW50ZXJmYWNlIHwgQ29sdW1uSW50ZXJmYWNlKTogUHJvbWlzZTxDb2x1bW5JbnRlcmZhY2U+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXJlbnQuYWRkQ29sdW1uKGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYW4gZW50aXR5IGludG8gdGhlIHN5c3RlbVxuICAgICAqXG4gICAgICogQHBhcmFtIHJvbGVcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBwYXJlbnRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGJ1aWxkRW50aXR5KHJvbGU6IHN0cmluZywgZGF0YTogb2JqZWN0LCBwYXJlbnQ6IEVkaXRhYmxlQXJlYUludGVyZmFjZSk6IFByb21pc2U8QmxvY2s+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGNyZWF0ZUJsb2NrKFxuICAgICAgICAgICAgICAgIENvbmZpZy5nZXRDb250ZW50QmxvY2tDb25maWcocm9sZSksXG4gICAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2UsXG4gICAgICAgICAgICAgICAgZGF0YVxuICAgICAgICAgICAgKS50aGVuKGZ1bmN0aW9uIChibG9jaykge1xuICAgICAgICAgICAgICAgIHBhcmVudC5hZGRDaGlsZChibG9jayk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShibG9jayk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=
