/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["knockout", "underscore"], function (_knockout, _underscore) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @api
   */
  var ContentTypeMenu =
  /*#__PURE__*/
  function () {
    /**
     * Options constructor
     *
     * @param parent
     * @param options
     */
    function ContentTypeMenu(parent, options) {
      var _this = this;

      this.options = _knockout.observableArray([]);
      this.parent = parent;

      var codes = _underscore.keys(options);

      _underscore.values(options).forEach(function (option, index) {
        option.code = codes[index];

        _this.options.push(option);
      });

      this.sort();
    }

    var _proto = ContentTypeMenu.prototype;

    /**
     * Get an option from the options array
     *
     * @param {string} code
     * @returns {OptionInterface}
     */
    _proto.getOption = function getOption(code) {
      return this.options().find(function (option) {
        return option.code === code;
      });
    };
    /**
     * Sort the options
     */


    _proto.sort = function sort() {
      this.options.sort(function (a, b) {
        return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
      });
    };

    _createClass(ContentTypeMenu, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/content-type/menu";
      }
    }]);

    return ContentTypeMenu;
  }();

  return _extends(ContentTypeMenu, {
    __esModule: true
  });
});
//# sourceMappingURL=content-type-menu.js.map
