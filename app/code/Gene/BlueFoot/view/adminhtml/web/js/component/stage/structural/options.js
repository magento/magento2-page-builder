define(["underscore", "knockout"], function (_underscore, _knockout) {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Options Class
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
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
      _classCallCheck(this, Options);

      Object.defineProperty(this, "parent", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: void 0
      });
      Object.defineProperty(this, "options", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: _knockout.observableArray([])
      });
      Object.defineProperty(this, "template", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: 'Gene_BlueFoot/component/stage/structural/options.html'
      });
      this.parent = parent;
      this.options(options);
      this.sort();
    }
    /**
     * Sort the options
     */


    _createClass(Options, [{
      key: "sort",
      value: function sort() {
        this.options.sort(function (a, b) {
          return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
        });
      }
      /**
       * Add an option into the options array
       *
       * @param option
       */

    }, {
      key: "addOption",
      value: function addOption(option) {
        this.options.push(option);
        this.sort();
      }
      /**
       * Remove an option
       *
       * @param code
       */

    }, {
      key: "removeOption",
      value: function removeOption(code) {
        this.options(_underscore.without(this.options(), _underscore.findWhere(this.options(), {
          code: code
        })));
        this.sort();
      }
    }]);

    return Options;
  }();

  return {
    Options: Options
  };
});
//# sourceMappingURL=options.js.map
