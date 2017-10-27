define(["underscore", "../../../utils/style-attribute-mapper"], function (_underscore, _styleAttributeMapper) {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Default =
  /*#__PURE__*/
  function () {
    function Default() {
      _classCallCheck(this, Default);

      Object.defineProperty(this, "styleAttributeMapper", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      this.styleAttributeMapper = new _styleAttributeMapper();
    }
    /**
     * Read data, style and css properties from the element
     *
     * @param element
     * @returns {object}
     */


    _createClass(Default, [{
      key: "read",
      value: function read(element) {
        var data = {};
        var styleAttributes = {};
        Object.keys(element.style).map(function (key) {
          if (isNaN(key) && element.style[key] !== '') {
            styleAttributes[key] = element.style[key];
          }
        });

        _underscore.extend(data, this.styleAttributeMapper.fromDom(styleAttributes));

        Object.keys(element.dataset).map(function (key) {
          if (element.dataset[key] !== '') {
            data[key] = element.dataset[key];
          }
        });
        data['css_classes'] = element.className.split(' ');
        return data;
      }
    }]);

    return Default;
  }();

  return Default;
});
//# sourceMappingURL=default.js.map
