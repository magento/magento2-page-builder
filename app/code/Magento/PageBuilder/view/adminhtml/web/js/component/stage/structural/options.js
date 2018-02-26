/*eslint-disable */
define(["knockout"], function (_knockout) {
  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Options =
  /*#__PURE__*/
  function () {
    /**
     * Options constructor
     *
     * @param parent
     * @param options
     */
    function Options(parent, options) {
      this.parent = void 0;
      this.options = _knockout.observableArray([]);
      this.parent = parent;
      this.options(options);
      this.sort();
    }

    var _proto = Options.prototype;

    /**
     * Add an option into the options array
     *
     * @param option
     */
    _proto.addOption = function addOption(option) {
      this.options.push(option);
      this.sort();
    };
    /**
     * Remove an option
     *
     * @param code
     */


    _proto.removeOption = function removeOption(code) {
      this.options(this.options().filter(function (option) {
        return option.code !== "remove";
      }));
      this.sort();
    };
    /**
     * Sort the options
     */


    _proto.sort = function sort() {
      this.options.sort(function (a, b) {
        return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
      });
    };

    _createClass(Options, [{
      key: "template",
      get: function get() {
        return "Magento_PageBuilder/component/stage/structural/options.html";
      }
    }]);

    return Options;
  }();

  return {
    Options: Options
  };
});
//# sourceMappingURL=options.js.map
