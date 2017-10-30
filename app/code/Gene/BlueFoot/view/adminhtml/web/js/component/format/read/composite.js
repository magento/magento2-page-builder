define(['exports', 'underscore', '../../config'], function (exports, _underscore, _config) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

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
         * @returns {DataObject | Promise<any>}
         */


        AttributeReaderComposite.prototype.read = function read(element) {
            var result = {};
            if (this.contentTypeConfig.hasOwnProperty(element.dataset.role)) {
                var readPromise = new Promise(function (resolve, reject) {
                    require(this.contentTypeConfig[element.dataset.role]['readers'], function () {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        resolve(args);
                    }, reject);
                }.bind(this));
                return readPromise.then(function (readersArray) {
                    for (var i = 0; i < readersArray.length; i++) {
                        var reader = new readersArray[i].default();
                        _underscore2.default.extend(result, reader.read(element));
                    }
                    return result;
                }).catch(function (e) {});
            }
            return result;
        };

        return AttributeReaderComposite;
    }();

    exports.default = AttributeReaderComposite;
});