define([
    'underscore'
], function (_) {
    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
        } else {
            obj[key] = value;
        }
        return obj;
    }

    return {
        dataAttributes: function () {
            var ns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "bluefoot";

            return {
                read: function read(element) {
                    return Object.keys(element.dataset).filter(function (k) {
                        return k.indexOf(ns) === 0;
                    }).reduce(function (o, k) {
                        o[camelCase(k.slice(ns.length + 1))] = element.dataset[k];
                        return o;
                    }, {});
                },
                write: function write(element, config) {
                    return Object.keys(config).reduce(function (elm, key) {
                        elm.setAttribute("data-" + ns + "-" + decamelize(key, '-'), config[key]);
                        return elm;
                    }, element);
                }
            };
        },
        jsonDataNode: function () {
            var dataNodeType = "text/x-advanced-cms-data";
            return {
                read: function read(element) {
                    var dataNode = element.firstChild;
                    var fallback = {};
                    if (dataNode.nodeType !== Node.ELEMENT_NODE || dataNode.nodeName.toLowerCase() !== 'script' || dataNode.getAttribute('type') !== dataNodeType) {
                        return fallback;
                    }
                    try {
                        return JSON.parse(dataNode.textContent);
                    } catch (e) {
                        console.error(e);
                        return fallback;
                    }
                },
                write: function write(element, config) {
                    var dataNode = document.createElement('script');
                    dataNode.setAttribute('type', dataNodeType);
                    dataNode.appendChild(document.createTextNode(JSON.stringify(config)));
                    element.appendChild(dataNode);
                    return element;
                }
            };
        },
        outerTagName: function () {
            var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tagName';

            return {
                read: function read(element) {
                    return _defineProperty({}, key, element.tagName.toLowerCase());
                },
                write: function write(element, config) {
                    var newElement = document.createElement(config[key]);
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = element.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            attr = _step.value;

                            newElement.setAttribute(attr.nodeName, attr.nodeValue);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = element.childNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            child = _step2.value;

                            newElement.appendChild(child);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    return newElement;
                }
            };
        },
        htmlContent: function () {
            var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'html';
            var select = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (x) {
                return x;
            };

            return {
                read: function read(element) {
                    return _defineProperty({}, key, select(element).innerHTML);
                },
                write: function write(element, config) {
                    select(element).innerHTML = config[key];
                    return element;
                }
            };
        },
        combined: function () {
            for (var _len = arguments.length, strategies = Array(_len), _key = 0; _key < _len; _key++) {
                strategies[_key] = arguments[_key];
            }

            function pick(from, keys, seed) {
                return keys.reduce(function (out, k) {
                    out[k] = from[k];
                    return out;
                }, seed);
            }
            return {
                read: function read(element) {
                    return strategies.reduce(function (config, _ref) {
                        var strategy = _ref.strategy,
                            keys = _ref.keys;
                        return pick(strategy.read(element), keys, config);
                    }, {});
                },
                write: function write(element, config) {
                    return strategies.reduce(function (elm, _ref2) {
                        var strategy = _ref2.strategy,
                            keys = _ref2.keys;
                        return strategy.write(elm, pick(config, keys, {}));
                    }, element);
                }
            };
        }
    };
});