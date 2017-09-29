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