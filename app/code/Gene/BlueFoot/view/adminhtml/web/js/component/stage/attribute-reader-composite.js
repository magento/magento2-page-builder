define(['exports', 'underscore'], function (exports, _underscore) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

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

            this.readers = {
                'stage': ['Gene_BlueFoot/js/component/stage/default'],
                'row': ['Gene_BlueFoot/js/component/stage/default'],
                'column': ['Gene_BlueFoot/js/component/stage/default'],
                'heading': ['Gene_BlueFoot/js/component/stage/default', 'Gene_BlueFoot/js/component/stage/heading']
            };
        }
        /**
         * Read data from the element
         *
         * @param element
         * @returns {object}
         */


        AttributeReaderComposite.prototype.read = function read(element) {
            if (this.readers.hasOwnProperty(element.dataset.role)) {
                var readPromise = new Promise(function (resolve, reject) {
                    require(this.readers[element.dataset.role], function () {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        resolve(args);
                    }, reject);
                }.bind(this));
                return readPromise.then(function (readersArray) {
                    var result = {};
                    for (var i = 0; i < readersArray.length; i++) {
                        _underscore2.default.extend(result, readersArray[i].default.prototype.read(element));
                    }
                    console.log(result);
                    return result;
                }).catch(function (e) {});
            }
            return {};
        };

        return AttributeReaderComposite;
    }();

    exports.default = AttributeReaderComposite;
});