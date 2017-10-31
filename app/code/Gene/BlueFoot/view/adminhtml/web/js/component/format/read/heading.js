define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Heading = function () {
        function Heading() {
            _classCallCheck(this, Heading);
        }

        Heading.prototype.read = function read(element) {
            return new Promise(function (resolve) {
                resolve({
                    'heading_type': element.nodeName,
                    'title': element.innerText
                });
            });
        };

        return Heading;
    }();

    exports.default = Heading;
});