define(['exports', 'underscore', 'require', '../../config'], function (exports, _underscore, _require, _config) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

    var _require2 = _interopRequireDefault(_require);

    var _config2 = _interopRequireDefault(_config);

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

    var AttributeReaderComposite = function () {
        function AttributeReaderComposite() {
            _classCallCheck(this, AttributeReaderComposite);

            this.contentTypeConfig = _config2.default.getInitConfig('contentTypes');
        }
        /**
         * Read data from the element
         *
         * @param element
         * @returns {Promise<any>}
         */


        AttributeReaderComposite.prototype.read = function read(element) {
            var _this = this;

            var result = {};
            return new Promise(function (resolve, reject) {
                var role = element.dataset.role;
                if (!_this.contentTypeConfig.hasOwnProperty(role)) {
                    resolve(result);
                } else {
                    try {
                        (0, _require2.default)(_this.contentTypeConfig[role]['readers'], function () {
                            for (var _len = arguments.length, readers = Array(_len), _key = 0; _key < _len; _key++) {
                                readers[_key] = arguments[_key];
                            }

                            var readerPromises = [];
                            for (var i = 0; i < readers.length; i++) {
                                var reader = new readers[i].default();
                                readerPromises.push(reader.read(element));
                            }
                            Promise.all(readerPromises).then(function (readersData) {
                                readersData.forEach(function (data) {
                                    _underscore2.default.extend(result, data);
                                });
                                console.log(result);
                                resolve(result);
                            }).catch(function (error) {
                                console.error(error);
                            });
                        });
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        };

        return AttributeReaderComposite;
    }();

    exports.default = AttributeReaderComposite;
});