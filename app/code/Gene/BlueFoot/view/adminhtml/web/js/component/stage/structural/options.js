define(["underscore", "knockout"], function (_underscore, _knockout) {
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


    var _proto = Options.prototype;

    _proto.sort = function sort() {
      this.options.sort(function (a, b) {
        return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
      });
    };
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
      this.options(_underscore.without(this.options(), _underscore.findWhere(this.options(), {
        code: code
      })));
      this.sort();
    };

    return Options;
  }();

  return {
    Options: Options
  };
});